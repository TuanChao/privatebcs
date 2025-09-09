import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ArticleSection.css"

type News = {
    id: number;
    name: string;
    title: string;
    content: string;
    image?: string;
    viewCount?: number;      // Thêm trường này
    postingDate?: string;    // Thêm trường này
};

const EmployeeList: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [newsItem, setNewsItem] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
  setLoading(true);
  fetch(`/api/Manage/News/${id}`)   // ← sửa lại đường dẫn
    .then(res => res.json())
    .then(data => setNewsItem(data))
    .finally(() => setLoading(false));
}, [id]);

    if (loading) return <div>Đang tải dữ liệu...</div>;
    if (!newsItem) return <div>Không tìm thấy bài viết</div>;

    return (
        <div className="employee">
            <h1 className="news-name">{newsItem.name}</h1>
            <h3 className="news-title">{newsItem.title}</h3>
            <div className="news-content" style={{position: "relative"}} dangerouslySetInnerHTML={{ __html: newsItem.content }} />
            <div className="news-meta">
                <span className="news-meta-views">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" style={{verticalAlign: "middle", marginRight: 6, marginBottom: 2}}>
                        <path d="M1.5 12S5.5 5.5 12 5.5 22.5 12 22.5 12 18.5 18.5 12 18.5 1.5 12 1.5 12Z" stroke="#888" strokeWidth="2" fill="none"/>
                        <circle cx="12" cy="12" r="3" stroke="#888" strokeWidth="2" fill="none"/>
                    </svg>
                    {newsItem.viewCount ?? 0}
                </span>
                <span className="news-meta-date">
                  {newsItem.postingDate
                    ? parseVNDate(newsItem.postingDate).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : ""}
                </span>
            </div>
        </div>
    );
};

function parseVNDate(dateStr: string) {
  const d = new Date(dateStr);
  return new Date(d.getTime() + 7 * 60 * 60 * 1000);
}

export default EmployeeList;