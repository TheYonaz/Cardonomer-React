import axios from "axios";
import { normalizePostData } from "../helpers/normalizePost";
const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8181";

export const publishPost = async (post) => {
  console.log("inPublish", post);
  try {
    const { data } = await axios.post(`${apiUrl}/posts/post`, post);
    console.log("inPublishPost-postapi", data, post);
    return Promise.resolve(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.message);
    }
    return Promise.reject("An unexpected error occurred!");
  }
};
export const getPost = async (postId) => {
  console.log("inPublish", postId);
  try {
    const { data } = await axios.get(`${apiUrl}/posts/post/${postId}`);
    console.log("getPost-postapi", data, postId);
    return Promise.resolve(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.message);
    }
    return Promise.reject("An unexpected error occurred!");
  }
};
export const getUsersPost = async (userId) => {
  console.log("inPublish", userId);

  try {
    const { data } = await axios.get(
      `${apiUrl}/posts/userPosts/${userId}`,
      userId
    );
    console.log("getUsersPost-postapi", data, userId);
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
    console.log("likePost-postapi", data);
    return Promise.resolve(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.message);
    }
    return Promise.reject("An unexpected error occurred!");
  }
};
export const publishComment = async (postId, commentOBJ) => {
  console.log("inpublishComment-postapi", postId, commentOBJ);
  try {
    const { data } = await axios.put(
      `${apiUrl}/posts/post/comment/${postId}`,
      commentOBJ
    );
    console.log("inpublishComment-postapi1", data);
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
