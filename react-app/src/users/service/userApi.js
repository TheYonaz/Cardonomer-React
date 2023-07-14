import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8181";
export const login = async (user) => {
  try {
    const { data } = await axios.post(`${apiUrl}/users/login`, user);
    console.log(4, data, user);
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
    console.log(5, data, normalizedUser);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};
export const GetUser = async (userId) => {
  try {
    const { data } = await axios.get(`${apiUrl}/users/${userId}`);
    console.log(6, data, userId);
    if (data) return data;
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};
export const publishPost = async (post) => {
  try {
    const response = await axios.post("/api/posts", post);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
