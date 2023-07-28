const normalizeComment = require("./normalizeComment");
const normalizePost = (post) => {
  let COments = post.comments ? [...post.comments] : []; // Copy comments array

  if (COments.length > 0) {
    // Check if there are comments
    let latestComment = COments.pop(); // Remove the last comment
    COments.push(normalizeComment(latestComment)); // Push the normalized version back
  }
  const post_id = post._id;
  const user_id = post.user_id._id;
  const name = {
    ...post.name,
  };
  const publisher_image = {
    ...post.user_id.image,
    url:
      post.user_id.image?.url ||
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
    alt: post.user_id.image?.alt || "User image",
  };
  const content = post.content;
  const likes = post.likes ? [...post.likes] : [];
  const comments = COments;
  const normalizedpost = {
    post_id,
    user_id,
    name,
    content,
    publisher_image,
    likes,
    comments,
  };
  return normalizedpost;
};
module.exports = normalizePost;
