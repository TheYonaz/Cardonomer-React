const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  name: { type: Object },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  commentedAt: {
    type: Date,
    default: Date.now,
  },
  content: { type: String, trim: true, minLength: 1, maxLength: 256 },
  image: { type: Object },
});
const nameSchema = new mongoose.Schema({
  first: {
    type: String,
    trim: true,
    maxLength: 256,
    lowercase: true,
    required: true,
  },
  middle: {
    type: String,
    trim: true,
    maxLength: 256,
    lowercase: true,
    required: false,
  },
  last: {
    type: String,
    trim: true,
    maxLength: 256,
    lowercase: true,
    required: true,
  },
});
const postSchema = new mongoose.Schema({
  name: nameSchema,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  publisher_name: nameSchema,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  content: String,
  likes: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
  comments: [commentSchema],
});
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
