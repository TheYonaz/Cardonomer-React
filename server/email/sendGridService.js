const sgMail = require("@sendgrid/mail");
const config = require("config");
const chalk = require("chalk");
const { logEmail } = require("./emailLogger");

// Initialize SendGrid with API key from config
const SENDGRID_API_KEY = config.get("SENDGRID_API_KEY") || "";
const EMAIL_FROM = config.get("EMAIL_FROM") || "noreply@cardonomer.com";

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  console.log(
    chalk.yellow(
      "Warning: SENDGRID_API_KEY not configured. Email functionality will be disabled."
    )
  );
}

/**
 * Send an email using SendGrid with logging
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string} text - Plain text content (fallback)
 * @param {Object} logData - Additional data for logging
 * @returns {Promise<boolean>} Success status
 */
const sendEmail = async (to, subject, html, text, logData = {}) => {
  const { userId, emailType, sentBy, metadata } = logData;
  
  try {
    if (!SENDGRID_API_KEY) {
      console.log(
        chalk.yellow(
          `[EMAIL DISABLED] Would send email to ${to} with subject: ${subject}`
        )
      );
      
      // Log even in development
      if (userId && emailType) {
        await logEmail({
          userId,
          emailType,
          recipientEmail: to,
          subject,
          status: "sent",
          sentBy,
          metadata,
        });
      }
      
      return true; // Return success in development without API key
    }

    const msg = {
      to,
      from: EMAIL_FROM,
      subject,
      text,
      html,
    };

    await sgMail.send(msg);
    console.log(chalk.green(`Email sent successfully to ${to}`));
    
    // Log successful send
    if (userId && emailType) {
      await logEmail({
        userId,
        emailType,
        recipientEmail: to,
        subject,
        status: "sent",
        sentBy,
        metadata,
      });
    }
    
    return true;
  } catch (error) {
    console.error(chalk.red(`Failed to send email to ${to}:`), error.message);
    if (error.response) {
      console.error(chalk.red("SendGrid Error:"), error.response.body);
    }
    
    // Log failed send
    if (userId && emailType) {
      await logEmail({
        userId,
        emailType,
        recipientEmail: to,
        subject,
        status: "failed",
        sentBy,
        errorMessage: error.message,
        metadata,
      });
    }
    
    return false;
  }
};

/**
 * Send verification email
 * @param {string} to - Recipient email
 * @param {string} userName - User's name
 * @param {Object} emailTemplate - Email template with subject, html, text
 * @param {string} userId - User ID for logging
 * @returns {Promise<boolean>} Success status
 */
const sendVerificationEmail = async (to, userName, emailTemplate, userId) => {
  return await sendEmail(
    to,
    emailTemplate.subject,
    emailTemplate.html,
    emailTemplate.text,
    {
      userId,
      emailType: "verification",
      metadata: { userName },
    }
  );
};

/**
 * Send password reset email
 * @param {string} to - Recipient email
 * @param {string} userName - User's name
 * @param {Object} emailTemplate - Email template with subject, html, text
 * @param {string} userId - User ID for logging
 * @returns {Promise<boolean>} Success status
 */
const sendPasswordResetEmail = async (to, userName, emailTemplate, userId) => {
  return await sendEmail(
    to,
    emailTemplate.subject,
    emailTemplate.html,
    emailTemplate.text,
    {
      userId,
      emailType: "passwordReset",
      metadata: { userName },
    }
  );
};

/**
 * Send custom email (admin feature)
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} message - Email message
 * @param {string} userId - User ID for logging
 * @param {string} sentBy - Admin ID who sent the email
 * @returns {Promise<boolean>} Success status
 */
const sendCustomEmail = async (to, subject, message, userId, sentBy) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1976d2; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Message from Cardonomer</h2>
          </div>
          <div class="content">
            ${message.replace(/\n/g, "<br>")}
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Cardonomer. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return await sendEmail(to, subject, html, message, {
    userId,
    emailType: "custom",
    sentBy,
    metadata: { customMessage: true },
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendCustomEmail,
};

