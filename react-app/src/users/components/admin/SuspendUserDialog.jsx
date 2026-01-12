import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";

const SuspendUserDialog = ({ open, onClose, onSuspend, user, loading }) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSuspend = () => {
    if (!reason || reason.length < 10) {
      setError("Suspension reason must be at least 10 characters");
      return;
    }
    onSuspend(reason);
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Suspend User Account</DialogTitle>
      <DialogContent>
        {user && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            You are about to suspend{" "}
            <strong>
              {user.name.first} {user.name.last}
            </strong>{" "}
            ({user.email})
          </Typography>
        )}
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          ⚠️ This user will not be able to log in while suspended.
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Suspension Reason"
          placeholder="Enter detailed reason for suspension (minimum 10 characters)"
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setError("");
          }}
          disabled={loading}
          error={Boolean(error)}
          helperText={error || `${reason.length}/500 characters`}
          inputProps={{ maxLength: 500 }}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSuspend}
          disabled={loading || !reason || reason.length < 10}
          variant="contained"
          color="error"
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Suspending..." : "Suspend User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SuspendUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuspend: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.shape({
      first: PropTypes.string.isRequired,
      last: PropTypes.string.isRequired,
    }).isRequired,
    email: PropTypes.string.isRequired,
  }),
  loading: PropTypes.bool,
};

export default SuspendUserDialog;

