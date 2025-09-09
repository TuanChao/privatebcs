import React from "react";
import banner from "../../../../assets/images/bcs-layout-2.png";
import banner1 from "../../../../assets/images/bcs-layout-2.png";
import banner2 from "../../../../assets/images/bcs-layout-2.png";
import "./docsBanner.css";

const DocsBanner: React.FC = () => {
    return (
        <div className="docs-banner-container">
            <div className="image-banner-docs">
                <img className="img-banner-docs" src={banner} alt="banner" loading="lazy" />
                <img className="img-banner-docs" src={banner1} alt="banner1" loading="lazy" />
                <img className="img-banner-docs" src={banner2} alt="banner2" loading="lazy" />
            </div>
        </div>
    );
};

export default DocsBanner;