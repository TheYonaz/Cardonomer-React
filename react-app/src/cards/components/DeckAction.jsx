import React from "react";
import { Button, Box, TextField } from "@mui/material";
import { useDeck } from "../deckProvider/DeckProvider";

const DeckAction = ({
  onSave,
  onAddToCart,
  onClear,
  setDeckName,
  deckname,
  handleInputChange,
  validateForm,
  value,
  deck,
  decksFromDb,
  handleLoadDecks,
}) => {
  return (
    <>
      <Box>
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
            {/* {console.log(value.errors.deckName, value.errors.deckName.message)} */}
            <Button
              variant="contained"
              color="primary"
              onClick={onSave}
              disabled={!!!validateForm() && deck.length ? false : true}
            >
              Save Deck
            </Button>
          </Box>
          {/* 
          <Box>
            {decksFromDb.map((deckDb, index) => {
              return (
                <Button
                  key={index}
                  variant="contained"
                  color="secondary"
                  onClick={() => handleLoadDecks(deckDb.cards)}
                >
                  {/* {console.log(deckDb)} */}
          {/* {deckDb.deckName}
                </Button>
              );
            })}
          </Box> */}
        </Box>
      </Box>
    </>
  );
};

export default DeckAction;
