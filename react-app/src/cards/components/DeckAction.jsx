import React from "react";
import { Button, Box, TextField } from "@mui/material";
import { useUser } from "../../users/providers/UserProvider";
import { useCart } from "../../users/providers/CartProvider";

const DeckAction = ({
  onSave,
  onClear,
  setDeckName,
  deckname,
  handleInputChange,
  validateForm,
  value,
  deck,
}) => {
  const { user } = useUser();
  const { handleAddAllToCart } = useCart();
  return (
    <>
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          padding={2}
          bgcolor="beige"
        >
          <Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleAddAllToCart(deck, user._id)}
              sx={{ marginInline: 1 }}
              disabled={deck.length ? false : true}
            >
              Add to Cart
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={onClear}
              disabled={deck.length ? false : true}
            >
              Clear All
            </Button>
          </Box>
          <Box>
            <TextField
              name="deckName"
              value={deckname}
              placeholder="Deck name"
              variant="outlined"
              size="small"
              style={{ marginRight: "10px" }}
              onChange={(e) => {
                setDeckName(e.target.value);
                handleInputChange(e); // Assuming this function can handle the event object
              }}
              errors={value.errors}
              error={value.errors.deckName ? true : false}
              helperText={
                value.errors?.deckName && value.errors.deckName.message
              }
            />
            <Button
              variant="contained"
              color="primary"
              onClick={onSave}
              disabled={!!!validateForm() && deck.length ? false : true}
            >
              Save Deck
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default DeckAction;
