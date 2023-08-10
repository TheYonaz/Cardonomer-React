import React from "react";
import { useUser } from "../../../../users/providers/UserProvider";
import Post from "../../../../posts/components/Post";
import { Box, Container } from "@mui/material";
const Posts = ({ posts, onComment, onLike, onCommentPublished }) => {
  const { user } = useUser();
  console.log("posts", posts);
  return (
    <Container>
      {posts
        .map((post) => (
          <Box m={2} key={post._id}>
            {" "}
            {console.log("posts", new Date(post.createdAt.toString()))}
            {/* Add margin-bottom to each post */}
            <Post
              timepublished={new Date(post.createdAt.toString())}
              onComment={onComment}
              onCommentPublished={onCommentPublished}
              onLike={onLike}
              content={post.content}
              author={post.publisher_name}
              image={
                post.user_id.image
                  ? post.user_id.image.url
                  : "default_image_url_here"
              }
              likes={post.likes}
              postId={post._id}
              comments={post.comments}
              postContent={post}
            />
            {console.log("posts2", post)}
          </Box>
        ))
        .reverse()}
    </Container>
  );
};

export default Posts;
