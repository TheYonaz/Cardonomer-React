import { Box, Button, Container, Drawer, Typography } from "@mui/material";
import React, { useState } from "react";
import Error from "../../layout/components/Error";
import Spinner from "../../layout/components/Spinner";
import Dialogs from "../../utils/Dialogs";
import Deck from "./Deck";
import PokemonCards from "./Pokemon/PokemonCards";
import Joi from "joi";
import useForm from "../../forms/hooks/useForm";
import { useDeck } from "../deckProvider/DeckProvider";

const CardFeedBack = ({
  isLoading,
  error,
  cards,
  fontSizeBreakpoints,
  maxHeightBreakpoints,
  saveDeck,
}) => {
  const [deck, setDeck] = useState([]);
  const [deckname, setDeckName] = useState("");
  const [isOpen, setDialog] = useState(false);
  const [isDeckOpen, setDeckOpen] = useState(false);

  const { decksFromDb, handleDeleteDeck, saveDeckData } = useDeck();
  const handleSaveDeck = () => {
    const deckToSave = { deckName: deckname, cards: deck };
    saveDeckData(deckToSave);
    setDeck([]);
    setDeckName("");
  };

  const { onSubmit, handleInputChange, validateForm, value } = useForm(
    { deckName: "" },
    {
      deckName: Joi.string().min(2).max(256).required(),
      cards: Joi.array().items(Joi.object()),
    },
    handleSaveDeck
  );

  const handleLoadDecks = (loadDeck) => {
    setDeck(loadDeck);
  };

  const handleClear = () => {
    setDeck([]);
    setDialog(false);
  };

  const handleClearButton = () => {
    setDialog((prev) => !prev);
  };

  if (isLoading) return <Spinner />;
  if (error) return <Error errorMessage={error} />;
  if (cards && cards.length)
    return (
      <Container
        maxWidth={false}
        disableGutters
        sx={{ px: { xs: 0, sm: 2 }, py: { xs: 1, sm: 2 } }}
      >
        {deck.length > 0 && (
          <Dialogs
            isDialogOpen={isOpen}
            onCancel={() => setDialog((prev) => !prev)}
            onConfirm={handleClear}
            dialogDescription={"Are you sure you want to clear Deck?"}
          />
        )}
        <PokemonCards
          pokemonCards={cards}
          fontSizeBreakpoints={fontSizeBreakpoints}
          maxHeightBreakpoints={maxHeightBreakpoints}
          onClick={(pokemonCard) => setDeck((prev) => [...prev, pokemonCard])}
        />
        <Box
          display="flex"
          justifyContent="center"
          my={2}
          sx={{
            position: "fixed",
            right: 16,
            bottom: 92, // above bottom nav
            zIndex: 1201,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => setDeckOpen((prev) => !prev)}
            sx={{
              borderRadius: 999,
              px: 3.5,
              py: 1.2,
              boxShadow: "0 10px 20px rgba(0,0,0,0.18)",
              background: isDeckOpen
                ? "linear-gradient(90deg, #a93b3b 0%, #8b2e2e 100%)"
                : "linear-gradient(90deg, #c47f3d 0%, #a85a22 100%)",
            }}
          >
            Deck & Cart
          </Button>
        </Box>
        <Drawer
          anchor="bottom"
          open={isDeckOpen}
          onClose={() => setDeckOpen(false)}
          PaperProps={{
            sx: {
              maxHeight: "75vh",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              p: { xs: 1.5, sm: 2 },
            },
          }}
        >
          <Deck
            deck={deck}
            decksFromDb={decksFromDb}
            fontSizeBreakpoints={fontSizeBreakpoints}
            maxHeightBreakpoints={maxHeightBreakpoints}
            onClear={handleClearButton}
            setDeckName={setDeckName}
            deckname={deckname}
            handleSave={onSubmit}
            handleInputChange={handleInputChange}
            validateForm={validateForm}
            value={value}
            handleLoadDecks={handleLoadDecks}
            handleDeleteDeck={handleDeleteDeck}
          />
        </Drawer>
      </Container>
    );
  if (cards && !cards.length)
    return (
      <Container sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          No cards available at this time
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please check back later for new cards!
        </Typography>
      </Container>
    );
  return null;
};

export default React.memo(CardFeedBack);
