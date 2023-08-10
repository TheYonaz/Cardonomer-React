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
}) => {
  const [showComments, setShowComments] = useState(false);
  const { user } = useUser();
  return (
    <Card sx={{ marginBottom: "20px" }}>
      <CardHeader
        avatar={<Avatar src={image} />}
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
