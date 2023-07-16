const normalizePost = require("./helpers/normalizePost");
const Post = require("./mongoose/Post");
const User = require("../users/models/mongoDB/User");

const publishPost = async (req, res) => {
  const post = req.body;
  // console.log(post);
  try {
    const postToDB = new Post(post);
    // console.log("fromPublishPost1", postToDB);
    let postFromDB = await postToDB.save();
    // console.log("fromPublishPost2", postFromDB);
    postFromDB = await Post.findById({_id: postFromDB._id})
    .populate("user_id")
    .lean();
    const normalizedPost = normalizePost(postFromDB);
    // console.log("fromPublishPost3", normalizedPost);
    res.send(normalizedPost);
  } catch (error) {
    console.log("post error", error.message);
  }
};
const addCommentToPost = async (req, res) => {
  const { postId } = req.params; // get post id from request parameters
  const { content } = req.body; // get content from request body
  const { _id, image } = req.user; // get user id from req.user
  const comment = {
    user_id: _id,
    content: content,
  };
  try {
    // Find post by ID and push new comment
    let post = await Post.findById(postId);
    if (!post) throw new Error("Could not find this post in the database");
    post.comments.push(comment);

    // Save the post back to the database
    post = await post.save();

    res.send(post);
  } catch (error) {
    console.log("addComment error", error.message);
    res.status(500).send("An error occurred while adding comment to post.");
  }
};
const getPostsOfFriends = async (req, res) => {
  const { _id } = req.user; // User ID from request
// console.log(_id);
  try {
    // Find the user
    const user = await User.findById({_id:_id});
    if (!user) throw new Error("User not found in the database");
    // console.log("getPostsOfFriends", user);

    // User's friends IDs including the user himself/herself
    const friendsIds = user.friends.map((friend) => friend.user_id.toString());
    friendsIds.push(_id);
    // console.log("getPostsOfFriends", friendsIds);

    // Find all posts by user and his/her friends
    const posts = await Post.find({ user_id: { $in: friendsIds } })
      .populate("user_id", "name image")
      .lean();
    // console.log("getPostsOfFriends", posts);

    // Send the posts
    res.send(posts);
  } catch (error) {
    console.error("getPostsOfFriends error", error.message);
    res.status(500).send("An error occurred while retrieving posts.");
  }
};
const getPost = async (req, res) => {
  const { postId } = req.params; // get post id from request parameters

  try {
    const post = await Post.findById(postId);
    if (!post) throw new Error("Could not find this post in the database");
    res.send(post);
  } catch (error) {
    console.error("get Post error:", error.message);
    res.status(500).send("An error occurred while getting post.");
  }
};

module.exports = { getPostsOfFriends, publishPost, addCommentToPost, getPost };
