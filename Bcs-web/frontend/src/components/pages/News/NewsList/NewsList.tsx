import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../../../utils/api";
import "./NewsList.css";

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

const NewsList: React.FC = () => {
  const [newsList, setNewsList] = useState<NewsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 12;

  // Fetch news từ API (chỉ isActive = true)
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/Manage/News/Public", {
          credentials: "include"
        });
        
        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu tin tức");
        }
        
        const data = await response.json();
        const newsArray = Array.isArray(data) ? data : (data.data ? data.data : []);
        
        // Chỉ lấy những news isActive = true và sort theo postingDate mới nhất
        const activeNews = newsArray
          .filter((news: NewsType) => news.isActive === true)
          .sort((a: NewsType, b: NewsType) => new Date(b.postingDate).getTime() - new Date(a.postingDate).getTime());
        
        setNewsList(activeNews);
        setError(null);
      } catch (err) {
        console.error('Error fetching news list:', err);
        setError('Không thể tải dữ liệu tin tức');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Filter news theo search
  const filteredNews = newsList.filter(news =>
    news.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    news.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = filteredNews.slice(indexOfFirstNews, indexOfLastNews);
  const totalPages = Math.ceil(filteredNews.length / newsPerPage);

  // Extract text from HTML for preview
  const extractText = (html: string, maxLength = 120) => {
    const div = document.createElement("div");
    div.innerHTML = html || "";
    const text = div.textContent || div.innerText || "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  if (loading) return <div className="news-list-loading">Đang tải danh sách tin tức...</div>;
  if (error) return <div className="news-list-error">Lỗi: {error}</div>;

  return (
    <div className="news-list-container">
      <div className="news-list-header">
        <h1>Tin tức</h1>
        <div className="news-search">
          <input
            type="text"
            placeholder="Tìm kiếm tin tức..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page
            }}
            className="news-search-input"
          />
        </div>
      </div>

      {currentNews.length === 0 ? (
        <div className="news-list-empty">
          {searchTerm ? "Không tìm thấy tin tức nào phù hợp." : "Chưa có tin tức nào."}
        </div>
      ) : (
        <>
          <div className="news-list-grid">
            {currentNews.map((news) => (
              <Link
                key={news.id}
                to={`/news/${news.id}`}
                className="news-card-link"
                state={{ news }}
              >
                <article className="news-card">
                  <div className="news-card-image">
                    <img
                      src={getImageUrl(news.image)}
                      alt={news.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/default-news.jpg';
                      }}
                    />
                    <div className="news-card-date">
                      {new Date(news.postingDate).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <div className="news-card-content">
                    <h3 className="news-card-title">{news.name}</h3>
                    <p className="news-card-description">
                      {news.description}
                    </p>
                    <div className="news-card-excerpt">
                      {extractText(news.content)}
                    </div>
                    <div className="news-card-meta">
                      <span className="news-views">
                        <i className="bi bi-eye"></i> {news.viewCount || 0} lượt xem
                      </span>
                      <span className="news-read-more">
                        Đọc thêm <i className="bi bi-arrow-right"></i>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="news-pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <i className="bi bi-chevron-left"></i> Trước
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Sau <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsList;

