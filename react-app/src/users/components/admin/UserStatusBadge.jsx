import React from "react";
import { Chip } from "@mui/material";
import {
  CheckCircle,
  Warning,
  Block,
  Cancel,
} from "@mui/icons-material";
import PropTypes from "prop-types";

const UserStatusBadge = ({ user }) => {
  if (!user.isActive) {
    return (
      <Chip
        label="Suspended"
        color="error"
        size="small"
        icon={<Block />}
        sx={{ fontWeight: "bold" }}
      />
    );
  }

  if (user.emailVerified) {
    return (
      <Chip
        label="Active & Verified"
        color="success"
        size="small"
        icon={<CheckCircle />}
      />
    );
  }

  return (
    <Chip
      label="Unverified"
      color="warning"
      size="small"
      icon={<Warning />}
    />
  );
};

UserStatusBadge.propTypes = {
  user: PropTypes.shape({
    isActive: PropTypes.bool.isRequired,
    emailVerified: PropTypes.bool.isRequired,
  }).isRequired,
};

export default UserStatusBadge;

