const config = require("config");

const FRONTEND_URL =
  config.get("FRONTEND_URL") || "http://localhost:3000";

const emailVerificationTemplate = (verificationLink, userName) => {
  return {
    subject: "Verify Your Email - Cardonomer",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1976d2; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 30px; background-color: #1976d2; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Cardonomer!</h1>
            </div>
            <div class="content">
              <h2>Hi ${userName || "there"}!</h2>
              <p>Thank you for signing up. Please verify your email address to activate your account and start collecting cards!</p>
              
              <p style="text-align: center;">
                <a href="${verificationLink}" class="button">Verify Email Address</a>
              </p>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background-color: #e9ecef; padding: 10px; border-radius: 4px;">
                ${verificationLink}
              </p>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> This link will expire in 24 hours. If you didn't create an account, please ignore this email.
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Cardonomer. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Welcome to Cardonomer!
      
      Hi ${userName || "there"}!
      
      Thank you for signing up. Please verify your email address to activate your account.
      
      Click the link below to verify your email:
      ${verificationLink}
      
      This link will expire in 24 hours.
      
      If you didn't create an account, please ignore this email.
      
      © ${new Date().getFullYear()} Cardonomer
    `,
  };
};

const passwordResetTemplate = (resetLink, userName) => {
  return {
    subject: "Reset Your Password - Cardonomer",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #d32f2f; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 30px; background-color: #d32f2f; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background-color: #ffebee; border-left: 4px solid #d32f2f; padding: 10px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hi ${userName || "there"}!</h2>
              <p>We received a request to reset your password for your Cardonomer account.</p>
              
              <p style="text-align: center;">
                <a href="${resetLink}" class="button">Reset Password</a>
              </p>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background-color: #e9ecef; padding: 10px; border-radius: 4px;">
                ${resetLink}
              </p>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul>
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this, please ignore this email</li>
                  <li>Your password won't change until you create a new one</li>
                </ul>
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Cardonomer. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Password Reset Request
      
      Hi ${userName || "there"}!
      
      We received a request to reset your password for your Cardonomer account.
      
      Click the link below to reset your password:
      ${resetLink}
      
      This link will expire in 1 hour.
      
      If you didn't request this, please ignore this email. Your password won't change until you create a new one.
      
      © ${new Date().getFullYear()} Cardonomer
    `,
  };
};

module.exports = {
  emailVerificationTemplate,
  passwordResetTemplate,
};

