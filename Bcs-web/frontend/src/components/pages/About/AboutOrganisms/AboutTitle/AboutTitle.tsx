import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AboutTitle.css";

interface AboutContent {
  id: number;
  content: string;
}

const AboutTitle: React.FC = () => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    axios.get<AboutContent[]>("/api/Manage/AboutContent/Public")
      .then(res => {
        // Lấy content của bản ghi đầu tiên (hoặc theo id nếu muốn)
        setContent(res.data[0]?.content || "");
      })
      .catch(() => setContent(""));
  }, []);

  return (
    <div className="about-title-container">
      <h1 className="about-title">BKAV CYBER SECURITY</h1>
      <br />
      <div className="divide-line"></div>
      <br />
      {content && (
        <div
          className="about-title-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
};

export default AboutTitle;