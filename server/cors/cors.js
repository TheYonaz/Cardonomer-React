const cors = require("cors");
const express = require("express");
const app = express();
const corsConfig = {
  origin: [
    "http://localhost:8181",
    "http://127.0.0.1:5500",
    "http://localhost:3001",
    "http://localhost:3000",
    "https://cardonomer1-back.onrender.com",
    "https://cardonomer1.onrender.com",
  ],
};
app.use(cors(corsConfig));
// const setCors = () => cors(corsConfig);
module.exports = app;
