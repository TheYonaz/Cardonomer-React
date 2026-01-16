import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  MoreVert,
  CheckCircle,
  Cancel,
  Block,
  CheckCircleOutline,
  VpnKey,
  Email,
  Delete,
  DeleteSweep,
} from "@mui/icons-material";
import PropTypes from "prop-types";

const UserActionsMenu = ({ user, onAction }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action) => {
    handleClose();
    onAction(action, user);
  };

  const isActive = user.isActive !== false; // Default to true if undefined
  const isVerified = user.emailVerified;

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {/* Email Verification Actions */}
        {!isVerified ? (
          <MenuItem onClick={() => handleAction("verifyEmail")}>
            <ListItemIcon>
              <CheckCircle fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Verify Email</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={() => handleAction("unverifyEmail")}>
            <ListItemIcon>
              <Cancel fontSize="small" color="warning" />
            </ListItemIcon>
            <ListItemText>Unverify Email</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={() => handleAction("resendVerification")}>
          <ListItemIcon>
            <Email fontSize="small" />
          </ListItemIcon>
          <ListItemText>Resend Verification</ListItemText>
        </MenuItem>

        <Divider />

        {/* Account Status Actions */}
        {isActive ? (
          <MenuItem onClick={() => handleAction("suspend")}>
            <ListItemIcon>
              <Block fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Suspend Account</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={() => handleAction("activate")}>
            <ListItemIcon>
              <CheckCircleOutline fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Activate Account</ListItemText>
          </MenuItem>
        )}

        <Divider />

        {/* Password Actions */}
        <MenuItem onClick={() => handleAction("resetPassword")}>
          <ListItemIcon>
            <VpnKey fontSize="small" />
          </ListItemIcon>
          <ListItemText>Send Password Reset</ListItemText>
        </MenuItem>

        <Divider />

        {/* Destructive Actions */}
        <MenuItem onClick={() => handleAction("clearCards")}>
          <ListItemIcon>
            <DeleteSweep fontSize="small" color="warning" />
          </ListItemIcon>
          <ListItemText sx={{ color: "warning.main" }}>
            Clear User Cards
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction("delete")}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: "error.main" }}>Delete User</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

UserActionsMenu.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.shape({
      first: PropTypes.string.isRequired,
      last: PropTypes.string.isRequired,
    }).isRequired,
    email: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
    emailVerified: PropTypes.bool,
  }).isRequired,
  onAction: PropTypes.func.isRequired,
};

export default UserActionsMenu;

