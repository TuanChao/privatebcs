// import React, { useContext } from "react";
import HomeBanner from "../HomeOrganisms/HomeBanner";
// import HomeSubBanner from "../HomeOrganisms/HomeSubBanner";
// import BackdropSection from "../HomeOrganisms/BackdropSection";
// import HomeTeam from "../HomeOrganisms/HomeTeam";
// import { HomeContext } from "../context";
// import homeBanner from "src/assets/bcs-banner-soc2.jpg";
import HomeKOLs from "../HomeOrganisms/HomeKOLs";
import HomeNews from "../HomeOrganisms/HomeNews";
import ServicePage from "../../Service";
import ServiceTemplate from "../../Service/ServiceTemplate";
// import ProductPage from "../../Product";
// import CyberSecurityChart from "../HomeOrganisms/HomeCyberChart";

const HomeTemplate: React.FC = () => {
  // const { scrollPosition } = useContext(HomeContext);
  return (
    <>
      <HomeBanner />

      <div className="home-content-container">

        <HomeKOLs />

        {/* <ProductPage/> */}

        <ServicePage/>
        
        <HomeNews />

        {/* <HomeSubBanner /> */}

        {/* <CyberSecurityChart/> */}

        {/* <BackdropSection /> */}

        {/* <HomeTeam /> */}
      </div>
    </>
  );
};

export default HomeTemplate;

