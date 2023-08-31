import { Box } from "@mui/material";
import React from "react";
import Header from "./header/Header";
import Main from "./main/mid/Main";
import LeftSidebar from "./main/drawContent/LeftBar";
import { DrawerProvider } from "./main/drawerProvider/DrawerProvider";
import Drawer from "./main/drawContent/Drawer";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import RightSidebar from "./main/drawContent/RightBar";
import { useUser } from "../users/providers/UserProvider";

const Layout = ({ children }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm")); // change 'sm' to the desired breakpoint
  const { user } = useUser();

  return (
    <Box display="flex" flexDirection="column">
      <Header />
      <Box display="flex" justifyContent="center">
        <DrawerProvider>
          {matches ? <LeftSidebar /> : <Drawer />}
          <Main>{children}</Main>
          {matches && <RightSidebar />}
        </DrawerProvider>
      </Box>
    </Box>
  );
};

export default Layout;
