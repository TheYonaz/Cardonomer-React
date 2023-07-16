import { Box } from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import Poster from "../../../posts/components/Poster";
import useHandlePosts from "../../../posts/hooks/useHandlePosts";
import { useUser } from "../../../users/providers/UserProvider";
import Post from "./post/Post";
// import useScrollLoader from "./scroll/ScrollLoader";

const MainPosts = () => {
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { user } = useUser();
  const {
    getfriendsPosts,
    value: { postsData,error,isLoading },
  } = useHandlePosts();
  
  useEffect(() => {
    const fetchPosts = async () => {
      await getfriendsPosts()
      setDisplayedPosts(postsData);
    };
    console.log(2);
    fetchPosts()
  }, [refresh,isLoading]);
  const publishAndFetch = (newPost) => {
    setRefresh(prev => !prev);
    console.log("publishAndFetch", newPost, 1);
  }
  
  return (
    <div>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Poster onPublish={publishAndFetch} />
        {
          displayedPosts.map((post) => (
            <Post
              key={post.post_id}
              content={post.content}
              author={post.author}
              image={post.image}
              timePublished={post.createdAt}
            />
          )).reverse()
        }
      </Box>
    </div>
  );
};

export default MainPosts;
