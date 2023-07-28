export const normalizeComment = (comment) => {
  const commentid = comment._id;
  const userid = comment.user_id._id;
  const Name = {
    ...comment.user_id.name,
  };
  const Image = {
    ...comment.user_id.image,
    url:
      comment.user_id.image?.url ||
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
    alt: comment.user_id.image?.alt || `${Name}`,
  };
  const Content = comment.content;
  const commentedat = new Date(comment.commentedAt).toLocaleString();

  const normalizedcomment = {
    comment_id: commentid,
    user_id: userid,
    name: Name,
    content: Content,
    image: Image,
    commentedAt: commentedat,
  };
  return normalizedcomment;
};
module.exports = normalizeComment;
