import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import { useSnack } from "../../providers/SnackBarProvider";
import ROUTES from "../../router/routesModel";
import normalizeUser from "../helpers/normalization/normalizeUser";
import { useUser } from "../providers/UserProvider";

import {
  removeToken,
  setTokenInLocalStorage,
  getUserFromLocalStorage,
} from "../service/localStorage";
import {
  login,
  signup,
  GetUser,
  GetUserFriends,
  EditUser,
  GetAllUsers,
} from "../service/userApi";

const useHandleUsers = (currentQuery) => {
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [usersData, setUsersData] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");

  const { user, setUser, setToken } = useUser();
  const navigate = useNavigate();
  const snack = useSnack();
  useAxios();
  const requestStatus = useCallback(
    (loading, errorMessage, userData, user = null) => {
      setLoading(loading);
      setError(errorMessage);
      setUsersData(userData);
      setUser(user);
    },
    [setUser]
  );

  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    if (query) {
      setFilteredUsers(
        allUsers.filter(
          (user) =>
            user.name.first.toLowerCase().includes(query.toLowerCase()) ||
            user.name.last.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredUsers([]); // reset if no query
    }
  }, [allUsers, query]);

  const handleLogin = useCallback(
    async (user) => {
      try {
        setLoading(true);
        const token = await login(user);
        setTokenInLocalStorage(token);
        setToken(token);
        const userFromLocalStorage = getUserFromLocalStorage();
        requestStatus(false, null, null, userFromLocalStorage);
        snack("success", "Logged Successfully!");
        navigate(ROUTES.ROOT);
      } catch (error) {
        if (typeof error === "string") {
          requestStatus(false, error, null);
          snack("error", error);
        }
      }
    },
    [navigate, requestStatus, setToken, snack]
  );

  const handleLogout = useCallback(() => {
    removeToken();
    setUser(null);
  }, [setUser]);
  const handleSignup = useCallback(
    async (user) => {
      try {
        setLoading(true);
        const normalizedUser = normalizeUser(user);
        const response = await signup(normalizedUser);
        requestStatus(false, null, null);
        snack("success", "Registration successful! Please check your email to verify your account.");
        navigate(ROUTES.LOGIN);
      } catch (error) {
        if (typeof error === "string") {
          requestStatus(false, error, null);
          snack("error", error);
        }
      }
    },
    [requestStatus, snack, navigate]
  );
  const handleGetUser = useCallback(
    async (userId) => {
      try {
        setLoading(false);
        const userFromClient = await GetUser(userId);
        if (userFromClient) {
          requestStatus(false, null, null, userFromClient);
          return userFromClient;
        }
      } catch (error) {
        if (typeof error === "string") requestStatus(false, error, null);
      }
    },
    [requestStatus]
  );
  const handleEditUser = useCallback(
    async (userData) => {
      try {
        setLoading(false);
        const normalize_User = { ...userData, _id: userData._id };
        await EditUser(normalize_User);
        requestStatus(false, null, null);
        snack("success", "The user has been successfully updated");
        navigate(ROUTES.ROOT);
      } catch (error) {
        if (typeof error === "string") requestStatus(false, error, null);
      }
    },
    [requestStatus, snack, navigate]
  );
  const handleGetUserFriends = useCallback(
    async (userId) => {
      try {
        const userFromClient = await GetUserFriends(userId);
        if (userFromClient) {
          return userFromClient;
        }
      } catch (error) {
        if (typeof error === "string") requestStatus(false, error, null);
      }
    },
    [requestStatus]
  );
  const handleGetAllUsers = useCallback(
    async (userId) => {
      try {
        const allUsers = await GetAllUsers(userId);
        if (allUsers) setAllUsers(allUsers);
      } catch (error) {
        if (typeof error === "string") requestStatus(false, error, null);
      }
    },
    [requestStatus]
  );

  const value = useMemo(() => {
    return { isLoading, error, user, allUsers, filteredUsers };
  }, [isLoading, error, user, allUsers, filteredUsers]);

  return {
    value,
    handleLogin,
    handleLogout,
    handleSignup,
    handleGetUser,
    handleGetUserFriends,
    handleEditUser,
    handleGetAllUsers,
    setAllUsers,
  };
};

export default useHandleUsers;
