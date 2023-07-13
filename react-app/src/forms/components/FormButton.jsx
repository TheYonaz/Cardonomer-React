import React from "react";
import Button from "@mui/material/Button";
import { string, bool, func, node } from "prop-types";

const FormButton = ({
  variant = "contained",
  component = "button",
  size = "medium",
  color = "primary",
  onClick,
  disabled = false,
  node,
}) => {
  return (
    <Button
      variant={variant}
      component={component}
      size={size}
      color={color}
      onClick={onClick}
      disabled={disabled}
      fullWidth
    >
      {node}
    </Button>
  );
};
FormButton.propTypes = {
  variant: string.isRequired,
  component: string.isRequired,
  size: string.isRequired,
  color: string.isRequired,
  onClick: func.isRequired,
  disabled: bool.isRequired,
  node: node.isRequired,
};
FormButton.defaultProps = {
  variant: "contained",
  component: "button",
  size: "medium",
  color: "primary",
  disabled: false,
};

export default React.memo(FormButton);
