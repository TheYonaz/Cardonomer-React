import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Button,
} from "@mui/material";
import ROUTES from "../../router/routesModel";
import { verifyEmail, resendVerification } from "../service/userApi";

const EmailVerificationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const result = await verifyEmail(token);
        setStatus("success");
        setMessage(result.message || "Email verified successfully!");
        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 3000);
      } catch (error) {
        setStatus("error");
        setMessage(
          error.toString() ||
            "Email verification failed. The link may be invalid or expired."
        );
      }
    };

    if (token) {
      verify();
    }
  }, [token, navigate]);

  const handleResend = async () => {
    setIsResending(true);
    try {
      const result = await resendVerification();
      setMessage(
        result.message || "Verification email sent! Please check your inbox."
      );
      setStatus("success");
    } catch (error) {
      setMessage(error.toString() || "Failed to resend verification email.");
    } finally {
      setIsResending(false);
    }
  };

  const handleGoToLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <Container
      sx={{
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "white",
      }}
    >
      <Box sx={{ textAlign: "center", maxWidth: "500px" }}>
        {status === "verifying" && (
          <>
            <CircularProgress sx={{ mb: 3 }} />
            <Typography variant="h5">Verifying your email...</Typography>
          </>
        )}

        {status === "success" && (
          <>
            <Alert severity="success" sx={{ mb: 3 }}>
              {message}
            </Alert>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Redirecting to login page...
            </Typography>
            <Button
              variant="contained"
              onClick={handleGoToLogin}
              sx={{ mt: 2 }}
            >
              Go to Login Now
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <Alert severity="error" sx={{ mb: 3 }}>
              {message}
            </Alert>
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleResend}
                disabled={isResending}
                sx={{ mr: 2 }}
              >
                {isResending ? "Sending..." : "Resend Verification Email"}
              </Button>
              <Button variant="outlined" onClick={handleGoToLogin}>
                Go to Login
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default EmailVerificationPage;

