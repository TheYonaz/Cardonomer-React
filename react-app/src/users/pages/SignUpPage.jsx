import { Container } from "@mui/material";
import React from "react";
import { Navigate } from "react-router-dom";
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
  const { value, ...rest } = useForm(
    initialSignupForm,
    signupSchema,
    handleSignup
  );
  const { handleInputChange, handleReset, onSubmit, setData, validateForm } =
    rest;
  if (user) return <Navigate replace to={ROUTES.ROOT} />;
  return (
    <Container
      sx={{
        paddingTop: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "white",
      }}
    >
      <UserForm
        title="register user"
        data={value.data}
        errors={value.errors}
        onFormChange={validateForm}
        onInputChange={handleInputChange}
        onReset={handleReset}
        onSubmit={onSubmit}
        setData={setData}
      />
    </Container>
  );
};

export default SignUpPage;
