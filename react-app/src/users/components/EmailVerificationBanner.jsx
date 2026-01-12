import React, { useState } from "react";
import { Alert, Button, Box } from "@mui/material";
import { resendVerification } from "../service/userApi";

const EmailVerificationBanner = () => {
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("warning");

  const handleResend = async () => {
    setIsResending(true);
    setMessage("");
    try {
      const result = await resendVerification();
      setMessage(
        result.message || "Verification email sent! Please check your inbox."
      );
      setSeverity("success");
    } catch (error) {
      setMessage(error.toString() || "Failed to resend verification email.");
      setSeverity("error");
    } finally {
      setIsResending(false);
    }
  };

  if (message) {
    return (
      <Alert severity={severity} sx={{ mb: 2 }}>
        {message}
      </Alert>
    );
  }

  return (
    <Alert
      severity="warning"
      sx={{ mb: 2 }}
      action={
        <Button
          color="inherit"
          size="small"
          onClick={handleResend}
          disabled={isResending}
        >
          {isResending ? "Sending..." : "Resend Email"}
        </Button>
      }
    >
      Please verify your email address to access all features. Check your inbox
      for the verification link.
    </Alert>
  );
};

export default EmailVerificationBanner;

