import { useState, useCallback, useMemo } from "react";
import {
  publishPost,
  getFriendsPosts,
  publishComment,
  getPost,
  likePost,
} from "../service/PostSystemAPI";
import { useSnack } from "../../providers/SnackBarProvider";
import { normalizePostData } from "../../layout/main/mid/post/postNormalization/postNormalization";
// import { useUser } from "../../users/providers/UserProvider";
// import { useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";

const useHandlePosts = () => {
  useAxios();
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [postsData, setpostsData] = useState([]);
  const [onePostData, setOnePostData] = useState([]);
  const [publishedData, setPublishedPost] = useState([]);
  const [lastPublishedPostId, setLastPublishedPostId] = useState(null);
  const [lastLikedPostId, setLastLikedPostId] = useState(null);
  const [lastCommentedPostId, setLastCommentedPostId] = useState(null);
  // const { user } = useUser();
  // const navigate = useNavigate();
  const snack = useSnack();

  const postStatus = useCallback(
    (loading, errorMessage, posts, onePostData) => {
      setLoading(loading);
      setError(errorMessage);
      setpostsData(posts);
      // setOnePostData(onePostData);
    },
    []
  );

  const handlePublish = useCallback(
    async (post) => {
      try {
        setLoading(true);
        const publishedPost = await publishPost(post);
        console.log(1);
        const newPosts = [publishedPost, ...postsData];
        console.log(3);
        postStatus(false, null, newPosts);
        snack("success", "Post Published Successfully!");
        console.log("handlePublish", onePostData);
        console.log("handlePublish2", newPosts);
        console.log(4);
      } catch (error) {
        if (typeof error === "string") postStatus(false, error, null);
      }
    },
    [postsData, isLoading]
  );
  const fetchSinglePost = useCallback(async (postId) => {
    try {
      setLoading(true);
      const fetchedPost = await getPost(postId);
      console.log("fetchSinglePost", fetchedPost);
      postStatus(false, null, fetchedPost);
    } catch (error) {
      if (typeof error === "string") postStatus(false, error, null);
    }
  }, []);
  const handleComment = useCallback(
    async (postId, comment) => {
      try {
        setLoading(true);
        const updatedPost = await publishComment(postId, comment);
        console.log("handleComment", updatedPost);
        // Update the post in the posts data
        const newPostsData = postsData.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        );
        postStatus(false, null, newPostsData);
        snack("success", "Comment Published Successfully!");
      } catch (error) {
        if (typeof error === "string") postStatus(false, error, null);
      }
    },
    [postsData]
  );
  const handleLike = useCallback(async (postId) => {
    try {
      setLoading(true);
      const updatedPost = await likePost(postId);
      console.log("handleLike", updatedPost);
      // const updatedPosts = postsData.map((post) =>
      //   post.post_id === updatedPost._id ? updatedPost : post
      // );
      console.log("hhandleLike2", updatedPost);
      postStatus(false, null, updatedPost);
      snack("success", "Comment Published Successfully!");
      console.log("handleLike3", postsData);
    } catch (error) {
      if (typeof error === "string") postStatus(false, error, null);
    }
  }, []);

  const getfriendsPosts = useCallback(async () => {
    try {
      setLoading(true);
      const friendsPosts = await getFriendsPosts();
      // const posts = setpostsData((prevPosts) =>
      //   normalizePostData([...prevPosts, friendsPosts])
      // );
      console.log("getfriendsPosts", friendsPosts);
      postStatus(false, null, friendsPosts);
      console.log("getfriendsPosts1", postsData);
      snack("success", "Posts Retrieved Successfully!");
    } catch (error) {
      if (typeof error === "string") postStatus(false, error, null);
    }
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      error,
      postsData,
    }),
    [isLoading, error, postsData]
  );

  return {
    value,
    handlePublish,
    getfriendsPosts,
    handleComment,
    handleLike,
    fetchSinglePost,
  };
};

export default useHandlePosts;
