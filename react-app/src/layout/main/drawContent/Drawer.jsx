import React from "react";
import Button from "@mui/material/Button";
import { useDrawer } from "../drawerProvider/DrawerProvider";
import LeftSidebar from "./LeftBar";
import RightSidebar from "./RightBar";
import { Box } from "@mui/material";
const buttonStyles = {
  position: "fixed",
  bottom: 10,
  borderRadius: "50%",
  minWidth: "50px",
  minHeight: "50px",
  fontSize: "10px",
  backgroundColor: "lightblue",
  backgroundSize: "cover",
};
const leftButtonStyles = {
  ...buttonStyles,
  left: 10,
  backgroundImage: `url('https://cdn.pixabay.com/photo/2017/01/27/14/25/burger-2013191_960_720.png')`,
};

const rightButtonStyles = {
  ...buttonStyles,
  right: 10,
  backgroundImage: `url('https://cdn.pixabay.com/photo/2019/07/29/12/13/group-4370510_960_720.png')`,
};

const RightDrawer = () => {
  const { toggleDrawer, renderDrawer } = useDrawer();

  return (
    <Box>
      <Button
        onClick={toggleDrawer("left", true)}
        sx={leftButtonStyles}
      ></Button>
      {renderDrawer("left", <LeftSidebar />)}
      <Button
        onClick={toggleDrawer("right", true)}
        sx={rightButtonStyles}
      ></Button>
      {renderDrawer("right", <RightSidebar />)}
    </Box>
  );
};
export default RightDrawer;
