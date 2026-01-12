import React, { useState } from "react";
import { Container, Typography, Box, Alert } from "@mui/material";
import Form from "../../forms/components/Form";
import Input from "../../forms/components/Input";
import FormLink from "../../forms/components/FormLink";
import ROUTES from "../../router/routesModel";
import { forgotPassword } from "../service/userApi";

const ForgotPasswordPage = () => {
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
              Password reset email sent! Please check your inbox and follow the
              instructions to reset your password.
            </Alert>
            <FormLink text="Back to login" to={ROUTES.LOGIN} />
          </Box>
        ) : (
          <Form
            title="Forgot Password"
            onSubmit={onSubmit}
            onReset={handleReset}
            hasFormErrors={Object.keys(validateForm()).length > 0}
            spacing={1}
            styles={{ maxWidth: "450px" }}
            submitText={isLoading ? "Sending..." : "Send Reset Link"}
            disabled={isLoading}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter your email address and we'll send you a link to reset your
              password.
            </Typography>
            <Input
              label="Email"
              name="email"
              type="email"
              data={data}
              error={errors.email}
              onInputChange={handleInputChange}
              disabled={isLoading}
            />
            <FormLink text="Remember your password? Log in" to={ROUTES.LOGIN} />
          </Form>
        )}
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;

