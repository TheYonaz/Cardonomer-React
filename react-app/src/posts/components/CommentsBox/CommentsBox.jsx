import React from "react";
import List from "@mui/material/List";
import Comment from "./Comment";

const CommentsBox = ({ comments }) => {
  return (
    <List>
      {comments.map((comment, index) => (
        <Comment comment={comment} key={index} />
      ))}
    </List>
  );
};

export default CommentsBox;
