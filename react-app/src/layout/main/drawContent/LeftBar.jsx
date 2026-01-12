import React from "react";
import { Box, Typography, Fade } from "@mui/material";
import { Assessment, History, People } from "@mui/icons-material";
import SidebarItem from "./SideBarItem";
import ROUTES from "../../../router/routesModel";

const LeftSidebar = () => {
  return (
    <Fade in timeout={800}>
      <Box
        component="div"
        display="flex"
        flexDirection="column"
        height="fit-content"
        maxHeight="90vh"
        sx={{
          position: "sticky",
          top: 80,
          width: { md: "280px", sm: "240px" },
          mx: 2,
          borderRadius: 3,
          background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(210, 180, 140, 0.2)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2.5,
            background: "linear-gradient(135deg, #f5e6c8 0%, #ead9b5 100%)",
            borderBottom: "1px solid rgba(210, 180, 140, 0.3)",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#5e4b3c",
              letterSpacing: "0.02em",
            }}
          >
            Quick Access
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "#7a6a54",
              fontWeight: 500,
              mt: 0.5,
              display: "block",
            }}
          >
            Navigate to key features
          </Typography>
        </Box>

        {/* Navigation Items */}
        <Box sx={{ p: 2 }}>
          <SidebarItem
            icon={<Assessment />}
            label="Card Analytics"
            to={ROUTES.GRAPH}
          />
          <SidebarItem
            icon={<History />}
            label="Recent Games"
            description="Coming soon"
          />
          <SidebarItem
            icon={<People />}
            label="Recently Played"
            description="Coming soon"
          />
        </Box>

        {/* Footer Tip */}
        <Box
          sx={{
            mt: "auto",
            p: 2,
            background: "linear-gradient(135deg, #f5e6c8 0%, #ead9b5 100%)",
            borderTop: "1px solid rgba(210, 180, 140, 0.3)",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#7a6a54",
              fontWeight: 500,
              textAlign: "center",
              display: "block",
              lineHeight: 1.4,
            }}
          >
            💡 Tip: Click on cards to view details
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

export default LeftSidebar;
