import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const Error = ({ errorMessage }) => {
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" color="error">
            Oops... something went wrong: {errorMessage}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} justifyContent="center">
          <img
            width="100%"
            src="/assets/images/broken-robot-error.png"
            alt="broken robot"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default React.memo(Error);
