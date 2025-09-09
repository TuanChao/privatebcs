import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HomeNews.css";
import { getImageUrl } from "../../../../../utils/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Type News giống AdminNews
type News = {
  id: string;
  name: string;
  description: string;
  image: string;
  content: string;
  postingDate: string;
  viewCount?: number;
  isActive?: boolean;
};

const HomeNews: React.FC = () => {
  const [listNews, setListNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch news trực tiếp từ API - chỉ lấy những tin isActive = true
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/Manage/News/Public", {
          credentials: "include"
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        // // Xử lý data - có thể là array hoặc object có property data
        const newsArray = Array.isArray(data) ? data : (data.data ? data.data : []);
        
        // Lấy tất cả tin tức và sort theo postingDate mới nhất
        const sortedNews = newsArray
          .sort((a: News, b: News) => new Date(b.postingDate).getTime() - new Date(a.postingDate).getTime())
          .slice(0, 6); // Chỉ lấy 6 tin mới nhất cho homepage
        
        setListNews(sortedNews);
        setError(null);
      } catch (err) {
        setError('Không thể tải tin tức');
        setListNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="home-news-container animate-me">
        <h1 className="home-news-title">TIN TỨC</h1>
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Đang tải tin tức...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return null; // Ẩn component nếu có lỗi để không ảnh hưởng homepage
  }

  // No data state - hiển thị message thay vì ẩn component
  if (!listNews || listNews.length === 0) {
    return (
      <div className="home-news-container animate-me">
        <h1 className="home-news-title">TIN TỨC</h1>
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Chưa có tin tức nào.
        </div>
      </div>
    );
  }

  return (
    <div className="home-news-container animate-me">
      <h1 className="home-news-title">TIN TỨC</h1>

      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={3}
        slidesPerGroup={1}
        loop={listNews.length > 3} // Chỉ loop nếu có nhiều hơn 3 items
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        navigation
        pagination={{ clickable: true }}
        className="home-news-swiper"
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
      >
        {listNews.map((item, index) => {
          return (
            <SwiperSlide key={item.id}>
              <Link
                to={`/news/${item.id}`}
                className="card-news-ts"
                style={{
                  backgroundImage: `url(${getImageUrl(item.image)})`, // ✅ Sử dụng getImageUrl
                  textDecoration: 'none',
                  width: "100%"
                }}
                state={{ news: item }} // Truyền data cho NewsDetail
              >
                <div className="news-content-ts">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p> {/* ✅ Sử dụng description thay vì title */}
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="logo-under-ground"></div>
    </div>
  );
};

export default HomeNews;
