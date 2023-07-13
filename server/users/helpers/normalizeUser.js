const { generateUserPassword } = require("./bcrypt");
const normalizeUser = (rawUser) => {
  const name = { ...rawUser.name, middle: rawUser.name.middle || "" };
  const image = {
    ...rawUser.image,
    url:
      rawUser.image.url ||
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
    alt: rawUser.image.alt || "User image",
  };
  const address = {
    ...rawUser.address,
    state: rawUser.address.state || "",
  };
  const likedPosts = rawUser.likedPosts || [];
  const decks = rawUser.decks || [];
  const publishedPosts = rawUser.publishedPosts || [];
  const user = {
    ...rawUser,
    name,
    image,
    address,
    password: generateUserPassword(rawUser.password),
    likedPosts,
    decks,
    publishedPosts,
  };

  return user;
};

module.exports = normalizeUser;
