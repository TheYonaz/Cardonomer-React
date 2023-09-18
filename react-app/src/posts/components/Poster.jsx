import { Button, Container, TextField, Box } from "@mui/material";
import React, { useState } from "react";
import useHandlePosts from "../../posts/hooks/useHandlePosts";
import { useUser } from "../../users/providers/UserProvider";

const Poster = ({ handleSubmit, onPostPublished }) => {
  const [content, setContent] = useState("");
  const { user } = useUser();
  const onSubmit = async () => {
    const post = await handleSubmit({ content, user_id: user._id });
    setContent("");
    onPostPublished();
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "20px" }}>
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: "5px",
          p: 2,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <TextField
          multiline
          fullWidth
          rows={4}
          variant="outlined"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "10px" }}
          onClick={onSubmit}
          disabled={content.trim() === ""}
        >
          Publish
        </Button>
      </Box>
    </Container>
  );
};

export default Poster;
