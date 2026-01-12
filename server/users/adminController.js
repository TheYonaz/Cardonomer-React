const User = require("./models/mongoDB/User");
const Post = require("../posts/mongoose/Post");
const AdminAuditLog = require("../models/AdminAuditLog");
const { handleError } = require("../utils/errorHandling");
const { generatePassword } = require("./helpers/bcrypt");
const {
  createEmailVerificationToken,
  createPasswordResetToken,
} = require("./helpers/emailTokens");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendCustomEmail,
} = require("../email/sendGridService");
const {
  emailVerificationTemplate,
  passwordResetTemplate,
} = require("../email/templates/emailTemplates");
const { getEmailLogs } = require("../email/emailLogger");
const {
  validateSuspendUser,
  validateCustomEmail,
} = require("./validators/adminValidation");
const config = require("config");

const FRONTEND_URL = config.get("FRONTEND_URL") || "http://localhost:3000";

/**
 * Helper function to log admin actions
 */
const logAdminAction = async (adminId, action, targetUserId, details, req) => {
  try {
    const auditLog = new AdminAuditLog({
      adminId,
      action,
      targetUserId,
      timestamp: new Date(),
      details,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("user-agent"),
    });
    await auditLog.save();
  } catch (error) {
    console.error("Error logging admin action:", error.message);
  }
};

/**
 * Get all users with detailed information
 */
const adminGetAllUsersDetailed = async (req, res) => {
  try {
    const users = await User.find({})
      .select(
        "-password -emailVerificationToken -passwordResetToken -__v"
      )
      .sort({ createdAt: -1 });

    const usersWithStats = users.map((user) => ({
      ...user.toObject(),
      stats: {
        posts: user.publishedPosts?.length || 0,
        decks: user.pokemonDecks?.length || 0,
        friends: user.friends?.length || 0,
      },
    }));

    return res.send(usersWithStats);
  } catch (error) {
    console.error("adminGetAllUsersDetailed error:", error.message);
    return handleError(res, 500, "Error fetching users");
  }
};

/**
 * Suspend a user account
 */
const adminSuspendUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    const adminId = req.user._id;

    // Validate
    const { error } = validateSuspendUser({ reason });
    if (error) {
      return handleError(res, 400, `Validation Error: ${error.details[0].message}`);
    }

    const user = await User.findById(userId);
    if (!user) {
      return handleError(res, 404, "User not found");
    }

    if (!user.isActive) {
      return handleError(res, 400, "User is already suspended");
    }

    // Don't allow suspending admins
    if (user.isAdmin) {
      return handleError(res, 403, "Cannot suspend admin users");
    }

    // Suspend user
    user.isActive = false;
    user.suspendedAt = new Date();
    user.suspendedBy = adminId;
    user.suspendedReason = reason;
    await user.save();

    // Log action
    await logAdminAction(adminId, "suspend_user", userId, { reason }, req);

    return res.send({
      message: "User suspended successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        suspendedAt: user.suspendedAt,
      },
    });
  } catch (error) {
    console.error("adminSuspendUser error:", error.message);
    return handleError(res, 500, "Error suspending user");
  }
};

/**
 * Activate a suspended user account
 */
const adminActivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return handleError(res, 404, "User not found");
    }

    if (user.isActive) {
      return handleError(res, 400, "User is already active");
    }

    // Activate user
    user.isActive = true;
    user.suspendedAt = undefined;
    user.suspendedBy = undefined;
    user.suspendedReason = undefined;
    await user.save();

    // Log action
    await logAdminAction(adminId, "activate_user", userId, {}, req);

    return res.send({
      message: "User activated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("adminActivateUser error:", error.message);
    return handleError(res, 500, "Error activating user");
  }
};

/**
 * Delete a user (with cascading delete of posts)
 */
const adminDeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return handleError(res, 404, "User not found");
    }

    // Don't allow deleting admins
    if (user.isAdmin) {
      return handleError(res, 403, "Cannot delete admin users");
    }

    // Delete user's posts
    await Post.deleteMany({ user_id: userId });

    // Log action before deletion
    await logAdminAction(
      adminId,
      "delete_user",
      userId,
      {
        userName: `${user.name.first} ${user.name.last}`,
        userEmail: user.email,
      },
      req
    );

    // Delete user
    await User.findByIdAndDelete(userId);

    return res.send({
      message: "User and all associated data deleted successfully",
    });
  } catch (error) {
    console.error("adminDeleteUser error:", error.message);
    return handleError(res, 500, "Error deleting user");
  }
};

/**
 * Manually verify a user's email
 */
const adminManualVerifyEmail = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return handleError(res, 404, "User not found");
    }

    if (user.emailVerified) {
      return handleError(res, 400, "Email is already verified");
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Log action
    await logAdminAction(adminId, "verify_email", userId, {}, req);

    return res.send({
      message: "Email verified successfully",
      user: {
        _id: user._id,
        email: user.email,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error("adminManualVerifyEmail error:", error.message);
    return handleError(res, 500, "Error verifying email");
  }
};

/**
 * Unverify a user's email (for testing/support)
 */
const adminUnverifyEmail = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return handleError(res, 404, "User not found");
    }

    if (!user.emailVerified) {
      return handleError(res, 400, "Email is already unverified");
    }

    user.emailVerified = false;
    await user.save();

    // Log action
    await logAdminAction(adminId, "unverify_email", userId, {}, req);

    return res.send({
      message: "Email unverified successfully",
      user: {
        _id: user._id,
        email: user.email,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error("adminUnverifyEmail error:", error.message);
    return handleError(res, 500, "Error unverifying email");
  }
};

/**
 * Admin reset user password (generates and sends reset link)
 */
const adminResetUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return handleError(res, 404, "User not found");
    }

    // Generate password reset token
    const { token, hashedToken, expires } = createPasswordResetToken();
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = expires;
    await user.save();

    // Send password reset email
    const resetLink = `${FRONTEND_URL}/reset-password/${token}`;
    const userName = `${user.name.first} ${user.name.last}`;
    const emailTemplate = passwordResetTemplate(resetLink, userName);

    await sendPasswordResetEmail(user.email, userName, emailTemplate, user._id);

    // Log action
    await logAdminAction(adminId, "reset_password", userId, {}, req);

    return res.send({
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("adminResetUserPassword error:", error.message);
    return handleError(res, 500, "Error resetting user password");
  }
};

/**
 * Admin resend verification email
 */
const adminResendVerification = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return handleError(res, 404, "User not found");
    }

    if (user.emailVerified) {
      return handleError(res, 400, "Email is already verified");
    }

    // Generate new verification token
    const { token, hashedToken, expires } = createEmailVerificationToken();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = expires;
    await user.save();

    // Send verification email
    const verificationLink = `${FRONTEND_URL}/verify-email/${token}`;
    const userName = `${user.name.first} ${user.name.last}`;
    const emailTemplate = emailVerificationTemplate(verificationLink, userName);

    await sendVerificationEmail(user.email, userName, emailTemplate, user._id);

    // Log action
    await logAdminAction(adminId, "resend_verification", userId, {}, req);

    return res.send({
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("adminResendVerification error:", error.message);
    return handleError(res, 500, "Error resending verification email");
  }
};

/**
 * Send custom email to users
 */
const adminSendCustomEmail = async (req, res) => {
  try {
    const { recipients, subject, message } = req.body;
    const adminId = req.user._id;

    // Validate
    const { error } = validateCustomEmail({ recipients, subject, message });
    if (error) {
      return handleError(res, 400, `Validation Error: ${error.details[0].message}`);
    }

    const successCount = [];
    const failedCount = [];

    // Send email to each recipient
    for (const email of recipients) {
      try {
        const user = await User.findOne({ email });
        if (user) {
          const success = await sendCustomEmail(
            email,
            subject,
            message,
            user._id,
            adminId
          );
          
          if (success) {
            successCount.push(email);
          } else {
            failedCount.push(email);
          }
        } else {
          failedCount.push(email);
        }
      } catch (err) {
        failedCount.push(email);
      }
    }

    // Log action
    await logAdminAction(
      adminId,
      "send_custom_email",
      null,
      { recipientCount: recipients.length, subject },
      req
    );

    return res.send({
      message: `Emails sent: ${successCount.length} successful, ${failedCount.length} failed`,
      success: successCount,
      failed: failedCount,
    });
  } catch (error) {
    console.error("adminSendCustomEmail error:", error.message);
    return handleError(res, 500, "Error sending custom emails");
  }
};

/**
 * Get email logs with filters
 */
const adminGetEmailLogs = async (req, res) => {
  try {
    const { userId, emailType, status, startDate, endDate, limit } = req.query;

    const filters = {};
    if (userId) filters.userId = userId;
    if (emailType) filters.emailType = emailType;
    if (status) filters.status = status;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (limit) filters.limit = parseInt(limit);

    const logs = await getEmailLogs(filters);

    return res.send(logs);
  } catch (error) {
    console.error("adminGetEmailLogs error:", error.message);
    return handleError(res, 500, "Error fetching email logs");
  }
};

module.exports = {
  adminGetAllUsersDetailed,
  adminSuspendUser,
  adminActivateUser,
  adminDeleteUser,
  adminManualVerifyEmail,
  adminUnverifyEmail,
  adminResetUserPassword,
  adminResendVerification,
  adminSendCustomEmail,
  adminGetEmailLogs,
};

