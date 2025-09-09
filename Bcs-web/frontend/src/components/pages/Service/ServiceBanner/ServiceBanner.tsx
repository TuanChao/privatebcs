import React, { useEffect, useState, useRef } from "react";
import "./ServiceBanner.css";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl } from "../../../../utils/api";

type ServiceBannerType = {
  id: string;
  name: string;
  description: string;
  image: string;
  content: string;
  postingDate: string;
  viewCount?: number;
};

function renderNameByWord(name: string) {
  const parts = name.split(/(\s+|\n)/g);
  return parts.map((part, idx) =>
    part === "\n" || part.match(/^\s*[\r\n]+\s*$/)
      ? <br key={idx} />
      : <span key={idx} className="serviceBanner-word" style={{ marginRight: 8 }}>{part}</span>
  );
}

const ServiceBanner: React.FC = () => {
  const [serviceBanners, setServiceBanners] = useState<ServiceBannerType[]>([]);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Function để navigate với state
  const handleViewMore = (serviceBanner: ServiceBannerType) => {
    navigate(`/servicebanner/${serviceBanner.id}`, {
      state: { serviceBanner }
    });
  };

  // Fetch data from ServiceBanner API
  useEffect(() => {
    setLoading(true);
    fetch("/api/Manage/CsServiceBanner/Public")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const arr = Array.isArray(data) ? data : (data.data ? data.data : []);
        setServiceBanners(arr);
        setError(null);
      })
      .catch((error) => {
        console.error('Error fetching ServiceBanner:', error);
        setError('Không thể tải dữ liệu banner dịch vụ');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Auto slide - chỉ đi xuống (next)
  useEffect(() => {
    if (serviceBanners.length > 1 && !animating) {
      timerRef.current = setTimeout(() => {
        goToNext();
      }, 5000);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [current, serviceBanners, animating]);

  const goToNext = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % serviceBanners.length);
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

  if (loading) {
    return <div className="serviceBanner-container">Đang tải banner dịch vụ...</div>;
  }

  if (error) {
    return <div className="serviceBanner-container">Lỗi: {error}</div>;
  }

  if (!serviceBanners.length) {
    return <div className="serviceBanner-container">Không có banner dịch vụ nào.</div>;
  }

  return (
    <div className="serviceBanner-container">
      <div className="serviceBanner-home-banner">
        {/* Slide hiện tại */}
        <div
          className={`serviceBanner-slide-img ${animating ? "serviceBanner-slide-fade-out" : "serviceBanner-slide-fade-in"}`}
          style={{ 
            backgroundImage: `url(${getImageUrl(serviceBanners[current].image)})`
          }}
        >
          <div className="serviceBanner-content-overlay">
            <div className="serviceBanner-title-overlay">
              {renderNameByWord(serviceBanners[current].name)}
            </div>
            
            <div className="serviceBanner-description">
              {serviceBanners[current].description}
            </div>
            
            <button 
              onClick={() => handleViewMore(serviceBanners[current])}
              className="serviceBanner-view-more-btn"
            >
              Xem thêm
            </button>
          </div>
        </div>

        {/* Indicator dots */}
        {serviceBanners.length > 1 && (
          <div className="serviceBanner-slide-controls-horizontal">
            {serviceBanners.map((_, idx) => (
              <button
                key={idx}
                className={idx === current ? "active" : ""}
                disabled={animating}
                onClick={() => goToSlide(idx)}
                title={serviceBanners[idx].name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceBanner;


