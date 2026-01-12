import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmationInput = null, // { label, placeholder, value }
  dangerous = false,
  loading = false,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleConfirm = () => {
    if (confirmationInput && inputValue !== confirmationInput.value) {
      return;
    }
    onConfirm(inputValue);
    setInputValue("");
  };

  const handleClose = () => {
    setInputValue("");
    onClose();
  };

  const isConfirmDisabled =
    loading ||
    (confirmationInput && inputValue !== confirmationInput.value);

  return (
    <Dialog open={open} onClose={loading ? undefined : handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {message}
        </Typography>
        {confirmationInput && (
          <TextField
            fullWidth
            label={confirmationInput.label}
            placeholder={confirmationInput.placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            helperText={`Type "${confirmationInput.value}" to confirm`}
            sx={{ mt: 2 }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isConfirmDisabled}
          variant="contained"
          color={dangerous ? "error" : "primary"}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Processing..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmationInput: PropTypes.shape({
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
  }),
  dangerous: PropTypes.bool,
  loading: PropTypes.bool,
};

export default ConfirmationDialog;

