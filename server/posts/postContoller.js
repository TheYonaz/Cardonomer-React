const normalizePost = require("./helpers/normalizePost");
const Post = require("./mongoose/Post");
const User = require("../users/models/mongoDB/User");
const { handleError } = require("../utils/errorHandling");

const publishPost = async (req, res) => {
  let post = req.body;
  const _id = req.user._id;
  try {
    const userName = await User.findById(_id, { name: 1 }).lean();
    post.publisher_name = userName.name;
    const postToDB = new Post(post);
    let postFromDB = await postToDB.save();
    postFromDB = await Post.findById({ _id: postFromDB._id })
      .populate("user_id", "image")
      .lean();
    const normalizedPost = normalizePost(postFromDB);
    let user = await User.findById(_id);
    user.publishedPosts.push(postFromDB._id);
    user = await user.save();
    res.send(postFromDB);
  } catch (error) {
    handleError(res, 500, "An error occurred while publishing the post.");
  }
};

const addCommentToPost = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const { _id, image, name } = req.user;
  const comment = {
    user_id: _id,
    content: content,
    image: image,
    name: {
      first: name.first,
      middle: name.middle || "",
      last: name.last,
    },
  };
  try {
    let post = await Post.findById(postId);
    if (!post) throw new Error("Could not find this post in the database");
    post.comments.push(comment);
    post = await post.save();
    res.send(post);
  } catch (error) {
    handleError(res, 500, "An error occurred while adding comment to post.");
  }
};
const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { _id } = req.user;
    const user_id = _id.toString();
    let post = await Post.findById(postId);
    if (!post) throw new Error("Could not find this post in the database");
    const postLiked = post.likes.find(
      (like) => like.user_id.toString() === user_id
    );
    let user = await User.findById(_id);
    if (!postLiked) {
      post.likes.push({ user_id: _id });
      user.likedPosts.push(postId);
    } else {
      const filteredLikes = post.likes.filter(
        (like) => like.user_id.toString() !== user_id
      );
      post.likes = filteredLikes;
      // Remove the postId from user's likedPosts
      user.likedPosts = user.likedPosts.filter(
        (id) => id.toString() !== postId
      );
    }
    user.save();
    const postFromDB = await post.save();
    res.send(postFromDB);
  } catch (error) {
    console.error("likePost error:", error.message);
    handleError(res, 500, "An error occurred while liking the post.");
  }
};

const getPostsOfFriends = async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findById({ _id: _id });
    if (!user) throw new Error("User not found in the database");
    const friendsIds = user.friends.map((friend) => friend.user_id.toString());
    friendsIds.push(_id);
    const posts = await Post.find({ user_id: { $in: friendsIds } })
      .populate("user_id", "image")
      .lean();
    res.send(posts);
  } catch (error) {
    console.error("getPostsOfFriends error:", error.message);
    handleError(res, 500, "An error occurred while retrieving posts.");
  }
};

const getPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId)
      .populate("user_id", "image")
      .lean();
    if (!post) throw new Error("Could not find this post in the database");
    res.send(post);
  } catch (error) {
    console.error("getPost error:", error.message);
    handleError(res, 500, "An error occurred while getting post.");
  }
};

const getUserPosts = async (req, res) => {
  const { isAdmin, _id } = req.user;
  const { userId } = req.params;
  try {
    const posts = await Post.find({ user_id: userId })
      .populate("user_id", "image")
      .lean();
    res.send(posts || []);
  } catch (error) {
    handleError(res, 500, "An error occurred while getting post.");
  }
};

const deletePost = async (req, res) => {
  const { postId, userId } = req.params;
  const { isAdmin, _id } = req.user;
  try {
    if (userId !== _id && !isAdmin)
      throw new Error("You do not have permission to delete this post");
    const post = await Post.findByIdAndDelete(postId);
    if (!post) throw new Error("Could not find this post in the database");
    res.send("success");
  } catch (error) {
    console.error("deletePost error:", error.message);
    handleError(res, 500, "An error occurred while deleting the post.");
  }
};

module.exports = {
  getPostsOfFriends,
  publishPost,
  addCommentToPost,
  getPost,
  likePost,
  getUserPosts,
  deletePost,
};
