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

  const { getfriendsPosts, value, handlePublish } = useHandlePosts();
  const { postsData, error, isLoading } = value;
  const { user } = useUser();

  useEffect(() => {
    getfriendsPosts();
  }, [refresh, commented, user]);

  const handlePostPublished = () => {
    setRefresh((prev) => !prev);
  };
  const handleCommentPublished = () => {
    setComment((prev) => !prev);
  };
  if (!user) return <Typography>Please log in</Typography>;
  return (
    <Container>
      {" "}
      <Poster
        handleSubmit={handlePublish}
        onPostPublished={handlePostPublished}
      />
      <PostFeedback
        error={error}
        isLoading={isLoading}
        onCommentPublished={handleCommentPublished}
        posts={postsData}
      />
    </Container>
  );
};

export default PostsPage;
