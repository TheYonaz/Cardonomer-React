import { Container } from "@mui/system";
import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useForm from "../../forms/hooks/useForm";
import ROUTES from "../../router/routesModel";
import UserEdit from "../components/UserEdit";
import { initialEditUserForm } from "../helpers/initialForms/initialEditUserForm";
import mapUserToModel from "../helpers/normalization/mapUserToModel";
import useHandleUsers from "../hooks/useHandleUsers";
import EditUserSchema from "../models/Joi/editUserSchema";
import { useUser } from "../providers/UserProvider";

const EditUserPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { handelGetUser, handelEditUser } = useHandleUsers();
  const { value, ...rest } = useForm(
    initialEditUserForm,
    EditUserSchema,
    handelEditUser
  );
  const { setData } = rest;

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.ROOT);
    }
    if (user)
      handelGetUser(user._id).then((userFromClient) => {
        if (user._id !== userFromClient._id) return navigate(ROUTES.ROOT);
        let modeledUser = mapUserToModel(userFromClient);
        setData(modeledUser);
      });
  }, []);
  return (
    <Container
      sx={{
        paddingTop: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <UserEdit
        title="Edit User"
        onSubmit={rest.onSubmit}
        onReset={rest.handleReset}
        hasFormErrors={rest.validateForm}
        onInputChange={rest.handleInputChange}
        data={value.data}
        errors={value.errors}
        setData={rest.setData}
      />
    </Container>
  );
};

export default EditUserPage;
