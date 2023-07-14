const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  author: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  content: String,
});

const postSchema = new mongoose.Schema({
  author: String,
  user_id: { type: mongoose.Schema.Types.ObjectId },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  content: String,
  likes: [{ user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" } }],
  comments: [commentSchema],
});

module.exports = mongoose.model("Post", postSchema);
