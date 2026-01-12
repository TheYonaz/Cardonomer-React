import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Fade,
  Grow,
} from "@mui/material";
import {
  Lock,
  Visibility,
  VisibilityOff,
  Check,
  VpnKey,
} from "@mui/icons-material";
import ROUTES from "../../router/routesModel";
import { resetPassword, checkResetToken } from "../service/userApi";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        await checkResetToken(token);
        setTokenValid(true);
      } catch (error) {
        setTokenValid(false);
      }
    };

    if (token) {
      validateToken();
    }
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleReset = () => {
    setData({ password: "", confirmPassword: "" });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/;

    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 7) {
      newErrors.password = "Password must be at least 7 characters";
    } else if (data.password.length > 20) {
      newErrors.password = "Password must be at most 20 characters";
    } else if (!passwordRegex.test(data.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number, and special character";
    }

    if (!data.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      await resetPassword(token, data.password);
      setSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 3000);
    } catch (error) {
      setErrors({ password: error.toString() });
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <CircularProgress size={60} sx={{ color: "white" }} />
      </Box>
    );
  }

  if (tokenValid === false) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Box sx={{ maxWidth: 500, px: 2 }}>
          <Fade in timeout={800}>
            <Paper
              elevation={24}
              sx={{
                borderRadius: 4,
                p: 4,
                textAlign: "center",
                background: "rgba(255, 255, 255, 0.95)",
              }}
            >
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  "& .MuiAlert-icon": {
                    fontSize: 32,
                  },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Link Expired
                </Typography>
                <Typography variant="body2">
                  This password reset link is invalid or has expired. Please
                  request a new one.
                </Typography>
              </Alert>
              <Button
                variant="contained"
                onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Request New Reset Link
              </Button>
            </Paper>
          </Fade>
        </Box>
      </Box>
    );
  }

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
            "radial-gradient(circle at 30% 40%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 70% 70%, rgba(138, 43, 226, 0.3), transparent 50%)",
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
                Create New Password
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontWeight: 300,
                }}
              >
                Choose a strong password for your account
              </Typography>
            </Box>

            {/* Content Section */}
            <Box sx={{ p: 4 }}>
              {success ? (
                <Fade in timeout={600}>
                  <Box sx={{ textAlign: "center" }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 3,
                        animation: "scaleIn 0.5s ease-out",
                        "@keyframes scaleIn": {
                          from: { transform: "scale(0)" },
                          to: { transform: "scale(1)" },
                        },
                      }}
                    >
                      <Check sx={{ fontSize: 48, color: "white" }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                      Password Reset Complete!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      Your password has been successfully updated. You can now sign
                      in with your new password.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Redirecting to login page...
                    </Typography>
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
                      Please enter a strong password that includes uppercase,
                      lowercase, numbers, and special characters.
                    </Typography>
                  </Fade>

                  {/* New Password Input */}
                  <Fade in timeout={1400}>
                    <TextField
                      fullWidth
                      label="New Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={data.password}
                      onChange={handleInputChange}
                      error={Boolean(errors.password)}
                      helperText={errors.password}
                      disabled={isLoading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: "primary.main" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
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

                  {/* Confirm Password Input */}
                  <Fade in timeout={1600}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={data.confirmPassword}
                      onChange={handleInputChange}
                      error={Boolean(errors.confirmPassword)}
                      helperText={errors.confirmPassword}
                      disabled={isLoading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: "primary.main" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
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

                  {/* Submit Button */}
                  <Fade in timeout={1800}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      endIcon={<Check />}
                      disabled={
                        isLoading ||
                        !data.password ||
                        !data.confirmPassword ||
                        Object.keys(validateForm()).length > 0
                      }
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
                      {isLoading ? "Resetting Password..." : "Reset Password"}
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
      </Box>
    </Box>
  );
};

export default ResetPasswordPage;

