import React, { useState } from "react";
import useHandleUsers from "../hooks/useHandleUsers";
import useForm from "../../forms/hooks/useForm";
import { initialLogInForm } from "../helpers/initialForms/initialLoginForm";
import loginSchema from "../models/Joi/loginSchema";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  Fade,
  Grow,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  LoginOutlined,
  ArrowForward,
} from "@mui/icons-material";
import { Navigate, useNavigate } from "react-router-dom";
import ROUTES from "../../router/routesModel";

const LoginPage = () => {
  const {
    handleLogin,
    value: { user },
  } = useHandleUsers();
  const { value, ...rest } = useForm(
    initialLogInForm,
    loginSchema,
    handleLogin
  );
  const { handleInputChange, handleReset, onSubmit, validateForm } = rest;
  const { data, errors } = value;
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  if (user) {
    return <Navigate replace to={ROUTES.ROOT} />;
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
            "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 80% 80%, rgba(138, 43, 226, 0.3), transparent 50%)",
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
      <Container maxWidth="sm">
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
                <LoginOutlined sx={{ fontSize: 56, mb: 2, opacity: 0.9 }} />
              </Grow>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  mb: 1,
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontWeight: 300,
                }}
              >
                Sign in to continue your journey
              </Typography>
            </Box>

            {/* Form Section */}
            <Box
              component="form"
              onSubmit={onSubmit}
              sx={{
                p: 4,
              }}
            >
              {/* Email Input */}
              <Fade in timeout={1200}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={data.email || ""}
                  onChange={handleInputChange}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
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

              {/* Password Input */}
              <Fade in timeout={1400}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={data.password || ""}
                  onChange={handleInputChange}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
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
                    mb: 2,
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

              {/* Forgot Password Link */}
              <Fade in timeout={1600}>
                <Box sx={{ textAlign: "right", mb: 3 }}>
                  <Link
                    onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
                    sx={{
                      cursor: "pointer",
                      color: "primary.main",
                      textDecoration: "none",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      transition: "all 0.2s",
                      "&:hover": {
                        textDecoration: "underline",
                        color: "primary.dark",
                      },
                    }}
                  >
                    Forgot your password?
                  </Link>
                </Box>
              </Fade>

              {/* Submit Button */}
              <Fade in timeout={1800}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "0 4px 15px 0 rgba(102, 126, 234, 0.4)",
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 6px 25px 0 rgba(102, 126, 234, 0.6)",
                      background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                    },
                    "&:active": {
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Sign In
                </Button>
              </Fade>

              {/* Divider */}
              <Fade in timeout={2000}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    my: 3,
                  }}
                >
                  <Box sx={{ flex: 1, height: 1, bgcolor: "divider" }} />
                  <Typography
                    variant="body2"
                    sx={{
                      px: 2,
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    OR
                  </Typography>
                  <Box sx={{ flex: 1, height: 1, bgcolor: "divider" }} />
                </Box>
              </Fade>

              {/* Sign Up Link */}
              <Fade in timeout={2200}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 1 }}
                  >
                    Don't have an account yet?
                  </Typography>
                  <Button
                    onClick={() => navigate(ROUTES.SIGNUP)}
                    variant="outlined"
                    fullWidth
                    sx={{
                      py: 1.2,
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 600,
                      borderWidth: 2,
                      transition: "all 0.3s",
                      "&:hover": {
                        borderWidth: 2,
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
                      },
                    }}
                  >
                    Create New Account
                  </Button>
                </Box>
              </Fade>
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
            top: "10%",
            right: "10%",
            width: 100,
            height: 100,
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
        <Box
          sx={{
            position: "absolute",
            bottom: "15%",
            left: "5%",
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(10px)",
            animation: "float 8s ease-in-out infinite",
            animationDelay: "1s",
          }}
        />
      </Container>
    </Box>
  );
};

export default LoginPage;
