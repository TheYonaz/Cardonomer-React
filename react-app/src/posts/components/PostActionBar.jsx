import React, { useState } from "react";
import { IconButton, TextField, Button, Box, Badge } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import { useUser } from "../../users/providers/UserProvider";
import { useSnack } from "../../providers/SnackBarProvider";

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
  const snack = useSnack();

  const handleCommentSubmit = () => {
    if (commentText === "" || !commentText) {
      return snack("warning", "Comment has no content");
    }
    onComment(postId, { content: commentText, user_id: user._id });
    setCommentText("");
    setIsCommenting(false);
    onCommentPublished();
  };
  const userLikedPost = likes.map((like) => like.user_id).includes(user._id);
  const handleLikeClick = async () => {
    await onLike(postId);
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
        px: 1,
        pb: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton
          onClick={handleCommentClick}
          color="primary"
          sx={{
            bgcolor: "rgba(208,180,138,0.25)",
            mr: 0.5,
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          }}
        >
          <CommentIcon />
        </IconButton>
        <IconButton
          onClick={handleLikeClick}
          color="secondary"
          sx={{
            bgcolor: "rgba(208,180,138,0.25)",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          }}
        >
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
            marginLeft: 1, // Added left margin
            marginRight: 1, // Added right margin
          }}
        >
          <TextField
            value={commentText}
            onChange={handleCommentChange}
            label="Comment"
            variant="outlined"
            sx={{
              marginInline: 1,
              minWidth: { xs: "60vw", sm: "45vw" },
              marginBottom: 1,
              bgcolor: "rgba(255,255,255,0.92)",
            }}
          />
          <Button
            onClick={handleCommentSubmit}
            variant="contained"
            color="primary"
            sx={{
              paddingInline: 2,
              borderRadius: 2,
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            }}
          >
            Comment
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PostActionBar;
