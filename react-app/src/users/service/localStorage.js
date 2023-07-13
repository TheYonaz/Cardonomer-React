import JwtDecode from "jwt-decode";

const TOKEN = "token";

export const setTokenInLocalStorage = (encryptedToken) => {
  return localStorage.setItem(TOKEN, encryptedToken);
};

export const getUserFromLocalStorage = () => {
  const token = localStorage.getItem(TOKEN);
  if (!token) return null;
  const user = JwtDecode(token);
  return user;
};

export const removeToken = () => localStorage.removeItem(TOKEN);

export const getToken = () => localStorage.getItem(TOKEN);
