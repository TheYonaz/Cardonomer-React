import axios from "axios";
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
export const getFriendsPosts = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/posts/post`);
    console.log("getFriendsPosts-postapi", data);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred!");
  }
};
