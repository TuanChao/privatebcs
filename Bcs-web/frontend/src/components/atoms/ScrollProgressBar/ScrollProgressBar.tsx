import React, { useEffect, useState } from "react";
import "./ScrollProgressBar.css";
import logoBlack from "../../../assets/images/1.png";
import { Link } from "react-router-dom";

const ScrollProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    setProgress(scrollPercentage);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div id="progress-container">
      <Link to="/">
      <img src={logoBlack} alt="logo" className="logo-black" width={70} />
      </Link>

      <div id="progress-bar" style={{ height: `${progress}%` }}>
      
      </div>
    </div>
  );
};

export default ScrollProgressBar;
