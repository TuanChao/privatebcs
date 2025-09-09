import React, { useEffect, useState } from "react";
import './new.css';
import { Link } from "react-router-dom";
import NewsBanner from "./NewsBanner";

interface NewsPageProps {
    limit?: number;
}

type News = {
    image: string;
    id: string; // Backend trả về string
    name: string;
    description: string;
    content: string; // Thêm content
    postingDate: string;
    viewCount?: number;
    isActive?: boolean; // Thêm isActive để hiển thị trạng thái
};

const articlesPerPage = 6; // Số bài viết trên mỗi trang

const NewsPageProduct: React.FC<NewsPageProps> = ({ limit }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [newsArticles, setNewsArticles] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch("/api/Manage/News/Public") // Dùng endpoint public để hiện tin tức công khai
            .then(res => res.json())
            .then(data => setNewsArticles(Array.isArray(data) ? data : data.data || []))
            .finally(() => setLoading(false));
    }, []);

    const sortedArticles = newsArticles
      .sort((a, b) => new Date(b.postingDate).getTime() - new Date(a.postingDate).getTime()); // Sửa lại: bài mới nhất lên đầu

    const totalArticles = limit ? Math.min(sortedArticles.length, limit) : sortedArticles.length;
    const totalPages = Math.ceil(totalArticles / articlesPerPage);

    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const displayedArticles = sortedArticles.slice(startIndex, endIndex);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="news-root">
            <div className="news-page">
                <NewsBanner/>
                <div className="news-container">
                    {loading ? (
                        <div style={{ textAlign: "center", width: "100%" }}>Đang tải dữ liệu...</div>
                    ) : displayedArticles.length === 0 ? (
                        <div style={{ textAlign: "center", width: "100%" }}>Không có bài viết nào.</div>
                    ) : (
                        displayedArticles.map((article) => (
                            <Link to={`/news/${article.id}`} className="news-link" key={article.id}>
                                <div className="news-article">
                                    <img className="article-img" src={article.image} alt={article.name} loading="lazy" />
                                    <div style={{ flex: 1, position: "relative" }}>
                                        <h2 className="article-name">{article.name}</h2>
                                        <p className="article-description">{article.description}</p>
                                        {/* <div className="article-status">
                                          <span className={`status-badge ${article.isActive ? 'active' : 'inactive'}`}>
                                            {article.isActive ? 'Hiển thị' : 'Ẩn'}
                                          </span>
                                        </div> */}
                                        <div className="article-footer">
                                          <span className="article-date">
                                            {article.postingDate
                                              ? new Date(article.postingDate).toLocaleString("vi-VN", {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                  day: "2-digit",
                                                  month: "2-digit",
                                                  year: "numeric",
                                              })
                                              : ""}
                                          </span>
                                          <span className="article-views">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="18"
                                              height="18"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              style={{ verticalAlign: "middle", marginRight: 6, marginBottom: 2 }}
                                            >
                                              <path
                                                d="M1.5 12S5.5 5.5 12 5.5 22.5 12 22.5 12 18.5 18.5 12 18.5 1.5 12 1.5 12Z"
                                                stroke="#888"
                                                strokeWidth="2"
                                                fill="none"
                                              />
                                              <circle
                                                cx="12"
                                                cy="12"
                                                r="3"
                                                stroke="#888"
                                                strokeWidth="2"
                                                fill="none"
                                              />
                                            </svg>
                                            {typeof article.viewCount === "number" ? article.viewCount : ""}
                                          </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
                {/* Pagination Controls */}
                <div className="pagination">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 1}
                        className="page-button"
                    >
                        Prev
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button 
                            key={index} 
                            onClick={() => handlePageChange(index + 1)}
                            className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                        className="page-button"
                    >
                        Next
                    </button>
                </div>
                <div className="news-footer">
                    &copy; 2025 News Company
                </div>
            </div>
        </div>
    );
};

export default NewsPageProduct;
