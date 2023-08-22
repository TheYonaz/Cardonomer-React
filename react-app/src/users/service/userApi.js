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
export const GetAllUsers = async (userId) => {
  try {
    const { data } = await axios.get(`${apiUrl}/allusers/${userId}`);
    // console.log("GetAllUsers-userapi", data, userId);
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
    console.log("GetUserCart-userapi", data, userId);
    let normalizedCart = [].concat(...data);
    normalizedCart = normalizedCart.map((item) => item._id);
    console.log("GetUserCart-userapi1", normalizedCart, userId);
    if (data) return normalizedCart;
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};
export const addToCart = async (userId, card_id) => {
  try {
    console.log(card_id);
    console.log(userId);
    const { data } = await axios.put(`${apiUrl}/cart/add/${userId}`, {
      _id: userId,
      cardId: card_id,
    });
    console.log("addToCart-userapi", data);
    if (data) return data;
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};

export const removeFromCart = async (userId, card_id) => {
  console.log("removeFromCart", {
    _id: userId,
    cardId: card_id,
  });
  try {
    const { data } = await axios.delete(`${apiUrl}/cart/remove/${userId}`, {
      data: {
        _id: userId,
        cardId: card_id,
      },
    });

    console.log("removeFromCart-userapi", data);
    if (data) return data;
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};
