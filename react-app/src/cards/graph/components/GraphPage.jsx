import React, { useState } from "react";
import CardItem from "./CardItem";
import CardGraph from "./CardGraph";
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
} from "@mui/material";
import { Box } from "@mui/material";
import Card from "../../components/card/Card";

const GraphPage = ({ cards }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  if (!cards) return <p>No cards available.</p>;
  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const dialogStyle = {
    minHeight: "80vh",
    maxHeight: "90vh",
    minWidth: window.innerWidth < 600 ? "95vw" : "80vw",
    maxWidth: window.innerWidth < 600 ? "100vw" : "90vw",
  };

  const fontSizeBreakpoints = { xs: 5, sm: 10, m: 12, lg: 15 };
  const maxHeightBreakpoints = { xs: 75, sm: 100, m: 150, lg: 200 };

  return (
    <>
      <Box>
        {" "}
        <TextField
          label="Search for a Card"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBlock: "20px", color: "white" }}
        />
      </Box>
      <Box display="flex" justifyContent="center" flexWrap="wrap">
        {filteredCards.map((card, index) => (
          <Grid
            key={index}
            item
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              key={card._id}
              pokemonCard={card}
              onClick={() => {
                setSelectedCard(card);
                setOpen(true);
              }}
              maxHeightBreakpoints={maxHeightBreakpoints}
              fontSizeBreakpoints={fontSizeBreakpoints}
            />
          </Grid>
        ))}

        {selectedCard && (
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            PaperProps={{ style: dialogStyle }}
          >
            <DialogTitle>Graph for {selectedCard.name}</DialogTitle>
            <DialogContent>
              <CardGraph card={selectedCard} />
            </DialogContent>
          </Dialog>
        )}
      </Box>
    </>
  );
};

export default GraphPage;
