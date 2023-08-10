import { GlobalStyles } from "@mui/material";

const ScrollbarStyles = () => (
  <GlobalStyles
    styles={{
      "*::-webkit-scrollbar": {
        width: "8px",
      },
      "*::-webkit-scrollbar-track": {
        background: "#f5f5f5",
      },
      "*::-webkit-scrollbar-thumb": {
        background: "#888",
      },
      "*::-webkit-scrollbar-thumb:hover": {
        background: "#555",
      },
    }}
  />
);

export default ScrollbarStyles;
