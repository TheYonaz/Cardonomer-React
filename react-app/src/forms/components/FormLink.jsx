import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const FormLink = ({ text, to, breakPoints }) => {
  const navigate = useNavigate();
  return (
    <Grid item xs={12} {...breakPoints}>
      <Button variant="text" onClick={() => navigate(to)}>
        <Typography variant="body2">
          {text}
          <Typography component="span" variant="subtitle2">
            {" "}
            Click here...
          </Typography>
        </Typography>
      </Button>
    </Grid>
  );
};

export default FormLink;
