import React, { useState, useMemo } from "react";
import Post from "../../../../posts/components/Post";
import { Box, Container, TextField } from "@mui/material";

const Posts = ({
  posts,
  onCommentPublished,
  onLike,
  onComment,
  onDelete,
  enableActionBar = true,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const uniquePosts = useMemo(
    () =>
      posts.filter(
        (post, index, self) => index === self.findIndex((p) => p._id === post._id)
      ),
    [posts]
  );

  const filteredPosts = useMemo(() => {
    if (!searchTerm) return uniquePosts;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return uniquePosts.filter((post) => {
      return (
        post.content.toLowerCase().includes(lowerSearchTerm) ||
        post.publisher_name.first.toLowerCase().includes(lowerSearchTerm) ||
        post.publisher_name.last.toLowerCase().includes(lowerSearchTerm)
      );
    });
  }, [uniquePosts, searchTerm]);

  return (
    <Container>
      <Box m={2}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search Posts"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by content or author..."
        />
      </Box>
      {filteredPosts
        .map((post) => (
          <Box m={2} key={post._id}>
            <Post
              timepublished={new Date(post.createdAt.toString())}
              onComment={onComment}
              onCommentPublished={onCommentPublished}
              onLike={onLike}
              onDelete={onDelete}
              content={post.content}
              author={post.publisher_name}
              image={post.image ? post.image.url : "default_image_url_here"}
              likes={post.likes}
              postId={post._id}
              comments={post.comments}
              postContent={post}
              user_id={post.user_id}
              enableActionBar={enableActionBar}
            />
          </Box>
        ))
        .reverse()}
    </Container>
  );
};

export default React.memo(Posts);
