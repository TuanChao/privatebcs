import React from "react";
import banner from "src/assets/images/bkav-pam.png";

const AboutBanner: React.FC = () => {
  return (
    <div className="about-banner-container">
      <div className="under-logo">Bkav</div>

      <div className="about-name">
        Bkav
      </div>

      <img className="image-banner-about" src={banner} alt="banner" />
    </div>
  );
};

export default AboutBanner;
