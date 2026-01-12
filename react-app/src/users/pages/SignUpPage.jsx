import React from "react";
import {
  Box,
  Typography,
  Paper,
  Fade,
  Grow,
  Button,
} from "@mui/material";
import { PersonAdd, ArrowBack } from "@mui/icons-material";
import { Navigate, useNavigate } from "react-router-dom";
import useForm from "../../forms/hooks/useForm";
import UserForm from "../components/UserForm";
import { initialSignupForm } from "../helpers/initialForms/initialSignupForm";
import useHandleUsers from "../hooks/useHandleUsers";
import signupSchema from "../models/Joi/signupSchema";
import { useUser } from "../providers/UserProvider";
import ROUTES from "../../router/routesModel";

const SignUpPage = () => {
  const { user } = useUser();
  const { handleSignup } = useHandleUsers();
  const navigate = useNavigate();
  const { value, ...rest } = useForm(
    initialSignupForm,
    signupSchema,
    handleSignup
  );
  const { handleInputChange, handleReset, onSubmit, setData, validateForm } =
    rest;
  
  if (user) return <Navigate replace to={ROUTES.ROOT} />;
  
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
        py: 4,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 30% 50%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 70% 80%, rgba(138, 43, 226, 0.3), transparent 50%)",
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
      <Box sx={{ width: "100%", maxWidth: 700, px: 2, position: "relative", zIndex: 1 }}>
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
                py: 4,
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
                <PersonAdd sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
              </Grow>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  mb: 0.5,
                }}
              >
                Create Your Account
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontWeight: 300,
                }}
              >
                Join the Cardonomer community today
              </Typography>
            </Box>

            {/* Form Section */}
            <Box sx={{ p: 4 }}>
              <UserForm
                title=""
                data={value.data}
                errors={value.errors}
                hasFormErrors={validateForm}
                onInputChange={handleInputChange}
                onReset={handleReset}
                onSubmit={onSubmit}
                setData={setData}
              />
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
            top: "5%",
            right: "5%",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            animation: "float 7s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": {
                transform: "translateY(0px)",
              },
              "50%": {
                transform: "translateY(-25px)",
              },
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "10%",
            left: "8%",
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(10px)",
            animation: "float 9s ease-in-out infinite",
            animationDelay: "1.5s",
          }}
        />
      </Box>
    </Box>
  );
};

export default SignUpPage;
