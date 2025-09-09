import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { getImageUrl } from "../../../../utils/api";
import "./NewsDetail.css";

type NewsType = {
  id: string;
  name: string;
  description: string;
  image: string;
  content: string;
  postingDate: string;
  viewCount?: number;
  isActive?: boolean;
};

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [news, setNews] = useState<NewsType | null>(location.state?.news || null);
  const [loading, setLoading] = useState(!news);
  const [error, setError] = useState<string | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsType[]>([]);

  // Fetch news detail từ API nếu chưa có
  useEffect(() => {
    if (id) {
      const fetchNews = async () => {
        try {
          setLoading(true);
          setNews(null);
          setError(null);
          const response = await fetch(`/api/Manage/News/${id}`, {
            credentials: "include"
          });
          if (!response.ok) {
            throw new Error("Không thể tải chi tiết tin tức");
          }
          const newsData = await response.json();
          // Nếu muốn cho admin xem cả bài ẩn thì bỏ dòng này
          // Nếu muốn public không xem được thì kiểm tra ở API Public
          setNews(newsData);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Không thể tải chi tiết tin tức');
        } finally {
          setLoading(false);
        }
      };
      fetchNews();
    }
  }, [id]);

  // Fetch related news (3 tin gần nhất, khác tin hiện tại)
  useEffect(() => {
    const fetchRelatedNews = async () => {
      try {
        const response = await fetch("/api/Manage/News/Public", {
          credentials: "include"
        });
        
        if (response.ok) {
          const data = await response.json();
          const newsArray = Array.isArray(data) ? data : (data.data ? data.data : []);
          
          // Lấy 3 tin mới nhất, khác tin hiện tại, và isActive = true
          const related = newsArray
            .filter((item: NewsType) => item.id !== id && item.isActive === true)
            .sort((a: NewsType, b: NewsType) => new Date(b.postingDate).getTime() - new Date(a.postingDate).getTime())
            .slice(0, 3);
          
          setRelatedNews(related);
        }
      } catch (err) {
        console.error('Error fetching related news:', err);
      }
    };

    if (id) {
      fetchRelatedNews();
    }
  }, [id]);

  // Tăng view count khi vào trang
  useEffect(() => {
    if (news && id) {
      // Call API để tăng view count (nếu backend có endpoint này)
      const increaseViewCount = async () => {
        try {
          await fetch(`/api/Manage/News/${id}/view`, {
            method: "POST",
            credentials: "include"
          });
        } catch (err) {
          }
      };

      increaseViewCount();
    }
  }, [news, id]);

  if (loading) return <div className="news-detail-loading">Đang tải chi tiết tin tức...</div>;
  if (error) return <div className="news-detail-error">Lỗi: {error}</div>;
  if (!news) return <div className="news-detail-error">Không tìm thấy tin tức</div>;

  return (
    <div className="news-detail-container">
      {/* Breadcrumb */}
      {/* <nav className="news-breadcrumb">
        <Link to="/" className="breadcrumb-link">Trang chủ</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to="/news" className="breadcrumb-link">Tin tức</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{news.name}</span>
      </nav> */}

      {/* Main Content */}
      <article className="news-detail-article">
        <header className="news-detail-header">
          <h1 className="news-detail-title">{news.name}</h1>
          <div className="news-detail-meta">
            <time className="news-detail-date">
              <i className="bi bi-calendar3"></i>
              {new Date(news.postingDate).toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span className="news-detail-views">
              <i className="bi bi-eye"></i>
              {news.viewCount || 0} lượt xem
            </span>
          </div>
          <div className="news-detail-description">
            {news.description}
          </div>
        </header>

        {/* <div className="news-detail-image">
          <img
            src={getImageUrl(news.image)}
            alt={news.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/default-news.jpg';
            }}
          />
        </div> */}

        <div 
          className="news-detail-content"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        {/* Share buttons */}
        <div className="news-detail-share">
          <h4>Chia sẻ bài viết:</h4>
          <div className="share-buttons">
            <button
              onClick={() => {
                const url = window.location.href;
                const text = `${news.name} - ${news.description}`;
                if (navigator.share) {
                  navigator.share({ title: news.name, text, url });
                } else {
                  navigator.clipboard.writeText(url);
                  alert('Đã sao chép link bài viết!');
                }
              }}
              className="share-btn copy"
            >
              <i className="bi bi-link-45deg"></i> Sao chép link
            </button>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-btn facebook"
            >
              <i className="bi bi-facebook"></i> Facebook
            </a>
            <a
              href={`https://X.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(news.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-btn twitter"
            >
              <i className="bi bi-x"></i> Tweet
            </a>
          </div>
        </div>
      </article>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <aside className="news-detail-related">
          <h3>Tin tức liên quan</h3>
          <div className="related-news-grid">
            {relatedNews.map((relatedItem) => (
              <Link
                key={relatedItem.id}
                to={`/news/${relatedItem.id}`}
                className="related-news-card"
                state={{ news: relatedItem }}
              >
                <div className="related-news-image">
                  <img
                    src={getImageUrl(relatedItem.image)}
                    alt={relatedItem.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/default-news.jpg';
                    }}
                  />
                </div>
                <div className="related-news-content">
                  <h4 className="related-news-title">{relatedItem.name}</h4>
                  <p className="related-news-description">{relatedItem.description}</p>
                  <time className="related-news-date">
                    {new Date(relatedItem.postingDate).toLocaleDateString('vi-VN')}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      )}

      {/* Back to list button */}
      <div className="news-detail-actions">
        <Link to="/news" className="back-to-list-btn">
          <i className="bi bi-arrow-left"></i> Quay lại danh sách tin tức
        </Link>
      </div>
    </div>
  );
};

export default NewsDetail;

