import { Container } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostFeedback from "../layout/main/mid/post/PostFeedback";
import { useUser } from "../users/providers/UserProvider";
import Poster from "./components/Poster";
import useHandlePosts from "./hooks/useHandlePosts";

const PostsPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [commented, setComment] = useState(false);
  const { getfriendsPosts, value, handlePublish } = useHandlePosts();
  const { postsData, error, isLoading } = value;

  useEffect(() => {
    getfriendsPosts();
    console.log("postsData", postsData);
  }, [refresh, commented]);

  const handlePostPublished = () => {
    setRefresh((prev) => !prev);
  };
  const handleCommentPublished = () => {
    setComment((prev) => !prev);
  };
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
