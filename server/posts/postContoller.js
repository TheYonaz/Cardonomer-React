const normalizePost = require("./helpers/normalizePost");
const Post = require("./mongoose/Post");
const User = require("../users/models/mongoDB/User");
const normalizeComment = require("./helpers/normalizeComment");
const { handleError } = require("../utils/errorHandling");

const publishPost = async (req, res) => {
  let post = req.body;
  console.log("publishPost", post);
  const _id = req.user._id;
  try {
    const userName = await User.findById(_id, { name: 1 }).lean();
    console.log(userName.name);
    post.publisher_name = userName.name;
    const postToDB = new Post(post);
    console.log("fromPublishPost1", postToDB);
    let postFromDB = await postToDB.save();
    postFromDB = await Post.findById({ _id: postFromDB._id })
      .populate("user_id", "image")
      .lean();
    console.log("fromPublishPost2", postFromDB);
    const normalizedPost = normalizePost(postFromDB);
    console.log("fromPublishPost3", normalizedPost);
    let user = await User.findById(_id);
    user.publishedPosts.push(postFromDB._id);
    user = await user.save();
    res.send(postFromDB);
  } catch (error) {
    console.log("post error", error.message);
    handleError(res, 500, "An error occurred while publishing the post.");
  }
};
const addCommentToPost = async (req, res) => {
  const { postId } = req.params; // get post id from request parameters
  const { content } = req.body; // get content from request body
  const { _id, image, name } = req.user; // get user id from req.user
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
  console.log("addCommentToPost1", postId[0]);
  try {
    // Find post by ID and push new comment
    let post = await Post.findById(postId);
    console.log("addCommentToPost1", post);
    if (!post) throw new Error("Could not find this post in the database");
    post.comments.push(comment);
    // Save the post back to the database
    post = await post.save();

    console.log("addCommentToPost2", post);
    res.send(post);
  } catch (error) {
    console.log("addComment error", error.message);
    handleError(res, 500, "An error occurred while adding comment to post.");
  }
};
const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { _id } = req.user;
    const user_id = _id.toString(); // Convert to string
    console.log("likePost", user_id);
    let post = await Post.findById(postId);
    if (!post) throw new Error("Could not find this post in the database");
    const postLiked = post.likes.find(
      (like) => like.user_id.toString() === user_id
    ); // Convert to string
    console.log(1);
    if (!postLiked) {
      console.log(2, postLiked);
      post.likes.push({ user_id: _id });
    } else {
      console.log(3);
      const filteredLikes = post.likes.filter(
        (like) => like.user_id.toString() !== user_id
      ); // Convert to string
      post.likes = filteredLikes;
    }
    console.log(4);
    const postFromDB = await post.save();
    res.send(postFromDB);
  } catch (error) {
    console.error("likePost error", error.message);
    handleError(res, 500, "An error occurred while liking the post.");
  }
};

const getPostsOfFriends = async (req, res) => {
  const { _id } = req.user; // User ID from request
  // console.log(_id);
  try {
    // Find the user
    const user = await User.findById({ _id: _id });
    if (!user) throw new Error("User not found in the database");
    // console.log("getPostsOfFriends", user);

    // User's friends IDs including the user himself/herself
    const friendsIds = user.friends.map((friend) => friend.user_id.toString());
    friendsIds.push(_id);

    // Find all posts by user and his/her friends
    const posts = await Post.find({ user_id: { $in: friendsIds } })
      .populate("user_id", "image")
      .lean();

    // console.log("getPostsOfFriends", posts);
    // Send the posts
    res.send(posts);
  } catch (error) {
    console.error("getPostsOfFriends error", error.message);
    handleError(res, 500, "An error occurred while retrieving posts.");
  }
};
const getPost = async (req, res) => {
  const { postId } = req.params; // get post id from request parameters
  try {
    const post = await Post.findById(postId)
      .populate("user_id", "image")
      .lean();
    if (!post) throw new Error("Could not find this post in the database");
    res.send(post);
  } catch (error) {
    console.error("get Post error:", error.message);
    handleError(res, 500, "An error occurred while getting post.");
  }
};
const getUserPosts = async (req, res) => {
  const { isAdmin, _id } = req.user;
  const { userId } = req.params;

  console.log("getUserPosts1", {
    isAdmin: isAdmin,
    _id: _id,
    userId: userId,
  });

  if (isAdmin) {
    try {
      const posts = await Post.find({ user_id: userId })
        .populate("user_id", "image")
        .lean();
      if (!posts || posts.length === 0) {
        throw new Error("Could not find the specified posts in the database");
      }
      console.log("getUserPosts2", posts);
      res.send(posts);
    } catch (error) {
      console.error("get Post error:", error.message);
      handleError(res, 500, "An error occurred while getting post.");
    }
  } else {
    return handleError(
      res,
      403,
      "You do not have permission to access these posts."
    );
  }
};

module.exports = {
  getPostsOfFriends,
  publishPost,
  addCommentToPost,
  getPost,
  likePost,
  getUserPosts,
};
