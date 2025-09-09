import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import React, { useEffect } from "react";
import { HomeContextProvider } from "./context/HomeContext";
import "./HomePage.css";
import HomeTemplate from "./HomeTemplate";
import { useHandleScroll } from "./hooks/useHandleScroll";
import { useHandleNews } from "./hooks/useHandleNews";
import { HomeKOLs } from "./Home.type";
gsap.registerPlugin(ScrollTrigger);

const HomePage: React.FC = () => {
  const { scrollPosition } = useHandleScroll();
  const { listNews } = useHandleNews();
  const listKol: HomeKOLs[][] = [];

  useEffect(() => {
    const elements = document.querySelectorAll(".animate-me");
    const isMobile = window.innerWidth <= 768;

    elements.forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: isMobile ? 100 : 200, scale: isMobile ? 1.1 : 1.3 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: isMobile ? 2 : 4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: isMobile ? "top 90%" : "top 80%",
            end: "top 0%",
            scrub: true,
          },
        }
      );
    });
  }, []);

  return (
    <HomeContextProvider value={{ listKol, listNews: [listNews], scrollPosition }}>
      <div className="home-container animate-me">
        <HomeTemplate />
      </div>
    </HomeContextProvider>
  );
};

export default HomePage;
