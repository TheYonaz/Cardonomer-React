import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import PropTypes from "prop-types";

const EmailLogDetailsModal = ({ open, onClose, log }) => {
  if (!log) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Email Log Details</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Email Type
          </Typography>
          <Chip label={log.emailType} color="primary" size="small" sx={{ mt: 0.5 }} />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Status
          </Typography>
          <Chip
            label={log.status}
            color={
              log.status === "sent"
                ? "success"
                : log.status === "failed"
                ? "error"
                : "warning"
            }
            size="small"
            sx={{ mt: 0.5 }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Recipient
          </Typography>
          <Typography variant="body1">
            {log.userId?.name
              ? `${log.userId.name.first} ${log.userId.name.last}`
              : "Unknown User"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {log.recipientEmail}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Sent At
          </Typography>
          <Typography variant="body1">{formatDate(log.sentAt)}</Typography>
        </Box>

        {log.sentBy && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Sent By (Admin)
            </Typography>
            <Typography variant="body1">
              {log.sentBy.name
                ? `${log.sentBy.name.first} ${log.sentBy.name.last}`
                : "Unknown Admin"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {log.sentBy.email}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Subject
          </Typography>
          <Typography variant="body1">{log.subject}</Typography>
        </Box>

        {log.errorMessage && (
          <Box
            sx={{
              mb: 2,
              p: 2,
              bgcolor: "error.light",
              borderRadius: 1,
            }}
          >
            <Typography variant="subtitle2" color="error.dark">
              Error Message
            </Typography>
            <Typography variant="body2" color="error.dark">
              {log.errorMessage}
            </Typography>
          </Box>
        )}

        {log.metadata && Object.keys(log.metadata).length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Additional Information
            </Typography>
            <Box
              component="pre"
              sx={{
                bgcolor: "grey.100",
                p: 2,
                borderRadius: 1,
                overflow: "auto",
                fontSize: "0.875rem",
              }}
            >
              {JSON.stringify(log.metadata, null, 2)}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

EmailLogDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  log: PropTypes.shape({
    _id: PropTypes.string,
    emailType: PropTypes.string,
    status: PropTypes.string,
    recipientEmail: PropTypes.string,
    subject: PropTypes.string,
    sentAt: PropTypes.string,
    errorMessage: PropTypes.string,
    metadata: PropTypes.object,
    userId: PropTypes.shape({
      name: PropTypes.shape({
        first: PropTypes.string,
        last: PropTypes.string,
      }),
    }),
    sentBy: PropTypes.shape({
      name: PropTypes.shape({
        first: PropTypes.string,
        last: PropTypes.string,
      }),
      email: PropTypes.string,
    }),
  }),
};

export default EmailLogDetailsModal;

