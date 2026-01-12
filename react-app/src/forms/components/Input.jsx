import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { string, bool, object, func } from "prop-types";
import { makeFirstLetterCapital } from "../../utils/algoMethods";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

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
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const effectiveType = isPassword && showPassword ? "text" : type;

  return (
    <Grid item xs={12} {...breakPoints}>
      <TextField
        variant={variant}
        label={makeFirstLetterCapital(label)}
        type={effectiveType}
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
        InputProps={
          isPassword
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((prev) => !prev)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }
            : undefined
        }
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
