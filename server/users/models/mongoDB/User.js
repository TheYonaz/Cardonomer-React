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
  url: {
    type: String,
    required: false,
    match: RegExp(URL_REGEX),
    trim: true,
  },
  alt: {
    type: String,
    trim: true,
    maxLength: 256,
    lowercase: true,
    required: false,
  },
});

const addressSchema = new mongoose.Schema({
  state: {
    type: String,
    trim: true,
    maxLength: 256,
    lowercase: true,
    required: false,
  },
  country: {
    type: String,
    trim: true,
    maxLength: 256,
    lowercase: true,
    required: false,
  },
  city: {
    type: String,
    trim: true,
    maxLength: 256,
    lowercase: true,
    required: false,
  },
  street: {
    type: String,
    trim: true,
    maxLength: 256,
    lowercase: true,
    required: false,
  },
  houseNumber: {
    type: Number,
    minLength: 1,
    required: false,
  },
  zip: {
    type: Number,
    minLength: 4,
    required: false,
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
const card = new mongoose.Schema({
  _id: {
    // if you want it clearer normalize the _id to appear as card_id but it might cuase dupliaction of id in the db
    type: mongoose.Schema.Types.ObjectId,
    ref: "pokemonCard",
  },
});
const deckSchema = new mongoose.Schema({
  deckName: {
    type: String,
    required: true,
    trim: true,
  },
  cards: {
    type: [card],
    default: [],
  },
});
const userSchema = new mongoose.Schema({
  name: nameSchema,
  phone: {
    type: String,
    required: false,
    match: RegExp(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/),
    trim: true,
  },
  email: regexType(
    /^([a-zA-Z0-9._-]+)@([a-zA-Z0-9_-]+)\.([a-zA-Z]{2,5})$/,
    true,
    true
  ),
  password: regexType(PASSWORD_REGEX),
  image: {
    type: imageSchema,
    required: false,
  },
  address: {
    type: addressSchema,
    required: false,
  },
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
  pokemonDecks: {
    type: [deckSchema],
    default: [],
  },
  yugiohDecks: {
    type: [deckSchema],
    default: [],
  },
  publishedPosts: {
    type: [postSchema],
    default: [],
  },
  friends: {
    type: [
      {
        user_id: RefUserId,
        name: nameSchema,
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
  cart: {
    type: [
      {
        item_id: card,
      },
    ],
    default: [],
  },
  prizes: { type: [String], default: [] },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
    unique: true,
    sparse: true,
  },
  emailVerificationExpires: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
    unique: true,
    sparse: true,
  },
  passwordResetExpires: {
    type: Date,
  },
  lastPasswordResetRequest: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  suspendedAt: {
    type: Date,
  },
  suspendedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  suspendedReason: {
    type: String,
  },
});
const User = mongoose.model("User", userSchema);

module.exports = User;
