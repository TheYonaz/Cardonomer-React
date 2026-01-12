import React from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { ChevronRight } from "@mui/icons-material";
import PropTypes from "prop-types";

const SidebarItem = ({ icon, label, to, description }) => {
  const content = (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding={1.5}
      width="100%"
      sx={{
        textDecoration: "none",
        borderRadius: 2,
        mb: 1,
        background: "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2))",
        border: "1px solid rgba(210, 180, 140, 0.2)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: to ? "pointer" : "default",
        "&:hover": to
          ? {
              background: "linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.08))",
              borderColor: "rgba(102, 126, 234, 0.3)",
              transform: "translateX(4px)",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
              "& .sidebar-icon": {
                transform: "scale(1.1) rotate(5deg)",
                color: "#667eea",
              },
              "& .sidebar-label": {
                color: "#667eea",
                fontWeight: 600,
              },
              "& .chevron-icon": {
                transform: "translateX(4px)",
                opacity: 1,
              },
            }
          : {
              opacity: 0.6,
            },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
        <Box
          className="sidebar-icon"
          sx={{
            color: "#5e4b3c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            className="sidebar-label"
            sx={{
              fontSize: "0.95rem",
              fontWeight: 500,
              color: "#2c2c2c",
              transition: "all 0.2s ease",
              lineHeight: 1.2,
            }}
          >
            {label}
          </Typography>
          {description && (
            <Typography
              variant="caption"
              sx={{
                color: "#999",
                fontSize: "0.7rem",
                fontStyle: "italic",
              }}
            >
              {description}
            </Typography>
          )}
        </Box>
      </Box>
      {to && (
        <ChevronRight
          className="chevron-icon"
          sx={{
            color: "#999",
            fontSize: 20,
            transition: "all 0.3s ease",
            opacity: 0.5,
          }}
        />
      )}
    </Box>
  );

  if (to) {
    return (
      <Box component={Link} to={to} sx={{ textDecoration: "none", color: "inherit" }}>
        {content}
      </Box>
    );
  }

  return content;
};

SidebarItem.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  to: PropTypes.string,
  description: PropTypes.string,
};

export default SidebarItem;
