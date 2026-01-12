const EmailLog = require("../models/EmailLog");
const chalk = require("chalk");

/**
 * Log an email send attempt
 * @param {Object} params - Email logging parameters
 * @param {string} params.userId - ID of the user receiving the email
 * @param {string} params.emailType - Type of email (verification, passwordReset, custom, etc.)
 * @param {string} params.recipientEmail - Recipient email address
 * @param {string} params.subject - Email subject
 * @param {string} params.status - Status ('sent', 'failed', 'pending')
 * @param {string} params.sentBy - ID of admin who sent (for custom emails)
 * @param {string} params.errorMessage - Error message if failed
 * @param {Object} params.metadata - Additional context
 * @returns {Promise<EmailLog>} Created email log
 */
const logEmail = async ({
  userId,
  emailType,
  recipientEmail,
  subject,
  status = "pending",
  sentBy = null,
  errorMessage = null,
  metadata = {},
}) => {
  try {
    const emailLog = new EmailLog({
      userId,
      emailType,
      recipientEmail,
      subject,
      sentAt: new Date(),
      sentBy,
      status,
      errorMessage,
      metadata,
    });

    await emailLog.save();

    if (status === "sent") {
      console.log(
        chalk.green(`📧 Email logged: ${emailType} to ${recipientEmail}`)
      );
    } else if (status === "failed") {
      console.log(
        chalk.red(`📧 Email log failed: ${emailType} to ${recipientEmail}`)
      );
    }

    return emailLog;
  } catch (error) {
    console.error(chalk.red("Error logging email:"), error.message);
    // Don't throw - logging failure shouldn't stop email sending
    return null;
  }
};

/**
 * Update email log status
 * @param {string} logId - Email log ID
 * @param {string} status - New status
 * @param {string} errorMessage - Error message if failed
 */
const updateEmailLog = async (logId, status, errorMessage = null) => {
  try {
    await EmailLog.findByIdAndUpdate(logId, {
      status,
      errorMessage,
    });
  } catch (error) {
    console.error(chalk.red("Error updating email log:"), error.message);
  }
};

/**
 * Get email logs with filters
 * @param {Object} filters - Query filters
 * @returns {Promise<Array>} Email logs
 */
const getEmailLogs = async (filters = {}) => {
  try {
    const query = {};

    if (filters.userId) query.userId = filters.userId;
    if (filters.emailType) query.emailType = filters.emailType;
    if (filters.status) query.status = filters.status;
    if (filters.startDate || filters.endDate) {
      query.sentAt = {};
      if (filters.startDate) query.sentAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.sentAt.$lte = new Date(filters.endDate);
    }

    const logs = await EmailLog.find(query)
      .populate("userId", "name email")
      .populate("sentBy", "name email")
      .sort({ sentAt: -1 })
      .limit(filters.limit || 100);

    return logs;
  } catch (error) {
    console.error(chalk.red("Error getting email logs:"), error.message);
    throw error;
  }
};

module.exports = {
  logEmail,
  updateEmailLog,
  getEmailLogs,
};

