import React from "react";
import "./App.css";
import RoutesApp from "./routes/index.routes";
import ResetScroll from "./components/atoms/ResetScroll";

// import { useLocation } from "react-router-dom";
// import Navbar from "src/components/atoms/MenuBar";
// import Footer from "src/components/atoms/Footer";
// import Login from "./components/pages/Auth/Login";
// import { Routes, Route } from "react-router-dom";

function App() {
  if (process.env.NODE_ENV === "production") {
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      if (args[0] && args[0].includes("ResizeObserver loop completed with undelivered notifications")) {
        return;
      }
      originalConsoleWarn(...args);
    };
  }

  // const location = useLocation();
  // const hideLayout = location.pathname === "/login";

  // if (process.env.NODE_ENV === "production") {
  //   const originalResizeObserver = window.ResizeObserver;

  //   window.ResizeObserver = class ResizeObserverMock {
  //     observe() {}
  //     unobserve() {}
  //     disconnect() {}
  //   };
  // }

  return (
    <>
      <ResetScroll />
      <RoutesApp />
      {/* {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        
      </Routes>
      {!hideLayout && <Footer />} */}
    </>
  );

}

export default App;

