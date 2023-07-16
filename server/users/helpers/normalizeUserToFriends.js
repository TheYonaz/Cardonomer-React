const normalizeUserToFriends = (friend) => {
  const plainFriend = friend.toObject();
  const user_id = plainFriend._id;
  const name = { ...plainFriend.name, middle: plainFriend.name.middle || "" };
  const image = {
    ...plainFriend.image,
    url:
      plainFriend.image.url ||
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
    alt: plainFriend.image.alt || "User image",
  };
  const email = plainFriend.email;
  const user = {
    user_id,
    name,
    image,
    email,
  };
  return user;
};
module.exports = normalizeUserToFriends;
