import { Container, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import PostFeedback from "../layout/main/mid/post/PostFeedback";
import { useUser } from "../users/providers/UserProvider";
import Poster from "./components/Poster";
import useHandlePosts from "./hooks/useHandlePosts";

const PostsPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [commented, setComment] = useState(false);

  const {
    getFriendsPosts,
    value,
    handlePublish,
    handleDeletePost,
    handleLike,
    handleComment,
  } = useHandlePosts();
  const { postsData, error, isLoading } = value;
  const safePosts = postsData || [];
  const { user } = useUser();

  useEffect(() => {
    getFriendsPosts();
  }, [refresh, commented, getFriendsPosts]);

  const handlePostPublished = () => {
    setRefresh((prev) => !prev);
  };
  const handleCommentPublished = () => {
    setComment((prev) => !prev);
  };
  if (!user)
    return (
      <Container sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Please log in to view posts
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Connect with friends and share your TCG adventures!
        </Typography>
      </Container>
    );
  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 3,
        px: { xs: 1, sm: 0 },
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
      }}
    >
      <Poster
        handleSubmit={handlePublish}
        onPostPublished={handlePostPublished}
      />
      <PostFeedback
        error={error}
        isLoading={isLoading}
        onCommentPublished={handleCommentPublished}
        posts={safePosts}
        onLike={handleLike}
        onComment={handleComment}
        onDelete={handleDeletePost}
      />
    </Container>
  );
};

export default PostsPage;
