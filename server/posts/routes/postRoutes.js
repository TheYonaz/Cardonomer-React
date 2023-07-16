const express = require("express");
const router = express.Router();
const auth = require("../../auth/authService");
const {
  publishPost,
  getPostsOfFriends,
  addCommentToPost,
  getPost,
} = require("../postContoller");
router.post("/post", publishPost); //need auth when finish
router.get("/post/", auth, getPostsOfFriends);
router.put("/post/:postId", auth, addCommentToPost);
router.get("/post/:postId", getPost);
module.exports = router;
