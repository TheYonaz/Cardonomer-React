// export const normalizeData = (post) => {
//   // Rename _id to post_id
//   const postId = post._id;
//   delete post._id;

//   // Rename user_id._id to user_id
//   const userId = post.user_id._id;
//   delete post.user_id._id;

//   // Normalize comments
//   const comments = post.comments.map((comment) => {
//     // Rename _id to comment_id
//     const commentId = comment._id;
//     delete comment._id;

//     // Rename user_id to commenter_id
//     const commenterId = comment.user_id;
//     delete comment.user_id;

//     return { comment_id: commentId, commenter_id: commenterId, ...comment };
//   });

//   return { post_id: postId, user_id: userId, comments, ...post };
// };

export const normalizePostData = (data) => {
  // Extracting the image and _id from user_id
  const { image, _id } = data.user_id;

  // Returning the normalized data
  return {
    ...data, // Spread the rest of the data
    image: image, // Add the image key at the top level
    user_id: _id, // Set user_id to the _id from the nested user_id object
  };
};
