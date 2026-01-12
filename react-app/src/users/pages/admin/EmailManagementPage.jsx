import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useUser } from "../../providers/UserProvider";
import { Navigate } from "react-router-dom";
import ROUTES from "../../../router/routesModel";
import useAdminActions from "../../hooks/useAdminActions";
import EmailLogsTable from "../../components/admin/EmailLogsTable";
import CustomEmailForm from "../../components/admin/CustomEmailForm";
import EmailLogDetailsModal from "../../components/admin/EmailLogDetailsModal";

const EmailManagementPage = () => {
  const { user } = useUser();
  const [tabValue, setTabValue] = useState(0);
  const [emailLogs, setEmailLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const adminActions = useAdminActions();

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [logs, usersData] = await Promise.all([
          adminActions.handleGetEmailLogs(),
          adminActions.handleGetUsersDetailed(),
        ]);
        setEmailLogs(logs);
        setUsers(usersData);
      } catch (err) {
        setError("Error loading data");
      } finally {
        setLoading(false);
      }
    };

    if (user?.isAdmin) {
      fetchData();
    }
  }, [user?.isAdmin]);

  // Check if user is admin - after all hooks
  if (!user || !user.isAdmin) {
    return <Navigate to={ROUTES.ROOT} replace />;
  }

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setDetailsModalOpen(true);
  };

  const handleSendEmail = async (emailData) => {
    await adminActions.handleSendCustomEmail(emailData);
    // Refresh logs
    const logs = await adminActions.handleGetEmailLogs();
    setEmailLogs(logs);
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Email Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Email Logs" />
          <Tab label="Send Custom Email" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      {tabValue === 0 && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            View all emails sent from the system
          </Typography>
          <EmailLogsTable logs={emailLogs} onViewDetails={handleViewDetails} />
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Send custom emails to selected users
          </Typography>
          <CustomEmailForm
            users={users}
            onSend={handleSendEmail}
            isLoading={adminActions.isLoading}
          />
        </Box>
      )}

      {/* Email Details Modal */}
      <EmailLogDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        log={selectedLog}
      />
    </Container>
  );
};

export default EmailManagementPage;

