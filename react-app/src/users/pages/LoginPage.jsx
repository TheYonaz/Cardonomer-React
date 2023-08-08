import React from "react";
import useHandleUsers from "../hooks/useHandleUsers";
import useForm from "../../forms/hooks/useForm";
import { initialLogInForm } from "../helpers/initialForms/initialLoginForm";
import loginSchema from "../models/Joi/loginSchema";
import { Container } from "@mui/material";
import Form from "../../forms/components/Form";
import Input from "../../forms/components/Input";
import FormLink from "../../forms/components/FormLink";
import ROUTES from "../../router/routesModel";
import { Navigate } from "react-router-dom";
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
  if (user) {
    return <Navigate replace to={ROUTES.ROOT} />;
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
      <>
        <Form
          title="Login"
          onSubmit={onSubmit}
          onReset={handleReset}
          onFormChange={validateForm}
          spacing={1}
          styles={{ maxWidth: "450px" }}
        >
          <Input
            label="email"
            name="email"
            type="email"
            data={data}
            error={errors.email}
            onInputChange={handleInputChange}
          />
          <Input
            label="password"
            name="password"
            type="password"
            data={data}
            error={errors.password}
            onInputChange={handleInputChange}
          />

          <FormLink text="Did not registered yet?" to={ROUTES.SIGNUP} />
        </Form>
      </>
    </Container>
  );
};

export default LoginPage;
