import React from "react";
import {
  Button,
  Card,
  CardActions,
  Typography,
  CardContent,
} from "@mui/material";

const CardItem = ({ card, onSelect }) => {
  return (
    <Card variant="outlined" style={{ margin: "10px" }}>
      <CardContent>
        <Typography variant="h6">{card.name}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={onSelect}>
          Show Graph
        </Button>
      </CardActions>
    </Card>
  );
};

export default CardItem;
