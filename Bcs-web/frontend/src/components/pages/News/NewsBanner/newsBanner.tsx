import React, { useEffect, useState } from "react";

const NewsBanner: React.FC = () => {
  const [banners, setBanners] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch("/api/Manage/NewsBanner/Public")
      .then(res => res.json())
      .then(data => setBanners(Array.isArray(data) ? data.map(x => x.imageUrl) : []));
  }, []);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % banners.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [banners]);

  if (!banners.length) return null;

  return (
    <div className="news-banner-container">
      {banners.map((banner, idx) => (
        <img
          key={idx}
          className={`image-banner-news${current === idx ? " active" : ""}`}
          src={banner}
          alt={`banner-${idx}`}
          draggable={false}
        />
      ))}
      <div className="news-banner-dots">
        {banners.map((_, idx) => (
          <div
            key={idx}
            className={`news-banner-dot${current === idx ? " active" : ""}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
};
export default NewsBanner;