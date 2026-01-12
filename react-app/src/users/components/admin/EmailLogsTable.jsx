import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Visibility, CheckCircle, Error, Schedule } from "@mui/icons-material";
import PropTypes from "prop-types";

const EmailLogsTable = ({ logs, onViewDetails }) => {
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <CheckCircle fontSize="small" color="success" />;
      case "failed":
        return <Error fontSize="small" color="error" />;
      case "pending":
        return <Schedule fontSize="small" color="warning" />;
      default:
        return null;
    }
  };

  const getStatusChip = (status) => {
    const colors = {
      sent: "success",
      failed: "error",
      pending: "warning",
    };
    return (
      <Chip
        label={status}
        color={colors[status] || "default"}
        size="small"
        icon={getStatusIcon(status)}
      />
    );
  };

  const getEmailTypeChip = (type) => {
    const colors = {
      verification: "primary",
      passwordReset: "secondary",
      custom: "info",
      suspension: "error",
      activation: "success",
    };
    const labels = {
      verification: "Verification",
      passwordReset: "Password Reset",
      custom: "Custom",
      suspension: "Suspension",
      activation: "Activation",
    };
    return (
      <Chip
        label={labels[type] || type}
        color={colors[type] || "default"}
        size="small"
        variant="outlined"
      />
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    if (filterType !== "all" && log.emailType !== filterType) return false;
    if (filterStatus !== "all" && log.status !== filterStatus) return false;
    return true;
  });

  return (
    <Box>
      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filterType}
            label="Type"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="verification">Verification</MenuItem>
            <MenuItem value="passwordReset">Password Reset</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
            <MenuItem value="suspension">Suspension</MenuItem>
            <MenuItem value="activation">Activation</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="sent">Sent</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="body2" sx={{ alignSelf: "center", ml: "auto" }}>
          Showing {filteredLogs.length} of {logs.length} emails
        </Typography>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Recipient</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary">No emails found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell>{formatDate(log.sentAt)}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {log.userId?.name
                        ? `${log.userId.name.first} ${log.userId.name.last}`
                        : "Unknown"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {log.recipientEmail}
                    </Typography>
                  </TableCell>
                  <TableCell>{getEmailTypeChip(log.emailType)}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {log.subject}
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusChip(log.status)}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => onViewDetails(log)}
                      title="View Details"
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

EmailLogsTable.propTypes = {
  logs: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      sentAt: PropTypes.string.isRequired,
      recipientEmail: PropTypes.string.isRequired,
      emailType: PropTypes.string.isRequired,
      subject: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

export default EmailLogsTable;

