const mongoose = require("mongoose");

const adminAuditLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String,
    enum: [
      "suspend_user",
      "activate_user",
      "delete_user",
      "verify_email",
      "unverify_email",
      "reset_password",
      "send_custom_email",
      "resend_verification",
    ],
    required: true,
  },
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
});

// Index for faster queries
adminAuditLogSchema.index({ adminId: 1, timestamp: -1 });
adminAuditLogSchema.index({ targetUserId: 1, timestamp: -1 });
adminAuditLogSchema.index({ action: 1 });

const AdminAuditLog = mongoose.model("AdminAuditLog", adminAuditLogSchema);

module.exports = AdminAuditLog;

