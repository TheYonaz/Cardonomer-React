export const normalizePostData = (postsData) => {
  const isNormalized = (post) => "post_id" in post;
  const normalizeComment = (comment) => ({
    comment_id: comment._id,
    user_id: comment.user_id,
    content: comment.content,
    image: comment.user_id.image,
    commentedAt: new Date(comment.commentedAt).toLocaleTimeString(),
  });
  const normalizedPosts = postsData.flat().map((post) =>
    isNormalized(post)
      ? post
      : {
          post_id: post._id,
          user_id: post.user_id._id,
          content: post.content,
          author: `${post.user_id.name.first} ${post.user_id.name.last}`,
          image: post.user_id.image.url,
          createdAt: new Date(post.createdAt).toLocaleTimeString(),
          comments: post.comments ? post.comments.map(normalizeComment) : [],
          likes: post.likes,
        }
  );

  const postsMap = new Map(normalizedPosts.map((post) => [post.post_id, post]));
  return Array.from(postsMap.values());
};
