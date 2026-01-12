import { Typography, Box } from "@mui/material";
import React from "react";
import Error from "../../../components/Error";
import Spinner from "../../../components/Spinner";
import Posts from "./Posts";

const PostFeedback = ({
  isLoading,
  error,
  posts,
  onPublish,
  onLike,
  onComment,
  onDelete,
  onCommentPublished,
}) => {
  if (isLoading) return <Spinner />;
  if (error) return <Error errorMessage={error} />;
  if (posts && posts.length)
    return (
      <Posts
        posts={posts}
        onPublish={onPublish}
        onLike={onLike}
        onComment={onComment}
        onDelete={onDelete}
        onCommentPublished={onCommentPublished}
      />
    );
  if (posts && !posts.length)
    return (
      <Box sx={{ textAlign: "center", mt: 8, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          No posts yet
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Add some friends to see their posts here!
        </Typography>
      </Box>
    );
  return null;
};

export default React.memo(PostFeedback);
