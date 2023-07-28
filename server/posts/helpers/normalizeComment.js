const normalizeComment = (comment) => {
  const comment_id = comment._id;
  const user_id = comment.user_id._id;
  const name = {
    ...comment.user_id.name,
    middle: comment.user_id.name?.middle || "",
  };
  const image = {
    ...comment.user_id.image,
    url:
      comment.user_id.image.url ||
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
    alt: comment.user_id.image.alt || `${name}`,
  };
  const content = comment.content;

  const normalizedcomment = {
    comment_id,
    user_id,
    name,
    content,
    image,
  };
  return normalizedcomment;
};
module.exports = normalizeComment;
