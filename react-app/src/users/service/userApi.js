import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8181";
export const login = async (user) => {
  try {
    const { data } = await axios.post(`${apiUrl}/users/login`, user);
    // console.log("login-userapi", data, user);
    return Promise.resolve(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.message);
    }
    return Promise.reject("An unexpected error occurred!");
  }
};
export const signup = async (normalizedUser) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/users/registration`,
      normalizedUser
    );
    // console.log("signup-userapi", data, normalizedUser);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};
export const GetUser = async (userId) => {
  try {
    const { data } = await axios.get(`${apiUrl}/users/${userId}`);
    // console.log("GetUser-userapi", data, userId);
    if (data) return data;
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};
export const GetUserFriends = async (userId) => {
  try {
    const { data } = await axios.get(`${apiUrl}/users/friends/${userId}`);
    console.log("GetUserFriends-userapi", data, userId);
    if (data) return data;
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};
export const GetUserCart = async (userId) => {
  try {
    const { data } = await axios.get(`${apiUrl}/cart/${userId}`);
    console.log("GetUserFriends-userapi", data, userId);
    if (data) return data;
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};
export const addToCart = async (userId, cardId) => {
  try {
    const { data } = await axios.post(`${apiUrl}/cart/add/${userId}`, cardId);
    console.log("addToCart-userapi", data);
    if (data) return data;
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};

export const removeFromCart = async (userId, cardId) => {
  try {
    const { data } = await axios.delete(
      `${apiUrl}/cart/remove/${userId}`,
      cardId
    );
    console.log("removeFromCart-userapi", data);
    if (data) return data;
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};
