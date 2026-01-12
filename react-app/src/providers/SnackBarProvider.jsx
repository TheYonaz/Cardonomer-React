import React, { useState, useContext, useCallback } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { node } from "prop-types";

const SnackbarContext = React.createContext(null);
export const SnackBarProvider = ({ children }) => {
  const [isSnackOpen, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("in snackbar!");
  const [snackColor, setSnackColor] = useState("success");
  const [snackVariant, setSnackVariant] = useState("filled");
  const setSnack = useCallback(
    (color, message, variant = "filled") => {
      setOpenSnack(true);
      setSnackColor(color);
      setSnackMessage(message);
      setSnackVariant(variant);
    },
    []
  );
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isSnackOpen}
        onClose={() => setOpenSnack(false)}
        autoHideDuration={3000}
      >
        <Alert severity={snackColor} variant={snackVariant}>
          {snackMessage}
        </Alert>
      </Snackbar>

      <SnackbarContext.Provider value={setSnack}>
        {children}
      </SnackbarContext.Provider>
    </>
  );
};
SnackBarProvider.propTypes = {
  children: node.isRequired,
};
export const useSnack = () => {
  const context = useContext(SnackbarContext);
  if (!context)
    throw new Error("useSnack must be used within a SnackbarProvider");
  return context;
};
