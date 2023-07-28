import { Box } from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import Poster from "../../../posts/components/Poster";
import useHandlePosts from "../../../posts/hooks/useHandlePosts";
import { useUser } from "../../../users/providers/UserProvider";
import { useComment } from "./commentProvider/CommentProvider";
import Post from "./post/Posts";
// import useScrollLoader from "./scroll/ScrollLoader";

const MainPosts = () => {
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { user } = useUser();
  const {
    getfriendsPosts,
    fetchSinglePost,
    lastCommentedPostId,
    lastLikedPostId,
    lastPublishedPostId,
    value: { postsData, error, isLoading },
  } = useHandlePosts();
  console.log("postsData", postsData);
  const { commentPosted } = useComment();
  useEffect(() => {
    const fetchPosts = async () => {
      await getfriendsPosts();
      setDisplayedPosts(postsData);
    };
    fetchPosts();
    console.log("useEffect1");
  }, [isLoading]);
  // }, [{refresh, isLoading, commentPosted}]);
  useEffect(() => {
    const fetchingPost = async () => {
      const fetchPost = await fetchSinglePost(lastPublishedPostId);
      console.log("useEffect2");
      console.log("useEffect", lastPublishedPostId);
      setDisplayedPosts((prevPosts) => {
        const updatedPosts = prevPosts.map((post) => {
          return post.post_id === fetchPost.post_id ? fetchPost : post;
        });
        console.log(updatedPosts);
        return updatedPosts;
      });
    };
    fetchingPost();
  }, [lastPublishedPostId]);
  useEffect(() => {
    const fetchingPost = async () => {
      const fetchPost = await fetchSinglePost(lastLikedPostId);
      console.log("useEffect3");
      console.log("useEffect", lastLikedPostId);
      setDisplayedPosts((prevPosts) => {
        const updatedPosts = prevPosts.map((post) => {
          return post.post_id === fetchPost.post_id ? fetchPost : post;
        });
        console.log(updatedPosts);
        return updatedPosts;
      });
    };
    fetchingPost();
  }, [lastLikedPostId]);
  useEffect(() => {
    const fetchingPost = async () => {
      const fetchPost = await fetchSinglePost(lastCommentedPostId);
      console.log("useEffect4");
      console.log("useEffect", lastCommentedPostId);
      setDisplayedPosts((prevPosts) => {
        const updatedPosts = prevPosts.map((post) => {
          return post.post_id === fetchPost.post_id ? fetchPost : post;
        });
        console.log(updatedPosts);
        return updatedPosts;
      });
    };
    fetchingPost();
  }, [lastCommentedPostId]);

  // useEffect(() => {
  //   const fetchPost = async (postId) => {
  //     const fetchedPost = await fetchSinglePost(postId);
  //     setDisplayedPosts((prevPosts) => {
  //       // Check if the post already exists in the state
  //       const postExists = prevPosts.some(
  //         (post) => post.post_id === fetchedPost.post_id
  //       );
  //       console.log("useEffect", postExists, postId);
  //       if (postExists) {
  //         // If the post exists, update it
  //         return prevPosts.map((post) =>
  //           post.post_id === fetchedPost.post_id ? fetchedPost : post
  //         );
  //       } else {
  //         // If the post doesn't exist, add it
  //         return [...prevPosts, fetchedPost];
  //       }
  //     });
  //   };
  //   console.log("useEffect1", lastPublishedPostId);
  //   console.log("useEffect2", lastCommentedPostId);
  //   console.log("useEffect3", lastLikedPostId);
  //   if (lastPublishedPostId) {
  //     // A post was published
  //     fetchPost(lastPublishedPostId);
  //   }
  //   if (lastCommentedPostId) {
  //     // A comment was posted
  //     fetchPost(lastCommentedPostId);
  //   }
  //   if (lastLikedPostId) {
  //     fetchPost(lastLikedPostId);
  //   }
  // }, [
  //   lastPublishedPostId,
  //   lastCommentedPostId,
  //   lastLikedPostId,
  //   fetchSinglePost,
  // ]);

  const publishAndFetch = () => {
    setRefresh((prev) => !prev);
  };
  return (
    <div>
      <Box display="flex" flexDirection="column" alignItems="center">
        {/* <Poster onPublish={publishAndFetch} /> */}
        {displayedPosts
          .map((post) => (
            <Post
              key={post.post_id}
              post_id={post.post_id}
              content={post.content}
              author={post.author}
              image={post.image}
              timePublished={post.createdAt}
              comments={post.comments}
            />
          ))
          .reverse()}
      </Box>
    </div>
  );
};

export default MainPosts;
