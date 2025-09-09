import React, { useEffect, useState, useRef } from "react";
import "./HomeBanner.css";
import { Link } from "react-router-dom";

type Poster = {
  id: number;
  image: string;
  name: string;
};

function renderNameByWord(name: string) {
  const parts = name.split(/(\s+|\n)/g);
  return parts.map((part, idx) =>
    part === "\n" || part.match(/^\s*[\r\n]+\s*$/)
      ? <br key={idx} />
      : <span key={idx} className="banner-word" style={{ marginRight: 8 }}>{part}</span>
  );
}

const HomeBanner: React.FC = () => {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch data
  useEffect(() => {
    fetch("/api/Manage/Poster/Public?page=1&pageSize=5")
      .then((res) => {
        // console.log("API Response status:", res.status);
        return res.json();
      })
      .then((data) => {
        // console.log("Raw API data:", data);
        // console.log("Data type:", typeof data);
        // console.log("Is array:", Array.isArray(data));
        const arr = Array.isArray(data) ? data : [data];
        // console.log("Processed posters array:", arr);
        // console.log("First poster image:", arr[0]?.image);
        setPosters(arr);
      })
      .catch((error) => {
        console.error("Error fetching posters:", error);
      });
  }, []);

  // Auto slide - chỉ đi xuống (next)
  useEffect(() => {
    if (posters.length > 1 && !animating) {
      timerRef.current = setTimeout(() => {
        goToNext();
      }, 5000);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [current, posters, animating]);

  const goToNext = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % posters.length);
      setAnimating(false);
    }, 500);
  };

  const goToSlide = (index: number) => {
    if (animating || index === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 500);
  };

  if (!posters.length)
    return <div className="banner-container">Đang tải banner...</div>;

  return (
    <div className="banner-container">
      <div className="home-banner">
        {/* Slide hiện tại */}
        <Link
          to={`/socproduct/${posters[current].id}`}
          className={`slide-img ${animating ? "slide-fade-out" : "slide-fade-in"}`}
          style={{ backgroundImage: `url(${posters[current].image})` }}
        >
          <div className="banner-title-overlay text-hover-effect-word">
            {renderNameByWord(posters[current].name)}
          </div>
        </Link>

        {/* Indicator dots */}
        {posters.length > 1 && (
          <div className="slide-controls-horizontal">
            {posters.map((_, idx) => (
              <button
                key={idx}
                className={idx === current ? "active" : ""}
                disabled={animating}
                onClick={() => goToSlide(idx)}
                title={posters[idx].name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeBanner;

