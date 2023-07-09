import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import Post from "./post/Post";
const allPosts = [
  {
    id: 1,
    title: "First Post",
    content: "This is the first post.",
    author: "John Doe",
    image:
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
  },
  {
    id: 2,
    title: "Second Post",
    content: "This is the second post.",
    author: "Jane Doe",
    image:
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
  },
  {
    id: 3,
    title: "Third Post",
    content: "This is the third post.",
    author: "Jim Doe",
    image:
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
  },
  {
    id: 4,
    title: "Fourth Post",
    content: "This is the fourth post.",
    author: "Jack Doe",
    image:
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
  },
  {
    id: 5,
    title: "Fifth Post",
    content: "This is the fifth post.",
    author: "Jessica Doe",
    image:
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
  },
  {
    id: 6,
    title: "Sixth Post",
    content: "This is the sixth post.",
    author: "Jasmine Doe",
    image:
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
  },
  {
    id: 7,
    title: "Seventh Post",
    content: "This is the seventh post.",
    author: "Jake Doe",
    image:
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
  },
  {
    id: 8,
    title: "Eighth Post",
    content: "This is the eighth post.",
    author: "Jenny Doe",
    image:
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
  },
  {
    id: 9,
    title: "Ninth Post",
    content: "This is the ninth post.",
    author: "Joel Doe",
    image:
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
  },
  {
    id: 10,
    title: "Tenth Post",
    content: "This is the tenth post.",
    author: "Jeff Doe",
    image:
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
  },
  {
    id: 11,
    title: "Eleventh Post",
    content: "This is the eleventh post.",
    author: "Jerry Doe",
    image:
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
  },
  {
    id: 12,
    title: "Twelfth Post",
    content: "This is the twelfth post.",
    author: "Jill Doe",
    image:
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
  },
  {
    id: 13,
    title: "Thirteenth Post",
    content: "This is the thirteenth post.",
    author: "Janet Doe",
    image:
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
  },
  {
    id: 14,
    title: "Fourteenth Post",
    content: "This is the fourteenth post.",
    author: "Jeremy Doe",
    image:
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
  },
  {
    id: 15,
    title: "Fifteenth Post",
    content: "This is the fifteenth post.",
    author: "Jordan Doe",
    image:
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
  },
  {
    id: 16,
    title: "Sixteenth Post",
    content: "This is the sixteenth post.",
    author: "Julia Doe",
    image:
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
  },
  {
    id: 17,
    title: "Seventeenth Post",
    content: "This is the seventeenth post.",
    author: "Jude Doe",
    image:
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
  },
  {
    id: 18,
    title: "Eighteenth Post",
    content: "This is the eighteenth post.",
    author: "Jade Doe",
    image:
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
  },
  {
    id: 19,
    title: "Nineteenth Post",
    content: "This is the nineteenth post.",
    author: "Joyce Doe",
    image:
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
  },
  {
    id: 20,
    title: "Twentieth Post",
    content: "This is the twentieth post.",
    author: "Joe Doe",
    image:
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
  },
  {
    id: 21,
    title: "Twenty-first Post",
    content: "This is the twenty-first post.",
    author: "Jenna Doe",
    image:
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
  },
  {
    id: 22,
    title: "Twenty-second Post",
    content: "This is the twenty-second post.",
    author: "Justin Doe",
    image:
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
  },
  {
    id: 23,
    title: "Twenty-third Post",
    content: "This is the twenty-third post.",
    author: "Josh Doe",
    image:
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
  },
];
const MainPosts = () => {
  const [displayedPosts, setDisplayedPosts] = useState(allPosts.slice(0, 5));
  const [postIndex, setPostIndex] = useState(5); // Keep track of the last post index

  // Function to load more posts
  const loadMorePosts = () => {
    const morePosts = allPosts.slice(postIndex, postIndex + 5); // Get next 10 posts
    setDisplayedPosts((prevPosts) => [...prevPosts, ...morePosts]); // Add the new posts to the existing ones
    setPostIndex((prevIndex) => prevIndex + 5); // Update the last post index
  };

  // Handle the scroll event
  useEffect(() => {
    const handleScroll = () => {
      // Load more posts if we're near the bottom of the page
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      )
        return;
      loadMorePosts();
    };

    // Attach the scroll event handler
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener when the component unmounts
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMorePosts]); // Empty dependencies array means this effect runs once on mount and cleanup on unmount

  return (
    <div>
      <Box display="flex" flexDirection="column" alignItems="center">
        {displayedPosts.map((post) => (
          <Post
            key={post.id}
            title={post.title}
            content={post.content}
            author={post.author}
            image={post.image}
          />
        ))}
      </Box>
    </div>
  );
};

export default MainPosts;
