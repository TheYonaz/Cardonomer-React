// const modelUserToServer = (rawUser) => {
//   const name = {
//     first: rawUser.first,
//     last: rawUser.last,
//     middle: rawUser.middle || "",
//   };

//   const image = {
//     url:
//       rawUser.url ||
//       "https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png",
//     alt: rawUser.alt || "User image",
//   };

//   const address = {
//     country: rawUser.country,
//     city: rawUser.city,
//     state: rawUser.state || "not defined",
//     street: rawUser.street,
//     houseNumber: rawUser.houseNumber,
//     zip: rawUser.zip,
//   };

//   const user = {
//     ...rawUser,
//     name,
//     image,
//     address,
//   };

//   return user;
// };

// module.exports = modelUserToServer;

const modelUserToServer = (rawUser) => {
  const {
    first,
    middle,
    last,
    url,
    alt,
    country,
    city,
    state,
    street,
    houseNumber,
    zip,
    ...rest
  } = rawUser;

  const name = {
    first,
    last,
    middle: middle || "",
  };

  const image = {
    url:
      url ||
      "https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png",
    alt: alt || "User image",
  };

  const address = {
    country,
    city,
    state: state || "not defined",
    street,
    houseNumber,
    zip,
  };

  return {
    ...rest,
    name,
    image,
    address,
  };
};

module.exports = modelUserToServer;
