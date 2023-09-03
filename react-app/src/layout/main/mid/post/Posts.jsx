import React from "react";
import { useUser } from "../../../../users/providers/UserProvider";
import Post from "../../../../posts/components/Post";
import { Box, Container } from "@mui/material";
import useHandlePosts from "../../../../posts/hooks/useHandlePosts";
const Posts = ({ posts, onCommentPublished }) => {
  const { user } = useUser();
  console.log("posts", posts);
  const { handleComment, handleLike } = useHandlePosts();
  const uniquePosts = posts.filter(
    (post, index, self) => index === self.findIndex((p) => p._id === post._id)
  );
  console.log("posts1", uniquePosts);
  return (
    <Container>
      {uniquePosts
        .map((post) => (
          <Box m={2} key={post._id}>
            {console.log(post)}{" "}
            {console.log("posts", new Date(post.createdAt.toString()))}
            {/* Add margin-bottom to each post */}
            <Post
              timepublished={new Date(post.createdAt.toString())}
              onComment={handleComment}
              onCommentPublished={onCommentPublished}
              onLike={handleLike}
              content={post.content}
              author={post.publisher_name}
              image={post.image ? post.image.url : "default_image_url_here"}
              likes={post.likes}
              postId={post._id}
              comments={post.comments}
              postContent={post}
              user_id={post.user_id}
            />
            {console.log("posts2", post)}
          </Box>
        ))
        .reverse()}
    </Container>
  );
};

export default Posts;
