import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useAppSelector } from "src/app/appHooks";
import { RootState } from "src/app/store";
import useTitle from "src/utilities/hooks/useTitle";
import IntroOverlay from "src/components/atoms/IntroOverlay";
// import ScrollProgressBar from "src/components/atoms/ScrollProgressBar";

type Props = {
  children?: React.ReactNode;
};

const BlankLayout: React.FC<Props> = ({ children }) => {
  const { loading } = useAppSelector((state: RootState) => state.app);

  // Kiểm tra localStorage để biết đã xem intro chưa
  const [loadedIntro, setLoadedIntro] = useState<boolean>(() => {
    return localStorage.getItem("introSeen") === "true";
  });
  useTitle("Security Bkav");

  useEffect(() => {
    if (!loadedIntro) window.scrollTo(0, 0);

    if (!loadedIntro) {
      const timeout = setTimeout(() => {
        setLoadedIntro(true);
        localStorage.setItem("introSeen", "true");
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [loadedIntro]);

  return (
    <div style={{ position: "relative" }}>
      <div className={`global-loading-container ${loading ? "show" : "hide"}`}>
        <ClipLoader size={60} color={"rgb(250, 84, 84)"} loading={loading} />
      </div>

      {!loadedIntro && <IntroOverlay />}
      <div className="blank-layout">
        {/* <ScrollProgressBar /> */}
        {children}
      </div>
    </div>
  );
};

export default BlankLayout;
