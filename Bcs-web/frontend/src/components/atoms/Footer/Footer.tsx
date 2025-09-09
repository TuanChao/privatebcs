import React from "react";
import "./Footer.css";
// import logo from "src/assets/images/1.png";
// import { MENU_ARRAY } from "../MenuBar/Menubar.type";
// import { useNavigate } from "react-router-dom";
// import { SOCIAL_LIST } from "./Footer.type";
import AboutDetail from "../../pages/About/AboutOrganisms/AboutDetail";

const Footer: React.FC = () => {
  // const navigate = useNavigate();

  return (
    <footer className="footer">
      <AboutDetail/>
    </footer>
  );
};

export default Footer;

