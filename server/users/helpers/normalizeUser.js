const { generateUserPassword } = require("./bcrypt");
const generateBizNumber = require("./generateBizNumber");

const normalizeUser = async (rawUser) => {
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
  const bizNumber = rawUser.isBusiness
    ? rawUser.bizNumber || (await generateBizNumber())
    : null;
  const likedPosts = rawUser.likedPosts || [];
  const publishedPosts = rawUser.publishedPosts || [];
  const decks = rawUser.decks || [];
  const friends = rawUser.friends || [];
  const friendRequestsSent = rawUser.friendRequestsSent || [];
  const friendRequests = rawUser.friendRequests || [];
  const user = {
    ...rawUser,
    name,
    image,
    address,
    password: generateUserPassword(rawUser.password),
    bizNumber,
    likedPosts,
    decks,
    publishedPosts,
    friends,
    friendRequestsSent,
    friendRequests,
  };

  return user;
};

module.exports = normalizeUser;
