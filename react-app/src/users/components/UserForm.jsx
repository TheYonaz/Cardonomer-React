import React from "react";
import Form from "../../forms/components/Form";
import Input from "../../forms/components/Input";
import ROUTES from "../../router/routesModel";
import FormLink from "../../forms/components/FormLink";

const UserForm = ({
  onSubmit,
  onReset,
  hasFormErrors,
  title,
  errors,
  data,
  onInputChange,
  setData,
}) => {
  return (
    <Form
      onSubmit={onSubmit}
      onReset={onReset}
      hasFormErrors={hasFormErrors}
      styles={{ maxWidth: "800px" }}
      title={title}
      to={ROUTES.CARDS}
    >
      <Input
        name="first"
        label="first name"
        error={errors.first}
        onInputChange={onInputChange}
        data={data}
        breakPoints={{ sm: 6 }}
      />
      <Input
        name="last"
        label="last name"
        error={errors.last}
        onInputChange={onInputChange}
        data={data}
        breakPoints={{ sm: 6 }}
      />
      <Input
        name="email"
        label="email"
        type="email"
        error={errors.email}
        onInputChange={onInputChange}
        data={data}
        breakPoints={{ sm: 6 }}
      />
      <Input
        name="password"
        label="password"
        type="password"
        error={errors.password}
        onInputChange={onInputChange}
        data={data}
        breakPoints={{ sm: 6 }}
      />
      <FormLink text="Already registered?" to={ROUTES.LOGIN} />
    </Form>
  );
};

export default React.memo(UserForm);
