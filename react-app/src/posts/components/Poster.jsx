import { Button, Container, TextField, Box } from "@mui/material";
import React, { useState } from "react";
import useHandlePosts from "../../posts/hooks/useHandlePosts";
import { useUser } from "../../users/providers/UserProvider";

const Poster = ({ onPublish }) => {
  const [content, setcontent] = useState("");
  const { user } = useUser();
  const { handlePublish } = useHandlePosts();

  const handleSubmit = async () => {
    const post = await handlePublish({ content, user_id: user._id });
    setcontent("");
    onPublish(post);
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
          onChange={(e) => setcontent(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "10px" }}
          onClick={handleSubmit}
          disabled={content.trim() === ""}
        >
          Publish
        </Button>
      </Box>
    </Container>
  );
};

export default Poster;
