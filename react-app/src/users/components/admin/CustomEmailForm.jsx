import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Autocomplete,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import PropTypes from "prop-types";

const CustomEmailForm = ({ users, onSend, isLoading }) => {
  const [recipients, setRecipients] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    // Validation
    const newErrors = {};
    if (recipients.length === 0) {
      newErrors.recipients = "At least one recipient is required";
    }
    if (recipients.length > 50) {
      newErrors.recipients = "Maximum 50 recipients allowed";
    }
    if (!subject || subject.length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }
    if (!message || message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSend({
        recipients: recipients.map((r) => r.email),
        subject,
        message,
      });

      // Reset form
      setRecipients([]);
      setSubject("");
      setMessage("");
      setErrors({});
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      setErrors({ general: error.toString() });
    }
  };

  const handleReset = () => {
    setRecipients([]);
    setSubject("");
    setMessage("");
    setErrors({});
    setSuccess(false);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Send Custom Email
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Emails sent successfully!
        </Alert>
      )}

      {errors.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general}
        </Alert>
      )}

      {/* Recipient Selector */}
      <Autocomplete
        multiple
        options={users}
        value={recipients}
        onChange={(event, newValue) => {
          setRecipients(newValue);
          setErrors((prev) => ({ ...prev, recipients: "" }));
        }}
        getOptionLabel={(option) =>
          `${option.name.first} ${option.name.last} (${option.email})`
        }
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={`${option.name.first} ${option.name.last}`}
              {...getTagProps({ index })}
              key={option._id}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Recipients"
            placeholder="Select users..."
            error={Boolean(errors.recipients)}
            helperText={
              errors.recipients ||
              `${recipients.length}/50 recipients selected`
            }
          />
        )}
        disabled={isLoading}
        sx={{ mb: 2 }}
      />

      {/* Quick Select Buttons */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => setRecipients(users)}
          disabled={isLoading}
        >
          Select All ({users.length})
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() =>
            setRecipients(users.filter((u) => !u.emailVerified))
          }
          disabled={isLoading}
        >
          Unverified Only ({users.filter((u) => !u.emailVerified).length})
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => setRecipients(users.filter((u) => u.emailVerified))}
          disabled={isLoading}
        >
          Verified Only ({users.filter((u) => u.emailVerified).length})
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => setRecipients([])}
          disabled={isLoading}
        >
          Clear
        </Button>
      </Box>

      {/* Subject */}
      <TextField
        fullWidth
        label="Subject"
        value={subject}
        onChange={(e) => {
          setSubject(e.target.value);
          setErrors((prev) => ({ ...prev, subject: "" }));
        }}
        error={Boolean(errors.subject)}
        helperText={errors.subject || `${subject.length}/200 characters`}
        inputProps={{ maxLength: 200 }}
        disabled={isLoading}
        sx={{ mb: 2 }}
      />

      {/* Message */}
      <TextField
        fullWidth
        multiline
        rows={10}
        label="Message"
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          setErrors((prev) => ({ ...prev, message: "" }));
        }}
        error={Boolean(errors.message)}
        helperText={errors.message || `${message.length}/5000 characters`}
        inputProps={{ maxLength: 5000 }}
        disabled={isLoading}
        sx={{ mb: 2 }}
      />

      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button onClick={handleReset} disabled={isLoading}>
          Reset
        </Button>
        <Button
          variant="contained"
          startIcon={isLoading ? <CircularProgress size={20} /> : <Send />}
          onClick={handleSend}
          disabled={
            isLoading ||
            recipients.length === 0 ||
            !subject ||
            !message
          }
        >
          {isLoading ? "Sending..." : `Send to ${recipients.length} user(s)`}
        </Button>
      </Box>
    </Paper>
  );
};

CustomEmailForm.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.shape({
        first: PropTypes.string.isRequired,
        last: PropTypes.string.isRequired,
      }).isRequired,
      email: PropTypes.string.isRequired,
      emailVerified: PropTypes.bool,
    })
  ).isRequired,
  onSend: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default CustomEmailForm;

