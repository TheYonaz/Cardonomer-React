import { Button, Container, TextField, Box } from "@mui/material";
import React, { useState } from "react";
import { useUser } from "../../users/providers/UserProvider";

const Poster = ({ handleSubmit, onPostPublished }) => {
  const [content, setContent] = useState("");
  const { user } = useUser();
  const onSubmit = async () => {
    await handleSubmit({ content, user_id: user._id });
    setContent("");
    onPostPublished();
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: "12px", px: 0 }}>
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 3,
          p: 3,
          boxShadow: "0 12px 26px rgba(0,0,0,0.12)",
          border: "1px solid rgba(208, 180, 138, 0.6)",
          minHeight: 220,
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.96) 0%, rgba(250,240,217,0.96) 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            gap: 1,
            color: "#9a6b2f",
            fontWeight: 700,
            letterSpacing: 0.3,
          }}
        >
          ✍️ Share your pull or story
        </Box>
        <TextField
          multiline
          fullWidth
          rows={4}
          variant="outlined"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          aria-label="Post content"
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "rgba(255,255,255,0.92)",
              borderRadius: 2,
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{
            marginTop: 2,
            borderRadius: 2,
            background: "linear-gradient(90deg, #c47f3d 0%, #a85a22 100%)",
            boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
            "&:hover": {
              background: "linear-gradient(90deg, #b56f2f 0%, #954e1c 100%)",
            },
            textTransform: "uppercase",
            letterSpacing: 0.6,
          }}
          onClick={onSubmit}
          disabled={content.trim() === ""}
          aria-label="Publish post"
        >
          Publish
        </Button>
      </Box>
    </Container>
  );
};

export default React.memo(Poster);
