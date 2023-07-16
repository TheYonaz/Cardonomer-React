import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Avatar,
  Box,
} from "@mui/material";

const Post = ({ timePublished, content, author, image }) => (
  <Card
    sx={{
      marginBlock: "20px",
      width: { md: "45vw", sm: "70vw", xs: "99vw" },
    }}
  >
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
      <Avatar src={image} alt={author} style={{ marginRight: '1rem' }} />
        <Typography variant="h6">{author}</Typography>
      </Box>
      <Box display="flex" alignItems="flex-start" flexDirection="column">
        <Typography variant="body2" color="text.secondary">
          {timePublished}
        </Typography>
        <Typography variant="body2">{content}</Typography>
      </Box>
    </CardContent>
    <CardActions>
      <Button size="small">Like</Button>
      <Button size="small">Comment</Button>
    </CardActions>
  </Card>
);

export default Post;
