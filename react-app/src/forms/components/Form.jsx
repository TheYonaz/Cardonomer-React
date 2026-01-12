import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import FormButton from "./FormButton";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import LoopIcon from "@mui/icons-material/Loop";
import { string, object, func, node, number } from "prop-types";

const Form = ({
  title = "",
  onSubmit,
  onReset,
  hasFormErrors,
  to = "/",
  color = "inherit",
  spacing = 1,
  styles,
  children,
}) => {
  const navigate = useNavigate();
  return (
    <Box
      component="form"
      color={color}
      sx={{ mt: 2, p: { xs: 1, sm: 2 }, ...styles }}
      onSubmit={onSubmit}
      autoComplete="off"
      noValidate
    >
      <Typography align="center" variant="h5" component="h1" mb={2}>
        {title.toUpperCase()}
      </Typography>

      <Grid container spacing={spacing}>
        {children}
      </Grid>

      <Grid container spacing={1} my={2} direction="row" width="100">
        <Grid item xs={12} sm={6}>
          <FormButton
            node="cancel"
            color="error"
            component="div"
            variant="outlined"
            onClick={() => navigate(to)}
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormButton
            node={<LoopIcon />}
            variant="outlined"
            component="div"
            onClick={onReset}
            size="medium"
            color="primary"
          />
        </Grid>
        <Grid item xs={12}>
          <FormButton
            node="Submit"
            onClick={onSubmit}
            component="button"
            disabled={!!hasFormErrors()}
            size="large"
            variant="contained"
            color="primary"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
Form.propTypes = {
  children: node.isRequired,
  onSubmit: func.isRequired,
  color: string,
  to: string,
  spacing: number,
  onReset: func.isRequired,
  hasFormErrors: func.isRequired,
  title: string,
  styles: object,
};
Form.defaultProps = {
  color: "inherit",
  to: "/",
  spacing: 1,
  title: "",
  styles: {},
};
export default React.memo(Form);
