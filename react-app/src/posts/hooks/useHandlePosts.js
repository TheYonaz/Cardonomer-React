import { useState, useCallback, useMemo, useEffect } from "react";
import { publishPost, getFriendsPosts } from "../service/PostSystemAPI";
import { useSnack } from "../../providers/SnackBarProvider";
import { normalizePostData } from '../../layout/main/mid/post/postNormalization/postNormalization';
import { useUser } from "../../users/providers/UserProvider";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../router/routesModel";
import useAxios from "../../hooks/useAxios"

const useHandlePosts = () => {
  useAxios()
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [postsData, setpostsData] = useState([]);
  const { user } = useUser();
  const navigate = useNavigate()
  const snack = useSnack();

  const postStatus = useCallback((loading, errorMessage, post = null) => {
    setLoading(loading);
    setError(errorMessage);
    if (post !== null) {
      setpostsData(normalizePostData(Array.isArray(post) ? post : [post]));
    }
  }, []);

  const handlePublish = useCallback(async (post) => {
    try {
      setLoading(true);
      const publishedPost = await publishPost(post);
      setpostsData((prevPosts) => normalizePostData([...prevPosts, publishedPost]));
      postStatus(false, null, publishedPost);
      snack("success", "Post Published Successfully!");
      // navigate(ROUTES.ROOT)
    } catch (error) {
      if (typeof error === "string") postStatus(false, error, null);
    } finally {
      setLoading(false);
    }
  }, [postStatus, snack]);

  const getfriendsPosts = useCallback(async () => {
    try {
      setLoading(true);
      const friendsPost = await getFriendsPosts();
      console.log("Response data:", friendsPost);
      setpostsData((prevPosts) => normalizePostData([...prevPosts, friendsPost]));
      postStatus(false, null);
      snack("success", "Posts Retrieved Successfully!");
    } catch (error) {
      if (typeof error === "string") postStatus(false, error, null);
    } finally {
      setLoading(false);
    }
  }, [postStatus,snack]);

  const value = useMemo(() => ({ isLoading, error, postsData }), [isLoading, error, postsData]);

  return {
    value,
    handlePublish,
    getfriendsPosts,
  };
};

export default useHandlePosts;