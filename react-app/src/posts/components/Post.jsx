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
}) => {
  const [showComments, setShowComments] = useState(false);
  const { user } = useUser();
  const [anchorEl, setAnchorEl] = useState(null);

  console.log("author", author);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ marginBottom: "20px" }}>
      <CardHeader
        avatar={<Avatar src={image} />}
        action={
          (user._id === user_id || user.isAdmin) && (
            <Box>
              <MoreVertIcon onClick={handleClick} />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Edit</MenuItem>
                <MenuItem onClick={handleClose}>Delete</MenuItem>
              </Menu>
            </Box>
          )
        }
        title={
          <Box sx={{ textAlign: "left" }}>
            {`${author.first} ${author.last}`}
          </Box>
        }
        subheader={
          <Box sx={{ textAlign: "left" }}>{timepublished.toLocaleString()}</Box>
        }
      />
      <CardContent>
        <Typography variant="h6" color="text" align="left">
          {content}
        </Typography>
      </CardContent>
      {user && (
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

export default Post;
