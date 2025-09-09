import React, { useEffect, useState } from "react";
import "./Menubar.css";
import { MENU_ARRAY, SOCIAL_HEADER } from "./Menubar.type";
import { useNavigate, Link } from "react-router-dom";
import logoWhite from "../../../assets/images/1.png";
import MenuMobile from "./MenuMobile";

const Menubar: React.FC = () => {
  const [isShowMenu, setIsShowMenu] = useState(false);

  const [scrollProgress, setScrollProgress] = useState(0);
  const navigate = useNavigate();

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    setScrollProgress(progress);
  };

  const handleToggleMenu = () => setIsShowMenu((prev) => !prev);

  const handleNavigate = (url: string) => {
    navigate(url);
    isShowMenu && handleToggleMenu();
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="menubar">
      <Link to = "/">
        <img src={logoWhite} alt="logo" className="logo-white" width={50} />
      </Link>
      <nav className="nav">
        <ul className="nav-list">
          {MENU_ARRAY.map((m) => {
            return (
              <li key={m.title} className="nav-item" onClick={() => handleNavigate(m.url)}>
                {m.title}
              </li>
            );
          })}
        </ul>
      </nav>
      <div
        className="progress"
        style={{
          width: `${scrollProgress}%`,
        }}
      ></div>

      <div className="social-icon">
        {SOCIAL_HEADER.map((item, index) => {
          return (
            <a key={`${index}_${item.url}`} href={item.url} target="_blank" rel="noopener noreferrer">
              {item.icon}
            </a>
          );
        })}
      </div>

      <MenuMobile isShow={isShowMenu} handleNavigate={handleNavigate} handleToggleMenu={handleToggleMenu} />

      <div className="icon-menu" onClick={() => handleToggleMenu()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-list"
          viewBox="0 0 16 16"
        >
          <path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
        </svg>
      </div>
    </div>
  );
};

export default Menubar;

