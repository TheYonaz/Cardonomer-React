import React, { useState, useEffect } from "react";
import { useUser } from "../providers/UserProvider";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import Posts from "../../layout/main/mid/post/Posts";
import { getUsersPost } from "../../posts/service/PostSystemAPI";
import { getUserPokemonDecks } from "../../cards/services/pokemonAPI";
import UserDecks from "./UserDecks";
import UserActionsMenu from "./admin/UserActionsMenu";
import UserStatusBadge from "./admin/UserStatusBadge";
import SuspendUserDialog from "./admin/SuspendUserDialog";
import DeleteUserConfirmation from "./admin/DeleteUserConfirmation";
import ConfirmationDialog from "./admin/ConfirmationDialog";
import useAdminActions from "../hooks/useAdminActions";
import useAxios from "../../hooks/useAxios";

const UsersManagment = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [userPosts, setUserPosts] = useState({});
  const [userDecks, setUserDecks] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const { user } = useUser();
  const adminActions = useAdminActions();
  useAxios();

  // Fetch users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allUsers = await adminActions.handleGetUsersDetailed();
        setUsers(allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    if (user?._id && user?.isAdmin) {
      fetchData();
    }
  }, [user?._id, user?.isAdmin]);

  // Filter users based on tab and search
  useEffect(() => {
    let filtered = users;

    // Filter by tab
    switch (tabValue) {
      case 1: // Verified
        filtered = users.filter((u) => u.emailVerified);
        break;
      case 2: // Unverified
        filtered = users.filter((u) => !u.emailVerified);
        break;
      case 3: // Suspended
        filtered = users.filter((u) => !u.isActive);
        break;
      default: // All
        break;
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (u) =>
          u.name.first.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.name.last.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [users, tabValue, searchQuery]);

  const toggleRowExpansion = async (userId, dataType) => {
    const currentExpanded = expandedRows.find(
      (row) => row.userId === userId && row.dataType === dataType
    );
    if (currentExpanded) {
      setExpandedRows((prev) =>
        prev.filter((row) => row.userId !== userId || row.dataType !== dataType)
      );
    } else {
      try {
        if (dataType === "posts") {
          const posts = await getUsersPost(userId);
          setUserPosts((prevPosts) => ({ ...prevPosts, [userId]: posts }));
        } else if (dataType === "decks") {
          const decks = await getUserPokemonDecks(userId);
          setUserDecks((prevDecks) => ({ ...prevDecks, [userId]: decks }));
        }
        setExpandedRows((prev) => [...prev, { userId, dataType }]);
      } catch (error) {
        console.error(`Error fetching ${dataType}:`, error);
      }
    }
  };

  const refreshUsers = async () => {
    try {
      const allUsers = await adminActions.handleGetUsersDetailed();
      setUsers(allUsers);
    } catch (error) {
      console.error("Error refreshing users:", error);
    }
  };

  const handleAction = (action, targetUser) => {
    setSelectedUser(targetUser);

    switch (action) {
      case "suspend":
        setSuspendDialogOpen(true);
        break;
      case "activate":
        setConfirmAction({
          title: "Activate User Account",
          message: `Are you sure you want to activate ${targetUser.name.first} ${targetUser.name.last}'s account?`,
          action: async () => {
            await adminActions.handleActivateUser(targetUser._id);
            await refreshUsers();
          },
        });
        setConfirmDialogOpen(true);
        break;
      case "delete":
        setDeleteDialogOpen(true);
        break;
      case "clearCards":
        setConfirmAction({
          title: "Clear User Cards",
          message: `Remove all cards, decks, and cart items for ${targetUser.name.first} ${targetUser.name.last}? This cannot be undone.`,
          action: async () => {
            await adminActions.handleClearUserCards(targetUser._id);
            await refreshUsers();
          },
        });
        setConfirmDialogOpen(true);
        break;
      case "verifyEmail":
        setConfirmAction({
          title: "Verify User Email",
          message: `Manually verify ${targetUser.email}?`,
          action: async () => {
            await adminActions.handleVerifyEmail(targetUser._id);
            await refreshUsers();
          },
        });
        setConfirmDialogOpen(true);
        break;
      case "unverifyEmail":
        setConfirmAction({
          title: "Unverify User Email",
          message: `Remove email verification for ${targetUser.email}?`,
          action: async () => {
            await adminActions.handleUnverifyEmail(targetUser._id);
            await refreshUsers();
          },
        });
        setConfirmDialogOpen(true);
        break;
      case "resetPassword":
        setConfirmAction({
          title: "Send Password Reset",
          message: `Send password reset email to ${targetUser.email}?`,
          action: async () => {
            await adminActions.handleResetPassword(targetUser._id);
          },
        });
        setConfirmDialogOpen(true);
        break;
      case "resendVerification":
        setConfirmAction({
          title: "Resend Verification Email",
          message: `Send verification email to ${targetUser.email}?`,
          action: async () => {
            await adminActions.handleResendVerification(targetUser._id);
          },
        });
        setConfirmDialogOpen(true);
        break;
      default:
        break;
    }
  };

  const handleSuspend = async (reason) => {
    try {
      await adminActions.handleSuspendUser(selectedUser._id, reason);
      setSuspendDialogOpen(false);
      await refreshUsers();
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDelete = async () => {
    try {
      await adminActions.handleDeleteUser(selectedUser._id);
      setDeleteDialogOpen(false);
      await refreshUsers();
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleConfirm = async () => {
    if (confirmAction?.action) {
      try {
        await confirmAction.action();
        setConfirmDialogOpen(false);
      } catch (error) {
        // Error handled in hook
      }
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Users Management
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label={`All Users (${users.length})`} />
          <Tab
            label={`Verified (${users.filter((u) => u.emailVerified).length})`}
          />
          <Tab
            label={`Unverified (${
              users.filter((u) => !u.emailVerified).length
            })`}
          />
          <Tab
            label={`Suspended (${users.filter((u) => !u.isActive).length})`}
          />
        </Tabs>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search by name or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Decks</TableCell>
              <TableCell align="center">Posts</TableCell>
              <TableCell>Display</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((userData) => (
              <React.Fragment key={userData._id}>
                <TableRow>
                  <TableCell>{`${userData.name.first} ${userData.name.last}`}</TableCell>
                  <TableCell>{userData.email}</TableCell>
                  <TableCell>
                    <UserStatusBadge user={userData} />
                  </TableCell>
                  <TableCell align="center">
                    {userData.stats?.decks || userData.pokemonDecks?.length || 0}
                  </TableCell>
                  <TableCell align="center">
                    {userData.stats?.posts || userData.publishedPosts?.length || 0}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => toggleRowExpansion(userData._id, "decks")}
                      sx={{ mr: 1 }}
                    >
                      Decks
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => toggleRowExpansion(userData._id, "posts")}
                    >
                      Posts
                    </Button>
                  </TableCell>
                  <TableCell>
                    <UserActionsMenu user={userData} onAction={handleAction} />
                  </TableCell>
                </TableRow>

                {/* Expanded Decks Row */}
                {expandedRows.find(
                  (row) => row.userId === userData._id && row.dataType === "decks"
                ) && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <UserDecks decks={userDecks[userData._id] || []} />
                    </TableCell>
                  </TableRow>
                )}

                {/* Expanded Posts Row */}
                {expandedRows.find(
                  (row) => row.userId === userData._id && row.dataType === "posts"
                ) && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Posts
                        posts={userPosts[userData._id] || []}
                        enableActionBar={false}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialogs */}
      <SuspendUserDialog
        open={suspendDialogOpen}
        onClose={() => setSuspendDialogOpen(false)}
        onSuspend={handleSuspend}
        user={selectedUser}
        loading={adminActions.isLoading}
      />

      <DeleteUserConfirmation
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleDelete}
        user={selectedUser}
        loading={adminActions.isLoading}
      />

      {confirmAction && (
        <ConfirmationDialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          onConfirm={handleConfirm}
          title={confirmAction.title}
          message={confirmAction.message}
          loading={adminActions.isLoading}
        />
      )}
    </Container>
  );
};

export default UsersManagment;
