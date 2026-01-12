import { useState, useCallback, useMemo, useEffect } from "react";
import {
  publishPost,
  getFriendsPosts as fetchFriendsPosts,
  publishComment,
  getPost,
  likePost,
  deletePost,
} from "../service/PostSystemAPI";
import { normalizePostData } from "../helpers/normalizePost";
import { useUser } from "../../users/providers/UserProvider";
import { useSnack } from "../../providers/SnackBarProvider";

import useAxios from "../../hooks/useAxios";
import { useSearchParams } from "react-router-dom";

const useHandlePosts = () => {
  useAxios();
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [postsData, setPostsData] = useState([]);
  // const [onePostData, setOnePostData] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState(null);
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const { user } = useUser();
  // const { user } = useUser();
  // const navigate = useNavigate();
  const snack = useSnack();

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);
  useEffect(() => {
    if (query) {
      setFilteredPosts(
        postsData.filter(
          (post) =>
            post.content.includes(query) ||
            post.publisher_name.first.includes(query) ||
            post.publisher_name.last.includes(query)
        )
      );
    } else {
      setFilteredPosts(null);
    }
  }, [postsData, query]);

  const postStatus = useCallback((loading, errorMessage, posts) => {
    setLoading(loading);
    setError(errorMessage);
    setPostsData(posts);
  }, []);

  const handlePublish = useCallback(
    async (post) => {
      try {
        setLoading(true);
        const publishedPost = await publishPost(post);
        const normalized = normalizePostData(publishedPost);
        const newPosts = [...postsData, normalized];
        postStatus(false, null, newPosts);
        snack("success", "Post Published Successfully!");
      } catch (error) {
        if (typeof error === "string") postStatus(false, error, null);
      }
    },
    [snack, postsData, postStatus]
  );
  const fetchSinglePost = useCallback(
    async (postId) => {
      try {
        setLoading(true);
        const fetchedPost = await getPost(postId);

        postStatus(false, null, fetchedPost);
      } catch (error) {
        if (typeof error === "string") postStatus(false, error, null);
      }
    },
    [postStatus]
  );
  const handleComment = useCallback(
    async (postId, comment) => {
      try {
        setLoading(true);
        const updatedPost = normalizePostData(
          await publishComment(postId, comment)
        );

        // Update the post in the posts data
        const newPostsData = postsData.map((post) =>
          post._id === updatedPost._id
            ? { ...post, ...updatedPost, image: updatedPost.image || post.image }
            : post
        );
        postStatus(false, null, newPostsData);
        snack("success", "Comment Published Successfully!");
      } catch (error) {
        if (typeof error === "string") postStatus(false, error, null);
      }
    },
    [postsData, snack, postStatus]
  );
  const handleLike = useCallback(
    async (postId) => {
      try {
        const targetPost = postsData.find((p) => p._id === postId);
        const alreadyLiked =
          user && targetPost?.likes?.some((like) => like.user_id === user._id);
        const updatedPost = await likePost(postId);
        const normalized = normalizePostData(updatedPost);
        const updatedPosts = postsData.map((post) =>
          post._id === normalized._id
            ? { ...post, ...normalized, image: normalized.image || post.image }
            : post
        );
        postStatus(false, null, updatedPosts);
        snack("success", alreadyLiked ? "Unliked successfully!" : "Liked Successfully!");
      } catch (error) {
        if (typeof error === "string") postStatus(false, error, null);
      }
    },
    [snack, postStatus, postsData, user]
  );

  const getFriendsPosts = useCallback(async () => {
    try {
      setLoading(true);
      const friendsPosts = await fetchFriendsPosts();
      postStatus(false, null, friendsPosts);
    } catch (error) {
      if (typeof error === "string") postStatus(false, error, null);
    }
  }, [postStatus]);

  const handleDeletePost = useCallback(
    async (postId, userId) => {
      try {
        setLoading(true);
        await deletePost(postId, userId); // Assuming the method is from the PostSystemAPI service
        const updatedPosts = postsData.filter((post) => post._id !== postId);
        postStatus(false, null, updatedPosts);
        snack("success", "Post Deleted Successfully!");
      } catch (error) {
        if (typeof error === "string") postStatus(false, error, null);
      }
    },
    [postsData, snack, postStatus]
  );

  const value = useMemo(
    () => ({
      isLoading,
      error,
      postsData: filteredPosts || postsData,
    }),
    [isLoading, error, filteredPosts, postsData]
  );

  return {
    value,
    handlePublish,
    getFriendsPosts,
    handleComment,
    handleLike,
    fetchSinglePost,
    handleDeletePost,
  };
};

export default useHandlePosts;
