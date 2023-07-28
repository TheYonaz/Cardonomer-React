import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Box, height } from "@mui/system";

const Comment = ({ comment }) => {
  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        border: "1px solid lightgray",
        borderRadius: "5px",
        marginBottom: "10px",
        padding: "10px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <ListItemAvatar>
        <Avatar src={comment.image.url}></Avatar>
      </ListItemAvatar>
      <Box
        sx={{
          width: { xs: "100%", md: "75%" },
          height: { xs: "20px", md: "75%" },
          //   mb: { xs: "20px", md: "75%" },
        }}
      >
        <ListItemText
          primary={
            <Typography variant="subtitle1" fontWeight="bold">
              {`${comment.name.first} ${comment.name.last}`}
            </Typography>
          }
          secondary={
            <>
              <Typography component="span" variant="body2" color="textPrimary">
                {comment.content}
              </Typography>
              <Typography
                component="span"
                variant="caption"
                display="block"
                color="textSecondary"
              >
                {new Date(comment.commentedAt).toLocaleString()}
              </Typography>
            </>
          }
        />
      </Box>
    </ListItem>
  );
};

export default Comment;
