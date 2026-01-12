import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Paper,
  Fade,
  Grow,
} from "@mui/material";
import {
  CheckCircle,
  Error,
  Email,
  ArrowForward,
} from "@mui/icons-material";
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
        }, 4000);
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
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 35% 45%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 65% 75%, rgba(138, 43, 226, 0.3), transparent 50%)",
          animation: "pulse 8s ease-in-out infinite",
        },
        "@keyframes pulse": {
          "0%, 100%": {
            opacity: 1,
          },
          "50%": {
            opacity: 0.8,
          },
        },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 550, px: 2, position: "relative", zIndex: 1 }}>
        <Fade in timeout={800}>
          <Paper
            elevation={24}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            }}
          >
            {/* Header Section */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                py: 5,
                px: 4,
                textAlign: "center",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -1,
                  left: 0,
                  right: 0,
                  height: 2,
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
                },
              }}
            >
              <Grow in timeout={1000}>
                <Email sx={{ fontSize: 56, mb: 2, opacity: 0.9 }} />
              </Grow>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                Email Verification
              </Typography>
            </Box>

            {/* Content Section */}
            <Box sx={{ p: 5, textAlign: "center" }}>
              {status === "verifying" && (
                <Fade in timeout={600}>
                  <Box>
                    <CircularProgress
                      size={60}
                      sx={{
                        mb: 3,
                        color: "primary.main",
                      }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Verifying Your Email
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Please wait while we confirm your email address...
                    </Typography>
                  </Box>
                </Fade>
              )}

              {status === "success" && (
                <Fade in timeout={600}>
                  <Box>
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 3,
                        animation: "scaleIn 0.6s ease-out",
                        "@keyframes scaleIn": {
                          from: { transform: "scale(0)" },
                          to: { transform: "scale(1)" },
                        },
                      }}
                    >
                      <CheckCircle sx={{ fontSize: 60, color: "white" }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                      Email Verified Successfully!
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 3, lineHeight: 1.6 }}
                    >
                      {message}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Redirecting you to login page...
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleGoToLogin}
                      endIcon={<ArrowForward />}
                      sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: "1rem",
                        fontWeight: 600,
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        boxShadow: "0 4px 15px 0 rgba(102, 126, 234, 0.4)",
                        transition: "all 0.3s",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 6px 25px 0 rgba(102, 126, 234, 0.6)",
                        },
                      }}
                    >
                      Go to Login
                    </Button>
                  </Box>
                </Fade>
              )}

              {status === "error" && (
                <Fade in timeout={600}>
                  <Box>
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 3,
                        animation: "shake 0.5s ease-out",
                        "@keyframes shake": {
                          "0%, 100%": { transform: "translateX(0)" },
                          "25%": { transform: "translateX(-10px)" },
                          "75%": { transform: "translateX(10px)" },
                        },
                      }}
                    >
                      <Error sx={{ fontSize: 60, color: "white" }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                      Verification Failed
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 4, lineHeight: 1.6 }}
                    >
                      {message}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                      <Button
                        variant="contained"
                        onClick={handleResend}
                        disabled={isResending}
                        sx={{
                          py: 1.2,
                          px: 3,
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        {isResending ? "Sending..." : "Resend Email"}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleGoToLogin}
                        sx={{
                          py: 1.2,
                          px: 3,
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          borderWidth: 2,
                          "&:hover": {
                            borderWidth: 2,
                          },
                        }}
                      >
                        Go to Login
                      </Button>
                    </Box>
                  </Box>
                </Fade>
              )}
            </Box>

            {/* Footer Wave */}
            <Box
              sx={{
                height: 8,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            />
          </Paper>
        </Fade>

        {/* Decorative Circle */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            animation: "float 6.5s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": {
                transform: "translateY(0px)",
              },
              "50%": {
                transform: "translateY(-22px)",
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default EmailVerificationPage;
