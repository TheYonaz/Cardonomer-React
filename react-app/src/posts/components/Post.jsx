import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Typography,
  CardContent,
  Button,
  Divider,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import CommentsBox from "./CommentsBox/CommentsBox";
import PostActionBar from "./PostActionBar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { useUser } from "../../users/providers/UserProvider";

const Post = ({
  timepublished,
  content,
  author,
  image,
  postId,
  comments,
  onLike,
  onComment,
  onCommentPublished,
  likes,
  user_id,
  enableActionBar,
  onDelete,
}) => {
  const [showComments, setShowComments] = useState(false);
  const { user } = useUser();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (action) => {
    if (action === "delete") {
      setAnchorEl(null);
      onDelete(postId, user_id);
    }
    setAnchorEl(null);
  };

  return (
    <Card
      sx={{
        marginBottom: "18px",
        borderRadius: 3,
        border: "1px solid rgba(208, 180, 138, 0.6)",
        boxShadow: "0 12px 26px rgba(0,0,0,0.12)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(252,247,235,0.96) 100%)",
        position: "relative",
        overflow: "hidden",
        "&:before": {
          content: '""',
          position: "absolute",
          top: -60,
          right: -60,
          width: 160,
          height: 160,
          background: "radial-gradient(circle, rgba(255,238,200,0.4) 0%, transparent 60%)",
          zIndex: 0,
        },
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            src={image}
            alt={`${author?.first || "User"}'s avatar`}
            sx={{
              border: "2px solid #d0b48a",
              boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
            }}
          />
        }
        action={
          user && (user._id === user_id || user.isAdmin) && (
            <Box>
              <MoreVertIcon 
                onClick={handleClick}
                sx={{ cursor: 'pointer' }}
                aria-label="Post options"
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => handleClose("delete")}>
                  Delete
                </MenuItem>
                <MenuItem onClick={handleClose}>Edit</MenuItem>
              </Menu>
            </Box>
          )
        }
        title={
          <Box sx={{ textAlign: "left", fontWeight: 700, color: "#3e2f1c" }}>
            {author ? `${author.first} ${author.last}` : "Unknown User"}
          </Box>
        }
        subheader={
          <Box sx={{ textAlign: "left", color: "rgba(0,0,0,0.6)" }}>
            {timepublished ? new Date(timepublished).toLocaleString() : ""}
          </Box>
        }
      />
      <CardContent>
        <Typography
          variant="h6"
          color="text"
          align="left"
          sx={{ color: "#3e2f1c", position: "relative", zIndex: 1 }}
        >
          {content}
        </Typography>
      </CardContent>
      {user && enableActionBar && (
        <PostActionBar
          onComment={onComment}
          onLike={onLike}
          postId={postId}
          likes={likes}
          onCommentPublished={onCommentPublished}
        />
      )}
      {comments[0] && (
        <Box>
          <Box textAlign="left">
            <Button
              onClick={() => setShowComments((prev) => !prev)}
              sx={{
                textAlign: "left",
                textTransform: "none",
                backgroundColor: "transparent",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              {`Comments: ${comments.length}`}
            </Button>
          </Box>
          {showComments && (
            <Box>
              <Divider />
              <CommentsBox comments={comments} />
            </Box>
          )}
        </Box>
      )}
    </Card>
  );
};

export default React.memo(Post);
