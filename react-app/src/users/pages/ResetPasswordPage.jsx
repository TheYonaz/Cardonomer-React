import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Alert, CircularProgress } from "@mui/material";
import Form from "../../forms/components/Form";
import Input from "../../forms/components/Input";
import FormLink from "../../forms/components/FormLink";
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
      <Container
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (tokenValid === false) {
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
        <Box sx={{ textAlign: "center", maxWidth: "450px" }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            This password reset link is invalid or has expired. Please request
            a new one.
          </Alert>
          <FormLink text="Forgot Password" to={ROUTES.FORGOT_PASSWORD} />
        </Box>
      </Container>
    );
  }

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
      <Box sx={{ maxWidth: "450px", width: "100%" }}>
        {success ? (
          <Box sx={{ textAlign: "center" }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Password reset successful! Redirecting to login...
            </Alert>
          </Box>
        ) : (
          <Form
            title="Reset Password"
            onSubmit={onSubmit}
            onReset={handleReset}
            hasFormErrors={Object.keys(validateForm()).length > 0}
            spacing={1}
            styles={{ maxWidth: "450px" }}
            submitText={isLoading ? "Resetting..." : "Reset Password"}
            disabled={isLoading}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter your new password below.
            </Typography>
            <Input
              label="New Password"
              name="password"
              type="password"
              data={data}
              error={errors.password}
              onInputChange={handleInputChange}
              disabled={isLoading}
            />
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              data={data}
              error={errors.confirmPassword}
              onInputChange={handleInputChange}
              disabled={isLoading}
            />
          </Form>
        )}
      </Box>
    </Container>
  );
};

export default ResetPasswordPage;

