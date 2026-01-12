const mongoose = require("mongoose");

const emailLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  emailType: {
    type: String,
    enum: ["verification", "passwordReset", "custom", "suspension", "activation"],
    required: true,
  },
  recipientEmail: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["sent", "failed", "pending"],
    default: "pending",
  },
  errorMessage: {
    type: String,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
});

// Index for faster queries
emailLogSchema.index({ userId: 1, sentAt: -1 });
emailLogSchema.index({ emailType: 1 });
emailLogSchema.index({ status: 1 });

const EmailLog = mongoose.model("EmailLog", emailLogSchema);

module.exports = EmailLog;

