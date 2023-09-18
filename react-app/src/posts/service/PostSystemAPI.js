import axios from "axios";
import { normalizePostData } from "../helpers/normalizePost";
const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8181";

export const publishPost = async (post) => {
  try {
    const { data } = await axios.post(`${apiUrl}/posts/post`, post);
    return Promise.resolve(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.message);
    }
    return Promise.reject("An unexpected error occurred!");
  }
};
export const getPost = async (postId) => {
  try {
    const { data } = await axios.get(`${apiUrl}/posts/post/${postId}`);
    return Promise.resolve(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.message);
    }
    return Promise.reject("An unexpected error occurred!");
  }
};
export const getUsersPost = async (userId) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/posts/userPosts/${userId}`,
      userId
    );
    return data.map(normalizePostData);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.message);
    }
    return Promise.reject("An unexpected error occurred!");
  }
};
export const likePost = async (postId) => {
  try {
    const { data } = await axios.put(`${apiUrl}/posts/like/${postId}`);
    return Promise.resolve(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.message);
    }
    return Promise.reject("An unexpected error occurred!");
  }
};
export const publishComment = async (postId, commentOBJ) => {
  try {
    const { data } = await axios.put(
      `${apiUrl}/posts/post/comment/${postId}`,
      commentOBJ
    );
    return Promise.resolve(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.message);
    }
    return Promise.reject("An unexpected error occurred!");
  }
};
export const getFriendsPosts = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/posts/post`);
    return data.map(normalizePostData);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred!");
  }
};

export const deletePost = async (postId, userId) => {
  try {
    const { data } = await axios.delete(
      `${apiUrl}/posts/post/${postId}/${userId}`
    );
    return Promise.resolve(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.message);
    }
    return Promise.reject("An unexpected error occurred!");
  }
};
