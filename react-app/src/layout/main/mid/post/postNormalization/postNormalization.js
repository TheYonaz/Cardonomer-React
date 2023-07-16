export const normalizePostData = (postsData) => {
    const isNormalized = (post) => 'post_id' in post;
    const normalizedPosts = postsData.flat().map((post) => (
        isNormalized(post) 
          ? post 
          : {
              post_id: post._id,
              content: post.content,
              author: `${post.user_id.name.first} ${post.user_id.name.last}`,
              image: post.user_id.image.url,
              createdAt: new Date(post.createdAt).toLocaleTimeString(),
            }
      ));
    
      const postsMap = new Map(normalizedPosts.map((post) => [post.post_id, post]));
      return Array.from(postsMap.values());
    };