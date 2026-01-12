import React from "react";
import TextField from "@mui/material/TextField";
import { string, bool, object, func } from "prop-types";
import { makeFirstLetterCapital } from "../../utils/algoMethods";
import Grid from "@mui/material/Grid";

const Input = ({
  variant = "outlined",
  type = "text",
  name,
  data,
  label,
  required = true,
  error,
  onInputChange,
  breakPoints = { xl: 12 },
}) => {
  return (
    <Grid item xs={12} {...breakPoints}>
      <TextField
        variant={variant}
        label={makeFirstLetterCapital(label)}
        type={type}
        id={name}
        name={name}
        value={data[name] ? data[name] : ""}
        required={required}
        helperText={error && error.message ? error.message : ""}
        error={Boolean(error)}
        onChange={onInputChange}
        fullWidth
        autoComplete="off"
        aria-label={makeFirstLetterCapital(label)}
        aria-describedby={error ? `${name}-error` : undefined}
        aria-invalid={Boolean(error)}
      />
    </Grid>
  );
};
Input.propTypes = {
  name: string.isRequired,
  required: bool.isRequired,
  type: string.isRequired,
  error: object,
  onInputChange: func.isRequired,
  variant: string,
  data: object,
};
Input.defaultProps = {
  required: true,
  type: "text",
  variant: "outlined",
};

export default React.memo(Input);
