import React, { useEffect, useState, useCallback } from "react";
import AdminLayout from "src/components/layouts/AdminLayout";
import "./AdminNews.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUpload from "../common/ImageUpload";
import { sanitizeHtml, extractTextFromHtml } from "../../../../utils/htmlSanitizer";

// Helper function for authenticated API calls
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };
};

// Định nghĩa type News
type News = {
  id: string;
  name: string;
  description: string;
  image: string;
  content: string;
  postingDate: string;
  viewCount?: number;
  isActive?: boolean; // Sử dụng trường isActive từ Backend
};

// Custom image handler cho ReactQuill
const imageHandler = () => {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    const file = input.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const token = localStorage.getItem("token");
        const res = await fetch('/api/Manage/Image', {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        });
        const data = await res.json();
        
        // Chèn ảnh vào ReactQuill bằng url từ server
        const quill = (window as any).quillInstance;
        if (quill) {
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', data.url);
        }
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };
};

// Toolbar cho ReactQuill với custom image handler
const quillModules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ font: [] }, { size: [] }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
    handlers: {
      image: imageHandler
    }
  },
};

// Removed unsafe extractTextFromHTML function - using sanitizer instead

function shortDesc(desc: string, maxLength = 40) {
  return desc.length > maxLength ? desc.slice(0, maxLength) + "..." : desc;
}

// Modal chi tiết news
function NewsDetailModal({ news, onClose }: { news: News; onClose: () => void }) {
  return (
    <div className="new-detail-modal" onClick={onClose}>
      <div className="new-detail-card" onClick={e => e.stopPropagation()}>
        <h2>Chi tiết Tin tức</h2>
        <img
          src={news.image}
          alt="news"
          style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 8, marginBottom: 16 }}
        />
        <ul style={{ textAlign: "left" }}>
          <li><b>ID:</b> {news.id}</li>
          <li><b>Tiêu đề:</b> {news.name}</li>
          <li><b>Mô tả:</b> {news.description}</li>
          <li><b>Ngày đăng:</b> {new Date(news.postingDate).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}</li>
        </ul>
        <div>
          <b>Nội dung:</b>
          <div className="news-content-detail" dangerouslySetInnerHTML={{ __html: sanitizeHtml(news.content) }} />
        </div>
      </div>
    </div>
  );
}

// Modal thêm/sửa News
function NewsFormModal({
  news,
  setNews,
  onSubmit,
  onClose,
  loading,
  isEdit = false,
}: {
  news: News;
  setNews: React.Dispatch<React.SetStateAction<News>>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  loading: boolean;
  isEdit?: boolean;
}) {
  const quillRef = React.useRef<ReactQuill>(null);

  React.useEffect(() => {
    if (quillRef.current) {
      (window as any).quillInstance = quillRef.current.getEditor();
    }
  }, []);

  return (
    <div className="new-detail-modal" onClick={onClose}>
      <div className="new-detail-card" onClick={e => e.stopPropagation()}>
        <h2>{isEdit ? "Sửa Tin tức" : "Thêm Tin tức"}</h2>
        <form className="admin-news-form" onSubmit={onSubmit}>
          <label>
            Tiêu đề
            <input
              type="text"
              name="name"
              value={news.name}
              onChange={e => setNews(prev => ({ ...prev, name: e.target.value }))}
              required
              disabled={loading}
            />
          </label>
          <label>
            Mô tả
            <input
              type="text"
              name="description"
              value={news.description}
              onChange={e => setNews(prev => ({ ...prev, description: e.target.value }))}
              disabled={loading}
            />
          </label>
          <label>
            Ảnh đại diện
            <ImageUpload
              value={news.image}
              onChange={(url) =>
                setNews((prev) => ({
                  ...prev,
                  image: url,
                }))
              }
              uploadApi="/api/Manage/Image"
            />
          </label>
          <label>
            Nội dung
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={news.content}
              onChange={value => setNews(prev => ({ ...prev, content: value }))}
              modules={quillModules}
              style={{ background: "#f8fafc", color: "#181c23", borderRadius: 7 }}
              readOnly={loading}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={news.isActive ?? true}
              onChange={e => setNews(prev => ({ ...prev, isActive: e.target.checked }))}
              disabled={loading}
            />
            Hiển thị tin tức này
          </label>
          <div className="form-actions">
            <button type="submit" disabled={loading || loading}>
              {isEdit ? "Lưu" : "Thêm Tin tức"}
            </button>
            <button type="button" onClick={onClose} disabled={loading || loading}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const emptyNews: News = {
  id: "",
  name: "",
  description: "",
  image: "",
  content: "",
  postingDate: new Date().toISOString()
};

const AdminNews: React.FC = () => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [newNews, setNewNews] = useState<News>({ ...emptyNews });
  const [showAddNews, setShowAddNews] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewNews, setViewNews] = useState<News | null>(null);
  const [search, setSearch] = useState("");

  // Fetch danh sách news
  const fetchNews = useCallback(() => {
    fetch("/api/Manage/News/Public", {
      headers: getAuthHeaders()
    })
      .then(res => res.json())
      .then(data => {
        setNewsList(Array.isArray(data) ? data : data.data || []);
      });
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Thêm mới
  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/Manage/News", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ ...newNews, postingDate: new Date().toISOString() }),
    });
    fetchNews();
    setNewNews({ ...emptyNews });
    setShowAddNews(false);
    setLoading(false);
  };

  // Sửa
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;
    setLoading(true);
    await fetch(`/api/Manage/News/${editingNews.id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(editingNews),
    });
    fetchNews();
    setEditingNews(null);
    setLoading(false);
  };

  // Xóa
  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;
    setLoading(true);
    await fetch(`/api/Manage/News/${id}`, { 
      method: "DELETE",
      headers: getAuthHeaders()
    });
    fetchNews();
    setLoading(false);
  };

  // Toggle hiển thị tin tức
  const handleToggleVisible = async (id: string, currentIsActive: boolean) => {
    setLoading(true);
    const newsToUpdate = newsList.find(n => n.id === id);
    if (newsToUpdate) {
      await fetch(`/api/Manage/News/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...newsToUpdate, isActive: !currentIsActive }),
      });
      fetchNews();
    }
    setLoading(false);
  };

  // Lọc tin tức theo tiêu đề hoặc mô tả
  const filteredNews = newsList
    .filter(n =>
      (n.name.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => new Date(b.postingDate).getTime() - new Date(a.postingDate).getTime()); // Sửa lại: bài mới nhất lên đầu

  return (
    <AdminLayout>
      <div className="admin-poster-root">
        <h2>Quản lý Tin tức</h2>
        {/* Ô tìm kiếm */}
        <input
          type="text"
          placeholder="Tìm kiếm tin tức..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            marginBottom: 16,
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            minWidth: 220
          }}
        />
        <button
          className="btn-add-poster"
          onClick={() => setShowAddNews(true)}
          style={{ marginBottom: 18, marginLeft: 12 }}
          disabled={loading}
        >
          + Thêm Tin tức
        </button>

        {/* Table */}
        <table className="admin-poster-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Mô tả</th>
              <th>Ảnh</th>
              <th>Nội dung</th>
              <th>Ngày đăng</th>
              <th>Lượt xem</th>
              <th>Hiển thị</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center" }}>Đang tải dữ liệu...</td>
              </tr>
            ) : filteredNews.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center" }}>Không có dữ liệu</td>
              </tr>
            ) : (
              filteredNews.map(n => (
                <tr
                  key={n.id}
                  onClick={() => setViewNews(n)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{n.id}</td>
                  <td>{n.name || "Không có tiêu đề"}</td>
                  <td>{shortDesc(n.description)}</td>
                  <td>
                    <img
                      src={n.image}
                      alt="news"
                      style={{ width: 60, height: 40, objectFit: "cover" }}
                    />
                  </td>
                  <td>
                    <div>{extractTextFromHtml(n.content)}</div>
                  </td>
                  <td>
                    {parseVNDate(n.postingDate).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td>{n.viewCount ?? 0}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={n.isActive ?? true}
                      onChange={() => handleToggleVisible(n.id, n.isActive ?? true)}
                      disabled={loading}
                      onClick={e => e.stopPropagation()}
                      style={{ cursor: "pointer", transform: "scale(1.2)" }}
                    />
                  </td>
                  <td>
                    <button
                      onClick={e => { e.stopPropagation(); setEditingNews(n); }}
                      disabled={loading}
                    >Sửa</button>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(n.id); }}
                      disabled={loading}
                    >Xóa</button>
                    <button
                      onClick={e => { e.stopPropagation(); setViewNews(n); }}
                      disabled={loading}
                    >Chi tiết</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Modal thêm mới */}
        {showAddNews && (
          <NewsFormModal
            news={newNews}
            setNews={setNewNews}
            onSubmit={handleAddNews}
            onClose={() => setShowAddNews(false)}
            loading={loading}
          />
        )}

        {/* Modal sửa */}
        {editingNews && (
          <NewsFormModal
            news={editingNews}
            setNews={setEditingNews as React.Dispatch<React.SetStateAction<News>>}
            onSubmit={handleSave}
            onClose={() => setEditingNews(null)}
            loading={loading}
            isEdit
          />
        )}

        {/* Modal chi tiết */}
        {viewNews && (
          <div className="user-detail-modal" onClick={() => setViewNews(null)}>
            <div className="user-detail-card" onClick={e => e.stopPropagation()}>
              <h2>Chi tiết tin tức</h2>
              <img
                src={viewNews.image}
                alt="news"
                style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 8, marginBottom: 16 }}
              />
              <div><b>ID:</b> {viewNews.id}</div>
              <div><b>Tiêu đề:</b> {viewNews.name}</div>
              <div><b>Mô tả:</b> {viewNews.description}</div>
              <div><b>Ngày đăng:</b> {new Date(viewNews.postingDate).toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}</div>
              <div>
                <b>Nội dung:</b>
                <div className="poster-content-detail" dangerouslySetInnerHTML={{ __html: sanitizeHtml(viewNews.content) }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminNews;

function parseVNDate(dateStr: string) {
  const d = new Date(dateStr);
  return new Date(d.getTime() + 7 * 60 * 60 * 1000);
}