const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  // author: String,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  content: String,
});

const postSchema = new mongoose.Schema({
  // author: String,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
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
