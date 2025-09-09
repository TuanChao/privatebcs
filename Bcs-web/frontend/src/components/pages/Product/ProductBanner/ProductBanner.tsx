import React, { useEffect, useState, useRef } from "react";
import "./ProductBanner.css";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl } from "../../../../utils/api";

type ProductBannerType = {
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
      : <span key={idx} className="productBanner-word" style={{ marginRight: 8 }}>{part}</span>
  );
}

const ProductBanner: React.FC = () => {
  const [productBanners, setProductBanners] = useState<ProductBannerType[]>([]);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Function để navigate với state
  const handleViewMore = (productBanner: ProductBannerType) => {
    navigate(`/productbanner/${productBanner.id}`, {
      state: { productBanner }
    });
  };

  // Fetch data
  useEffect(() => {
    setLoading(true);
    fetch("/api/Manage/ProductBanner/Public")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Debug log
        const arr = Array.isArray(data) ? data : (data.data ? data.data : []);
        setProductBanners(arr);
        setError(null);
      })
      .catch((error) => {
        console.error('Error fetching ProductBanner:', error);
        setError('Không thể tải dữ liệu banner sản phẩm');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Auto slide - chỉ đi xuống (next)
  useEffect(() => {
    if (productBanners.length > 1 && !animating) {
      timerRef.current = setTimeout(() => {
        goToNext();
      }, 5000);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [current, productBanners, animating]);

  const goToNext = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % productBanners.length);
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
    return <div className="productBanner-container">Đang tải banner...</div>;
  }

  if (error) {
    return <div className="productBanner-container">Lỗi: {error}</div>;
  }

  if (!productBanners.length) {
    return <div className="productBanner-container">Không có banner sản phẩm nào.</div>;
  }

  return (
    <div className="productBanner-container">
      <div className="productBanner-home-banner">
        {/* Slide hiện tại */}
        <div
          className={`productBanner-slide-img ${animating ? "productBanner-slide-fade-out" : "productBanner-slide-fade-in"}`}
          style={{ 
            backgroundImage: `url(${getImageUrl(productBanners[current].image)})`
          }}
        >
          <div className="productBanner-content-overlay">
            <div className="productBanner-title-overlay">
              {renderNameByWord(productBanners[current].name)}
            </div>
            
            <div className="productBanner-description">
              {productBanners[current].description}
            </div>
            
            <button 
              onClick={() => handleViewMore(productBanners[current])}
              className="productBanner-view-more-btn"
            >
              Xem thêm
            </button>
          </div>
        </div>

        {/* Indicator dots */}
        {productBanners.length > 1 && (
          <div className="productBanner-slide-controls-horizontal">
            {productBanners.map((_, idx) => (
              <button
                key={idx}
                className={idx === current ? "active" : ""}
                disabled={animating}
                onClick={() => goToSlide(idx)}
                title={productBanners[idx].name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductBanner;


