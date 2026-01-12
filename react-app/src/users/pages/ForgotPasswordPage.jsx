import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  InputAdornment,
  Fade,
  Grow,
} from "@mui/material";
import { Email, ArrowBack, Send, VpnKey } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../router/routesModel";
import { forgotPassword } from "../service/userApi";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleReset = () => {
    setData({ email: "" });
    setErrors({});
    setSuccess(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!data.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    return newErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword(data.email);
      setSuccess(true);
      setData({ email: "" });
    } catch (error) {
      setErrors({ email: error.toString() });
    } finally {
      setIsLoading(false);
    }
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
            "radial-gradient(circle at 25% 40%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 75% 70%, rgba(138, 43, 226, 0.3), transparent 50%)",
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
      <Box sx={{ width: "100%", maxWidth: 500, px: 2, position: "relative", zIndex: 1 }}>
        {/* Back Button */}
        <Fade in timeout={600}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(ROUTES.LOGIN)}
            sx={{
              mb: 2,
              color: "white",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Back to Login
          </Button>
        </Fade>

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
                <VpnKey sx={{ fontSize: 56, mb: 2, opacity: 0.9 }} />
              </Grow>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  mb: 1,
                }}
              >
                Reset Password
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontWeight: 300,
                }}
              >
                We'll send you instructions to reset it
              </Typography>
            </Box>

            {/* Content Section */}
            <Box sx={{ p: 4 }}>
              {success ? (
                <Fade in timeout={600}>
                  <Box sx={{ textAlign: "center" }}>
                    <Alert
                      severity="success"
                      sx={{
                        mb: 3,
                        borderRadius: 2,
                        "& .MuiAlert-icon": {
                          fontSize: 28,
                        },
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        Email Sent!
                      </Typography>
                      <Typography variant="body2">
                        Please check your inbox and follow the instructions to
                        reset your password. The link will expire in 1 hour.
                      </Typography>
                    </Alert>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(ROUTES.LOGIN)}
                      fullWidth
                      sx={{
                        py: 1.2,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        borderWidth: 2,
                        "&:hover": {
                          borderWidth: 2,
                        },
                      }}
                    >
                      Return to Login
                    </Button>
                  </Box>
                </Fade>
              ) : (
                <Box component="form" onSubmit={onSubmit}>
                  <Fade in timeout={1200}>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 3, textAlign: "center", lineHeight: 1.6 }}
                    >
                      Enter your email address and we'll send you a secure link
                      to reset your password.
                    </Typography>
                  </Fade>

                  <Fade in timeout={1400}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={data.email}
                      onChange={handleInputChange}
                      error={Boolean(errors.email)}
                      helperText={errors.email}
                      disabled={isLoading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: "primary.main" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
                          },
                          "&.Mui-focused": {
                            boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
                          },
                        },
                      }}
                    />
                  </Fade>

                  <Fade in timeout={1600}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      endIcon={<Send />}
                      disabled={isLoading || !data.email}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        boxShadow: "0 4px 15px 0 rgba(102, 126, 234, 0.4)",
                        transition: "all 0.3s",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 6px 25px 0 rgba(102, 126, 234, 0.6)",
                          background:
                            "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                        },
                        "&:disabled": {
                          background: "rgba(0, 0, 0, 0.12)",
                        },
                      }}
                    >
                      {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                  </Fade>
                </Box>
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

        {/* Decorative Circles */}
        <Box
          sx={{
            position: "absolute",
            top: "15%",
            right: "8%",
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            animation: "float 6s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": {
                transform: "translateY(0px)",
              },
              "50%": {
                transform: "translateY(-20px)",
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;

