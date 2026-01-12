const { generateUserPassword } = require("./bcrypt");
const generateBizNumber = require("./generateBizNumber");

const normalizeUser = async (rawUser) => {
  const name = {
    first: rawUser.name?.first || "",
    middle: rawUser.name?.middle || "",
    last: rawUser.name?.last || "",
  };
  const image = {
    url:
      rawUser.image?.url ||
      "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
    alt: rawUser.image?.alt || "User image",
  };
  const address = {
    state: rawUser.address?.state || "",
    country: rawUser.address?.country || "N/A",
    city: rawUser.address?.city || "N/A",
    street: rawUser.address?.street || "N/A",
    houseNumber: rawUser.address?.houseNumber || 0,
    zip: rawUser.address?.zip || 0,
  };
  const phone = rawUser.phone || "000-0000000";
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
    phone,
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
