import React, { useEffect, useState } from "react";
import "./ScrollTop.css";

const ScrollTop: React.FC = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      className={`scroll-to-top ${showButton ? "show" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <line x1="12" y1="10" x2="12" y2="20"></line>
        <line x1="12" y1="10" x2="16" y2="14"></line>
        <line x1="12" y1="10" x2="8" y2="14"></line>
        <line x1="4" y1="4" x2="20" y2="4"></line>
      </svg>
    </button>
  );
};

export default ScrollTop;
