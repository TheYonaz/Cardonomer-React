const sgMail = require("@sendgrid/mail");
const config = require("config");
const chalk = require("chalk");

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
 * Send an email using SendGrid
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string} text - Plain text content (fallback)
 * @returns {Promise<boolean>} Success status
 */
const sendEmail = async (to, subject, html, text) => {
  try {
    if (!SENDGRID_API_KEY) {
      console.log(
        chalk.yellow(
          `[EMAIL DISABLED] Would send email to ${to} with subject: ${subject}`
        )
      );
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
    return true;
  } catch (error) {
    console.error(chalk.red(`Failed to send email to ${to}:`), error.message);
    if (error.response) {
      console.error(chalk.red("SendGrid Error:"), error.response.body);
    }
    return false;
  }
};

/**
 * Send verification email
 * @param {string} to - Recipient email
 * @param {string} userName - User's name
 * @param {Object} emailTemplate - Email template with subject, html, text
 * @returns {Promise<boolean>} Success status
 */
const sendVerificationEmail = async (to, userName, emailTemplate) => {
  return await sendEmail(
    to,
    emailTemplate.subject,
    emailTemplate.html,
    emailTemplate.text
  );
};

/**
 * Send password reset email
 * @param {string} to - Recipient email
 * @param {string} userName - User's name
 * @param {Object} emailTemplate - Email template with subject, html, text
 * @returns {Promise<boolean>} Success status
 */
const sendPasswordResetEmail = async (to, userName, emailTemplate) => {
  return await sendEmail(
    to,
    emailTemplate.subject,
    emailTemplate.html,
    emailTemplate.text
  );
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
};

