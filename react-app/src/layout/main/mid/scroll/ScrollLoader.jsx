import React, { useState, useEffect, useCallback } from "react";

const useScrollLoader = (
  allPosts,
  displayedPosts,
  setDisplayedPosts,
  postIndex,
  setPostIndex,
  isLoadingMore,
  setIsLoadingMore
) => {
  const loadMorePosts = useCallback(() => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    const morePosts = allPosts.slice(postIndex, postIndex + 5);
    setDisplayedPosts((prevPosts) => [...prevPosts, ...morePosts]);
    setPostIndex((prevIndex) => prevIndex + 5);

    setIsLoadingMore(false);
  }, [
    postIndex,
    allPosts,
    setDisplayedPosts,
    setPostIndex,
    isLoadingMore,
    setIsLoadingMore,
  ]);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = 100; // pixels from the bottom
      if (
        window.innerHeight + document.documentElement.scrollTop <
        document.documentElement.offsetHeight - threshold
      )
        return;
      loadMorePosts();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMorePosts]);

  return displayedPosts;
};
export default useScrollLoader;
