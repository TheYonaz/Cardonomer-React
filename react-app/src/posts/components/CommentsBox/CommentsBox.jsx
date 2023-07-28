import React from "react";
import List from "@mui/material/List";
import Comment from "./Comment"; // import the Comment component

const CommentsBox = ({ comments }) => {
  console.log("commentsBox", comments);
  return (
    <List>
      {comments.map((comment, index) => (
        <Comment comment={comment} key={index} /> // use the Comment component
      ))}
    </List>
  );
};

export default CommentsBox;
