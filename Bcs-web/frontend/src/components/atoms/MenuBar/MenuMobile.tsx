import React from "react";
import { MENU_ARRAY } from "./Menubar.type";
import { SOCIAL_LIST } from "../Footer/Footer.type";

type Props = { isShow?: boolean; handleNavigate: (url: string) => void; handleToggleMenu: () => void };

const MenuMobile: React.FC<Props> = ({ isShow = false, handleNavigate, handleToggleMenu }) => {
  return (
    <div className={`menu-mobile-container ${isShow ? "show" : ""}`}>
      <nav className="nav-mobile">
        <ul className="nav-list-mobile">
          {MENU_ARRAY.map((m) => {
            return (
              <li key={m.title} className="nav-item-mobile" onClick={() => handleNavigate(m.url)}>
                {m.title}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="navigate-container" style={{ padding: "20px" }}>
        <div className="contact-title" style={{ fontSize: "20px", color: "white" }}>
          CONTACT AND SOCIAL
        </div>
        {SOCIAL_LIST.map((item) => {
          return (
            <div
              key={item.title}
              className="contact-content-item"
              onClick={() =>
                item.title.includes("gmail.com")
                  ? (window.location.href = item.url as string)
                  : window.open(item.url, "_blank", "noopener,noreferrer")
              }
            >
              <div className="icon-contact">{item.icon}</div> {item.title}
            </div>
          );
        })}
      </div>

      <div className="icon-menu-close" onClick={() => handleToggleMenu()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
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

export default MenuMobile;
