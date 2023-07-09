import React, { createContext, useContext, useState } from "react";
import Drawer from "@mui/material/Drawer";
import { Box } from "@mui/system";

const DrawerContext = createContext();

export const DrawerProvider = ({ children }) => {
  const [drawerState, setDrawerState] = useState({});

  const toggleDrawer = (side, open) => () => {
    setDrawerState({ ...drawerState, [side]: open });
  };

  const renderDrawer = (side, content) => (
    <Drawer
      anchor={side}
      open={drawerState[side] || false}
      onClose={toggleDrawer(side, false)}
    >
      <Box
        sx={{ width: { md: "10vw", sm: "13vw" } }}
        role="presentation"
        onClick={toggleDrawer(side, false)}
        onKeyDown={toggleDrawer(side, false)}
      >
        {content}
      </Box>
    </Drawer>
  );

  return (
    <DrawerContext.Provider value={{ toggleDrawer, renderDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const drawContext = useContext(DrawerContext);
  if (!drawContext)
    throw new Error("useMenu must be used within a MenuProvider");
  return drawContext;
};
