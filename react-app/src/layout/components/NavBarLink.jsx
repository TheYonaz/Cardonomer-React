import React from "react";
import { Link } from "react-router-dom";

const NavBarLink = ({ to, children, color = "#fff" }) => {
  
  return (
    <Link to={to} style={{ color, textDecoration: "none" }}>
      {children}
    </Link>
  );
};

export default NavBarLink;
