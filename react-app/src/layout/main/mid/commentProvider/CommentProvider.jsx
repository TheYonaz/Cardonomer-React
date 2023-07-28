import React, { createContext, useContext, useState, useMemo } from "react";
import { TextField, Button, Box } from "@mui/material";
import useHandlePosts from "../../../../posts/hooks/useHandlePosts";
import { useUser } from "../../../../users/providers/UserProvider";

const CommentContext = createContext();

export const CommentProvider = ({ children }) => {
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentPosted, setCommentPosted] = useState(false);
  const { user } = useUser();
  const toggleCommentInput = (postId) => {
    setActiveCommentPost(activeCommentPost === postId ? null : postId);
  };

  const { handleComment } = useHandlePosts();
  const handleSubmit = async () => {
    try {
      await handleComment(activeCommentPost, {
        user_id: user._id,
        content: commentText,
      });
      setCommentText("");
    } catch (error) {
      console.log(error.message);
    }
    setCommentPosted((prev) => !prev);
  };
  const renderCommentInput = (postId) =>
    activeCommentPost === postId && (
      <Box p={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => {
            setCommentText(e.target.value);
          }}
        />
        <Button
          color="primary"
          variant="contained"
          style={{ marginTop: "1rem" }}
          onClick={() => handleSubmit()}
        >
          Publish Comment
        </Button>
      </Box>
    );
  const value = useMemo(
    () => ({
      toggleCommentInput,
      renderCommentInput,
      activeCommentPost,
      setCommentText,
      commentPosted,
      setCommentPosted,
    }),
    [toggleCommentInput, renderCommentInput, activeCommentPost, commentPosted]
  );
  return (
    <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
  );
};

export const useComment = () => {
  const commentContext = useContext(CommentContext);
  if (!commentContext)
    throw new Error("useComment must be used within a CommentProvider");
  return commentContext;
};
