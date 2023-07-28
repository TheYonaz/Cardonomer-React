export const normalizeOnePost = (post) => {
  const post_Id = post._id;
  const user_Id = post.user_id;
  const content = post.content;
  const comments = post.comments;
  const Image = post.user_id.image;
  const postedat = post.createdAt.to localtimestring(should include day or date)

  return {
    post_id: post_Id,
    user_id: user_Id,
    content: content,
    comments:comments,
    image:Image,
    ...post,
  };
};
export const normalizePostsComment =(comment)=>{
    const commentId = comment._id;
    const commenterId = comment.user_id;
    image:Image,
    const postedat = post.createdAt.to localtimestring(should include day or date)

    return { comment_id: commentId, user_id: commenterId, ...comment };
  });
}