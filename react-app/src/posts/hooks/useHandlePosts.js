import { useState, useCallback, useMemo, useEffect } from "react";
import {
  publishPost,
  getFriendsPosts,
  publishComment,
  getPost,
  likePost,
  deletePost,
} from "../service/PostSystemAPI";
import { useSnack } from "../../providers/SnackBarProvider";

import useAxios from "../../hooks/useAxios";
import { useSearchParams } from "react-router-dom";

const useHandlePosts = () => {
  useAxios();
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [postsData, setpostsData] = useState([]);
  // const [onePostData, setOnePostData] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState(null);
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  // const { user } = useUser();
  // const navigate = useNavigate();
  const snack = useSnack();

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);
  useEffect(() => {
    if (filteredPosts) {
      setFilteredPosts(
        postsData.filter(
          (post) =>
            post.content.includes(query) ||
            post.publisher_name.first.includes(query) ||
            post.publisher_name.last.includes(query)
        )
      );
    }
  }, [postsData, query, filteredPosts]);

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
        const newPosts = [publishedPost, ...postsData];
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
        const updatedPost = await publishComment(postId, comment);

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
    [postsData, snack, postStatus]
  );
  const handleLike = useCallback(
    async (postId) => {
      try {
        setLoading(true);
        const updatedPost = await likePost(postId);
        // const updatedPosts = postsData.map((post) =>
        //   post.post_id === updatedPost._id ? updatedPost : post
        // );
        postStatus(false, null, updatedPost);
        snack("success", "Liked Successfully!");
      } catch (error) {
        if (typeof error === "string") postStatus(false, error, null);
      }
    },
    [snack, postStatus]
  );

  const getfriendsPosts = useCallback(async () => {
    try {
      setLoading(true);
      const friendsPosts = await getFriendsPosts();
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
    getfriendsPosts,
    handleComment,
    handleLike,
    fetchSinglePost,
    handleDeletePost,
  };
};

export default useHandlePosts;
