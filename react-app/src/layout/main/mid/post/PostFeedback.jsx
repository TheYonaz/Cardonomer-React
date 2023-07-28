import { Typography } from "@mui/material";
import React from "react";
import Error from "../../../components/Error";
import Spinner from "../../../components/Spinner";
import Posts from "./Posts";

const PostFeedback = ({
  isLoading,
  error,
  posts,
  onPublish,
  onComment,
  onLike,
  onCommentPublished,
}) => {
  if (isLoading) return <Spinner />;
  if (error) return <Error errorMessage={error} />;
  if (posts && posts.length)
    return (
      <Posts
        posts={posts}
        onComment={onComment}
        onPublish={onPublish}
        onLike={onLike}
        onCommentPublished={onCommentPublished}
      />
    );
  if (posts && !posts.length)
    return <Typography>Oops, there are no posts add some friends!</Typography>;
  return null;
};

export default PostFeedback;
