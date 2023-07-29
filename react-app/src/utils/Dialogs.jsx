import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Dialogs = ({
  isDialogOpen,
  onConfirm,
  onCancel,
  dialogTitle = "Are you sure?",
  dialogDescription = "This action cannot be undone.",
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  confirmButtonColor = "info",
  cancelButtonColor = "error",
}) => {
  return (
    <Dialog
      open={isDialogOpen}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="xs"
    >
      <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {dialogDescription}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color={cancelButtonColor}>
          {cancelButtonText}
        </Button>
        <Button onClick={onConfirm} autoFocus color={confirmButtonColor}>
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Dialogs;
