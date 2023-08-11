import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import {
  Avatar,
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  Grid,
  Container,
  Tooltip,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star"; // Importing a star icon for added appeal

const UserDecks = ({ decks }) => {
  const [open, setOpen] = useState(false);
  const [currentDeck, setCurrentDeck] = useState(null);

  const handleOpen = (deck) => {
    setCurrentDeck(deck);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box mt={4}>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          borderRadius: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {decks.map((deck, index) => (
          <Box key={index} marginX={2}>
            <Typography variant="h5" gutterBottom>
              {deck.deckName}
            </Typography>
            <Tooltip title="Click to view deck details!" arrow>
              <Button
                variant="contained"
                color="primary"
                startIcon={<StarIcon />}
                onClick={() => handleOpen(deck)}
                style={{ margin: "10px 0" }}
              >
                View Deck Details
              </Button>
            </Tooltip>
          </Box>
        ))}

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <IconButton color="primary" size="small">
                  <StarIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography variant="h6">
                  Exclusive Peek: {currentDeck?.deckName}
                </Typography>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              {currentDeck?.cards.map((card, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <img
                    src={card.images.large}
                    alt={card.name}
                    style={{ width: "100%" }}
                  />
                  <Typography variant="body2" align="center">
                    {card.name}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default UserDecks;
