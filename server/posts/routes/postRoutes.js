const express = require("express");
const router = express.Router();
const auth = require("../../auth/authService");
const {
  publishPost,
  getPostsOfFriends,
  addCommentToPost,
  getPost,
  likePost,
  getUserPosts,
} = require("../postContoller");
router.post("/post", auth, publishPost); //need auth when finish
router.get("/post/", auth, getPostsOfFriends);
router.put("/like/:postId", auth, likePost);
router.put("/post/comment/:postId", auth, addCommentToPost);
router.get("/post/:postId", auth, getPost);
router.get("/userPosts/:userId", auth, getUserPosts);
module.exports = router;
