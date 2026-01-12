const normalizeUser = (user) => {
  return {
    _id: user._id,
    name: {
      first: user.first,
      middle: "",
      last: user.last,
    },
    phone: "000-0000000",
    email: user.email,
    password: user.password,
    image: {
      url: "https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_960_720.png",
      alt: "User image",
    },
    address: {
      state: "",
      country: "N/A",
      city: "N/A",
      street: "N/A",
      zip: 0,
      houseNumber: 0,
    },
    isBusiness: false,
  };
};
export default normalizeUser;
