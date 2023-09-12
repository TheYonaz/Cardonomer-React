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
  console.log("Users Data:", usersData);

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
        console.log(0, user, token);
        setTokenInLocalStorage(token);
        setToken(token);
        const userFromLocalStorage = getUserFromLocalStorage();
        console.log("handleLogin", userFromLocalStorage);
        requestStatus(false, null, null, userFromLocalStorage);
        snack("success", "Logged Successfully!");
        navigate(ROUTES.CARDS);
      } catch (error) {
        if (typeof error === "string") requestStatus(false, error, null);
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
        await signup(normalizedUser);
        console.log("handleSignUp", normalizedUser);
        await handleLogin({
          email: user.email,
          password: user.password,
        });
        snack("Logged Successfully!");
      } catch (error) {
        if (typeof error === "string") requestStatus(false, error, null);
      }
    },
    [handleLogin, requestStatus, snack]
  );
  const handelGetUser = useCallback(
    async (userId) => {
      try {
        setLoading(false);
        const userFromClient = await GetUser(userId);
        console.log("handleGET user", userFromClient);
        if (userFromClient) {
          requestStatus(false, null, user, userFromClient);
          return userFromClient;
        }
      } catch (error) {
        if (typeof error === "string") requestStatus(false, error, null);
      }
    },
    [user]
  );
  const handelEditUser = useCallback(
    async (user, user_id) => {
      try {
        setLoading(false);
        // const normalize_User = normalizeEditUser(user);
        const normalize_User = user;
        normalize_User._id = user._id;
        await EditUser(normalize_User);
        requestStatus(false, null, null);
        snack("success", "The user has been successfully updated");
        navigate(ROUTES.ROOT);
      } catch (error) {
        if (typeof error === "string") requestStatus(false, error, null);
      }
    },
    [user]
  );
  const handelGetUserFriends = useCallback(
    async (userId) => {
      try {
        const userFromClient = await GetUserFriends(userId);
        console.log("handleGETFriends user", userFromClient);
        if (userFromClient) {
          return userFromClient;
        }
      } catch (error) {
        if (typeof error === "string") requestStatus(false, error, null);
      }
    },
    [user, requestStatus]
  );
  const handleGetAllUsers = async (userId) => {
    try {
      const allUsers = await GetAllUsers(userId);
      if (allUsers) setAllUsers(allUsers);
    } catch (error) {
      if (typeof error === "string") requestStatus(false, error, null);
    }
  };

  const value = useMemo(() => {
    return { isLoading, error, user, allUsers, filteredUsers };
  }, [isLoading, error, user, allUsers, filteredUsers]);

  return {
    value,
    handleLogin,
    handleLogout,
    handleSignup,
    handelGetUser,
    handelGetUserFriends,
    handelEditUser,
    handleGetAllUsers,
  };
};

export default useHandleUsers;
