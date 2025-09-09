import React from "react";
import "./AboutPage.css";
import AboutTemplate from "./AboutTemplate";
import { AboutContextProvider } from "./context";
import TimelineHS from "./AboutOrganisms/AboutTl";
import AboutTile from "./AboutOrganisms/AboutTitle";

const AboutPage: React.FC = () => {
  return (
    <AboutContextProvider value={{}}>
      
      <div className="about-page">
        <AboutTile/>
        {/* <AboutTemplate /> */}
        
          <TimelineHS/>    
      </div>
    </AboutContextProvider>
  );
};

export default AboutPage;
