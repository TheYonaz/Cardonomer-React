import { useCallback, useEffect } from "react";

const useScrollLoader = (
  allPosts,
  displayedPosts,
  setDisplayedPosts,
  postIndex,
  setPostIndex
) => {
  // Function to load more posts
  const loadMorePosts = useCallback(() => {
    const morePosts = allPosts.slice(postIndex, postIndex + 5); // Get next 5 posts
    setDisplayedPosts((prevPosts) => [...prevPosts, ...morePosts]); // Add the new posts to the existing ones
    setPostIndex((prevIndex) => prevIndex + 5); // Update the last post index
  }, [postIndex, allPosts, setDisplayedPosts, setPostIndex]); // add postIndex to dependencies array

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
  }, [loadMorePosts]); // Now loadMorePosts is stable and won't change on every render
};

export default useScrollLoader;
