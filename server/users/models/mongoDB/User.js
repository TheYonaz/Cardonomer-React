const mongoose = require("mongoose");
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/;
const URL_REGEX =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

const DEFAULT_VALIDATION = {
  type: String,
  trim: true,
  minLength: 2,
  maxLength: 256,
  lowercase: true,
  required: true,
};
const RefUserId = {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
};

const regexType = (regex, required = true, unique = false) => {
  return {
    type: String,
    required,
    match: RegExp(regex),
    unique,
    trim: true,
  };
};

const imageSchema = new mongoose.Schema({
  url: regexType(URL_REGEX, false),
  alt: DEFAULT_VALIDATION,
});

const addressSchema = new mongoose.Schema({
  state: {
    type: String,
    trim: true,
    maxLength: 256,
    lowercase: true,
  },
  country: DEFAULT_VALIDATION,
  city: DEFAULT_VALIDATION,
  street: DEFAULT_VALIDATION,
  houseNumber: {
    type: Number,
    minLength: 1,
    required: true,
  },
  zip: {
    type: Number,
    minLength: 4,
  },
});

const nameSchema = new mongoose.Schema({
  first: DEFAULT_VALIDATION,
  middle: {
    type: String,
    trim: true,
    maxLength: 256,
    lowercase: true,
    required: false,
  },
  last: DEFAULT_VALIDATION,
});
const postSchema = new mongoose.Schema({
  author: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  content: String,
});
const cardSchema = new mongoose.Schema({
  card_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Card",
  },
});

const userSchema = new mongoose.Schema({
  name: nameSchema,
  phone: regexType(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/),
  email: regexType(
    /^([a-zA-Z0-9._-]+)@([a-zA-Z0-9_-]+)\.([a-zA-Z]{2,5})$/,
    true,
    true
  ),
  password: regexType(PASSWORD_REGEX),
  image: imageSchema,
  address: addressSchema,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isBusiness: {
    type: Boolean,
    default: false,
  },
  bizNumber: {
    type: Number,
    minLength: 7,
    maxLength: 7,
    required: function () {
      return this.isBusiness;
    },
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: [],
    },
  ],
  decks: [
    {
      cards: {
        type: [cardSchema],
        default: [],
      },
    },
  ],
  publishedPosts: {
    type: [postSchema],
    default: [],
  },
  friends: {
    type: [
      {
        user_id: RefUserId,
        name:nameSchema,
        image: imageSchema,
        email: regexType(
          /^([a-zA-Z0-9._-]+)@([a-zA-Z0-9_-]+)\.([a-zA-Z]{2,5})$/,
          true,
          true
        ),
        startOfFriendship: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
  friendRequestsSent: {
    type: [
      {
        user_id: RefUserId,
        image: imageSchema,
        date: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },

  friendRequests: {
    type: [
      {
        user_id: RefUserId,
        image: imageSchema,
        date: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
});
const User = mongoose.model("User", userSchema);

module.exports = User;
