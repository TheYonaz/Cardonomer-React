const normalizePost = (post) => {
  const post_id = post._id;
  const user_id = post.user_id._id;
  const name = { ...post.user_id.name, middle: post.user_id.name.middle || "" };
  const publisher_image = {
    ...post.user_id.image,
    url:
      post.user_id.image.url ||
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
    alt: post.user_id.image.alt || "User image",
  };
  const content = post.content;
  const likes = post.likes;
  const comments = post.comments;
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
