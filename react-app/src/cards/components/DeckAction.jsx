import React from "react";
import { Button, Box, TextField } from "@mui/material";

const DeckAction = ({
  onSave,
  onAddToCart,
  onClear,
  setDeckName,
  deckname,
}) => {
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        padding={2}
        bgcolor="yellow"
      >
        <Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={onAddToCart}
            sx={{ marginInline: 1 }}
          >
            Add to Cart
          </Button>
          <Button variant="contained" color="error" onClick={onClear}>
            Clear All
          </Button>
        </Box>
        <Box>
          <TextField
            value={deckname}
            onChange={(e) => setDeckName(e.target.value)}
            placeholder="Deck name"
            variant="outlined"
            size="small"
            style={{ marginRight: "10px" }}
          />
          <Button variant="contained" color="primary" onClick={onSave}>
            Save Deck
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default DeckAction;
