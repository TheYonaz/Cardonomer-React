import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { login, signup, GetUser } from "../service/userApi";

const useHandleUsers = () => {
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [usersData, setUsersData] = useState(null);
  const { user, setUser, setToken } = useUser();
  const navigate = useNavigate();
  const snack = useSnack();
  useAxios();
  const requestStatus = useCallback(
    (loading, errorMessage, userData, user = null) => {
      setLoading(loading);
      setError(errorMessage);
      setUser(user);
      setUsersData(userData);
    },
    [setUser]
  );
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
    [navigate, requestStatus, setToken]
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
    [handleLogin, requestStatus]
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
    [usersData]
  );

  const value = useMemo(() => {
    return { isLoading, error, user };
  }, [isLoading, error, user]);

  return {
    value,
    handleLogin,
    handleLogout,
    handleSignup,
    handelGetUser,
  };
};

export default useHandleUsers;
