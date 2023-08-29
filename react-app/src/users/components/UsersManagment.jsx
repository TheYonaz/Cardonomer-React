import React, { useState, useEffect } from "react";
import { GetAllUsers } from "../service/userApi";
import { useUser } from "../providers/UserProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import Posts from "../../layout/main/mid/post/Posts";

const UsersManagment = () => {
  const [users, setUsers] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      const allUsers = await GetAllUsers(user._id);
      setUsers(allUsers);
    };
    if (user) fetchData();
  }, [user]);

  const toggleRowExpansion = (userId, dataType) => {
    const currentExpanded = expandedRows.find(
      (row) => row.userId === userId && row.dataType === dataType
    );
    if (currentExpanded) {
      setExpandedRows((prev) =>
        prev.filter((row) => row.userId !== userId || row.dataType !== dataType)
      );
    } else {
      setExpandedRows((prev) => [...prev, { userId, dataType }]);
    }
  };

  return (
    <div>
      <h2>Users Management</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Number of Decks</TableCell>
              <TableCell>Number of Posts</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <React.Fragment key={user._id}>
                {console.log(user)}
                <TableRow>
                  <TableCell>{`${user.name.first} ${user.name.last}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.decks?.length || 0}</TableCell>
                  <TableCell>{user.publishedPosts?.length || 0}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => toggleRowExpansion(user._id, "decks")}
                    >
                      Display Decks
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => toggleRowExpansion(user._id, "posts")}
                    >
                      Display Posts
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedRows.find(
                  (row) => row.userId === user._id && row.dataType === "decks"
                ) && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      {/* Display user's decks here */}
                    </TableCell>
                  </TableRow>
                )}
                {expandedRows.find(
                  (row) => row.userId === user._id && row.dataType === "posts"
                ) && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Posts
                        posts={user.publishedPosts ? user.publishedPosts : null}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UsersManagment;
