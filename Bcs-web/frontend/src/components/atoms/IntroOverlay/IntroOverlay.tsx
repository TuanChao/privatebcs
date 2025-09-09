import React, { useState, useEffect, useMemo } from "react";
import "./IntroOverlay.css";
import logo from "src/assets/images/1.png";

const IntroOverlay = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const phase1 = setTimeout(() => setAnimationPhase(1), 800);
    const phase2 = setTimeout(() => setAnimationPhase(2), 2500);
    const phase3 = setTimeout(() => setAnimationPhase(3), 4500);
    const hideTimeout = setTimeout(() => setIsVisible(false), 6000);

    return () => {
      clearTimeout(phase1);
      clearTimeout(phase2);
      clearTimeout(phase3);
      clearTimeout(hideTimeout);
    };
  }, []);

  // Particles
  const Particles = () => {
    const particles = useMemo(
      () =>
        Array.from({ length: 36 }, (_, i) => {
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const animationDelay = Math.random() * 2;
          const animationDuration = 2 + Math.random() * 3;
          return (
            <div
              key={i}
              className="particle"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: `${animationDelay}s`,
                animationDuration: `${animationDuration}s`
              }}
            />
          );
        }),
      []
    );
    return <div className="particles-container">{particles}</div>;
  };

  if (!isVisible) return null;

  return (
    <div className={`intro-overlay ${animationPhase >= 3 ? 'fade-out' : ''}`}>
      <div className="bg-gradient" />
      <Particles />

      <div className="content-container">
        <div className={`logo-section ${animationPhase >= 1 ? 'visible' : ''}`}>
          <div className="logo-wrapper">
            <div className="logo-placeholder">
              <img src={logo} alt="Logo" className="logo-img" />
            </div>
            <div className="logo-rings">
              <div className="ring ring-1" />
              <div className="ring ring-2" />
              <div className="ring ring-3" />
            </div>
          </div>
        </div>

        <div className="text-section visible">
          <p className="tagline">Loadding...</p>
          <div className="loading-bar">
            <div className="loading-progress" />
          </div>
        </div>
      </div>

      <div className="overlay-top" />
      <div className="overlay-bottom" />
    </div>
  );
};

export default IntroOverlay;


