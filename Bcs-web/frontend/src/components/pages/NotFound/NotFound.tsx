import React from "react";
import { Link } from "react-router-dom"; // Nếu bạn đang sử dụng React Router
import "./NotFound.css";

const NotFound: React.FC = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">403</h1>
        <p className="not-found-message">Tính năng này đang được nâng cấp</p>
        <Link to="/" className="not-found-link">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
