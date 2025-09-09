import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useAppSelector } from "src/app/appHooks";
import { RootState } from "src/app/store";
import Footer from "src/components/atoms/Footer";
import IntroOverlay from "src/components/atoms/IntroOverlay";
import Menubar from "src/components/atoms/MenuBar";
import ScrollProgressBar from "src/components/atoms/ScrollProgressBar";
import ScrollTop from "src/components/atoms/ScrollTop";
import useTitle from "src/utilities/hooks/useTitle";
import "./MainLayout.css";
// import DarkModeToggle from "src/components/atoms/Darkmode";

type Props = {
  children?: React.ReactNode;
};

const MainLayout: React.FC<Props> = ({ children }) => {
  const { loading } = useAppSelector((state: RootState) => state.app);

  const [loadedIntro, setLoadedIntro] = useState<boolean>(false);
  useTitle("Security Bkav");

  useEffect(() => {
    !loadedIntro && window.scrollTo(0, 0);

    const timeout = setTimeout(() => {
      !loadedIntro && setLoadedIntro(true);
    }, 4000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: "relative",}} >
      <div className={`global-loading-container ${loading ? "show" : "hide"}`}>
        <ClipLoader size={60} color={"rgb(250, 84, 84)"} loading={loading} />
        
      </div>

      <IntroOverlay />
      <div className="main-layout">
      
        <Menubar />

        <ScrollProgressBar />

        {children}
      </div>

      <Footer />
      <ScrollTop />
    </div>
  );
};

export default MainLayout;
