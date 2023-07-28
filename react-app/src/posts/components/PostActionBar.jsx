import React, { useState } from "react";
import { IconButton, TextField, Button, Box, Badge } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import useHandlePosts from "../hooks/useHandlePosts";
import { useUser } from "../../users/providers/UserProvider";

const PostActionBar = ({
  onComment,
  onLike,
  postId,
  likes = [],
  onCommentPublished,
}) => {
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const handleCommentClick = () => {
    setIsCommenting(!isCommenting);
  };
  const { user } = useUser();

  const handleCommentSubmit = () => {
    console.log("comment", { content: commentText, post_id: postId });
    onComment(postId, { content: commentText, user_id: user._id });
    setCommentText("");
    setIsCommenting(false);
    onCommentPublished();
  };
  const userLikedPost = likes.map((like) => like.user_id).includes(user._id);
  const handleLikeClick = () => {
    onLike(postId);
    onCommentPublished();
  };

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={handleCommentClick} color="primary">
          <CommentIcon />
        </IconButton>
        <IconButton onClick={handleLikeClick} color="secondary">
          <Badge badgeContent={likes.length} color="primary">
            {userLikedPost ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </Badge>
        </IconButton>
      </Box>
      {isCommenting && (
        <Box
          component="form"
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            width: "100%",
            marginLeft: 1, // Added left margin
            marginRight: 1, // Added right margin
          }}
        >
          <TextField
            value={commentText}
            onChange={handleCommentChange}
            label="Comment"
            variant="outlined"
            sx={{ marginInline: 2, minWidth: "50vw" }}
          />
          <Button
            onClick={handleCommentSubmit}
            variant="contained"
            color="primary"
            sx={{ marginRight: 1 }}
          >
            Publish Comment
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PostActionBar;
