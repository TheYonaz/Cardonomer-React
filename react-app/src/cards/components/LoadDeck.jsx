import { Box, Button, IconButton, Container } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import React from "react";
// import { scrollbarStyles } from "../../styles/styles";
import { useState } from "react";
import Dialogs from "../../utils/Dialogs";

const LoadDeck = ({ decksFromDb, handleLoadDecks, handleDeleteDeck }) => {
  const [isOpen, setOpen] = useState(false);
  const [selectedDeckID, setSelectedDeckID] = useState(null);

  const handleOpenDialog = (deckID) => {
    setSelectedDeckID(deckID);
    setOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedDeckID) {
      await handleDeleteDeck(selectedDeckID);
      setOpen(false);
      setSelectedDeckID(null);
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        overflowY: "scroll",
        maxHeight: "20vh",
        backgroundColor: "white",
      }}
    >
      {" "}
      <Dialogs
        isDialogOpen={isOpen}
        onCancel={() => setOpen(false)}
        onConfirm={handleConfirmDelete}
        dialogDescription={"Are you sure you want to delete this Deck?"}
      />
      {decksFromDb[0] &&
        decksFromDb.map((deckDb, index) => {
          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginInline: 1,
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleLoadDecks(deckDb.cards)}
              >
                {deckDb.deckName}
              </Button>
              <IconButton
                size="small"
                onClick={() => handleOpenDialog(deckDb._id)}
                sx={{
                  marginLeft: 1,
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </Box>
          );
        })}
    </Container>
  );
};

export default LoadDeck;
