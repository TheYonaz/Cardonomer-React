import axios from "axios";
const apiUrl =
  process.env.REACT_APP_API_URL || "https://cardonomer1-back.onrender.com";
export const login = async (user) => {
  try {
    const { data } = await axios.post(`${apiUrl}/users/login`, user);
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
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};
export const GetUser = async (userId) => {
  try {
    const { data } = await axios.get(`${apiUrl}/users/${userId}`);
    if (data) return data;
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};
export const GetAllUsers = async (userId) => {
  try {
    const { data } = await axios.get(`${apiUrl}/users/allusers/${userId}`);
    if (data) return data;
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};
export const EditUser = async (user) => {
  try {
    const serverUser = { ...user };
    const { _id } = serverUser;
    delete serverUser._id;
    const { data } = await axios.put(`${apiUrl}/users/edit/${_id}`, serverUser);
    return Promise.resolve(data);
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};
export const GetUserFriends = async (userId) => {
  try {
    const { data } = await axios.get(`${apiUrl}/users/friends/${userId}`);
    if (data) return data;
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};
export const GetUserCart = async (userId) => {
  try {
    const { data } = await axios.get(`${apiUrl}/cart/${userId}`);
    let normalizedCart = [].concat(...data);
    normalizedCart = normalizedCart.map((item) => item._id);
    if (data) return normalizedCart;
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};
export const addToCart = async (userId, card_id) => {
  try {
    const { data } = await axios.put(`${apiUrl}/cart/add/${userId}`, {
      _id: userId,
      cardId: card_id,
    });
    if (data) return data;
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};

export const addAllToCart = async (cartItems, userID) => {
  try {
    const { data } = await axios.put(`${apiUrl}/cart/addAll/${userID}`, {
      cartItems,
    });
    if (data) return data;
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};

export const removeFromCart = async (userId, card_id) => {
  try {
    const { data } = await axios.delete(`${apiUrl}/cart/remove/${userId}`, {
      data: {
        _id: userId,
        cardId: card_id,
      },
    });

    if (data) return data;
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};

export const addDiscountToUser = async (userID) => {
  try {
    const response = await axios.put(
      `${apiUrl}/cart/addDiscountToPrizes/${userID}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};
export const getPrizes = async (userID) => {
  try {
    const response = await axios.get(`${apiUrl}/cart/prizes/${userID}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};

export const toggleFollowUser = async (currentUserId, targetUserId) => {
  try {
    const { data } = await axios.put(
      `${apiUrl}/users/follow/${targetUserId}`,
      currentUserId
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};
