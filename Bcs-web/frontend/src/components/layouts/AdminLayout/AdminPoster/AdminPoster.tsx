import React, { useEffect, useState } from "react";
import AdminLayout from "src/components/layouts/AdminLayout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./AdminPoster.css";
import ImageUpload from "../common/ImageUpload";
import { getImageUrl } from "../../../../utils/api";
import { sanitizeHtml, extractTextFromHtml } from "../../../../utils/htmlSanitizer";

type Poster = {
  id: string;
  name: string;
  description: string;
  image: string;
  content: string;
  postingDate: string;
  viewCount?: number;
};

const emptyPoster: Poster = {
  id: "",
  name: "",
  description: "",
  image: "",
  content: "",
  postingDate: "",
};

// Remove the unsafe shortDesc function, use sanitizer instead

const AdminPoster: React.FC = () => {
  const [posterList, setPosterList] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Poster>(emptyPoster);
  const [confirmDelete, setConfirmDelete] = useState<Poster | null>(null);
  const [viewPoster, setViewPoster] = useState<Poster | null>(null);
  const [search, setSearch] = useState("");

  // Helper function to create authorized fetch options
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  };

  // Lấy danh sách poster
  const fetchPosters = () => {
    setLoading(true);
    fetch("/api/Manage/Poster/Public", {
      headers: getAuthHeaders()
    })
      .then((res) => res.json())
      .then((data) => setPosterList(Array.isArray(data) ? data : data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosters();
  }, []);

  // Thêm mới
  const handleAdd = () => {
    setEditing({ ...emptyPoster, postingDate: new Date().toISOString() });
    setShowModal(true);
  };

  // Sửa
  const handleEdit = (poster: Poster) => {
    setEditing(poster);
    setShowModal(true);
  };

  // Xóa
  const handleDelete = (poster: Poster) => {
    setConfirmDelete(poster);
  };

  const confirmDeletePoster = () => {
    if (!confirmDelete) return;
    setLoading(true);
    fetch(`/api/Manage/Poster/${confirmDelete.id}`, { 
      method: "DELETE",
      headers: getAuthHeaders()
    })
      .then(() => {
        setPosterList((list) => list.filter((p) => p.id !== confirmDelete.id));
        setConfirmDelete(null);
      })
      .finally(() => setLoading(false));
  };

  // Lưu (thêm/sửa)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = editing.id ? "PUT" : "POST";
    const url = editing.id
      ? `/api/Manage/Poster/${editing.id}`
      : "/api/Manage/Poster";
    fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(editing),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.id) {
          setShowModal(false);
          setLoading(false);
          fetchPosters();
          return;
        }
        if (editing.id) {
          setPosterList((list) =>
            list.map((p) => (p.id === editing.id ? data : p))
          );
        } else {
          setPosterList((list) => [data, ...list]);
        }
        setShowModal(false);
      })
      .catch(() => {
        setShowModal(false);
      })
      .finally(() => setLoading(false));
  };

  // Lọc poster theo tên hoặc mô tả
  const filteredPosters = posterList.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="admin-poster-root">
        <h2>Quản lý Poster</h2>
        <input
          type="text"
          placeholder="Tìm kiếm poster..."
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
        <button className="btn-add-poster" onClick={handleAdd}>
          + Thêm Poster
        </button>
        <table className="admin-poster-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Poster</th>
              <th>Mô tả</th>
              <th>Ảnh</th>
              <th>Nội dung</th>
              <th>Ngày đăng</th>
              <th>Lượt xem</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8}>Đang tải...</td>
              </tr>
            ) : filteredPosters.length === 0 ? (
              <tr>
                <td colSpan={8}>Không có dữ liệu</td>
              </tr>
            ) : (
              filteredPosters.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setViewPoster(p)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{extractTextFromHtml(p.description)}</td>
                  <td>
                    {p.image && (
                      <img
                        src={getImageUrl(p.image)}
                        alt="poster"
                        style={{ width: 60, height: 40, objectFit: "cover" }}
                      />
                    )}
                  </td>
                  <td>
                    <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(extractTextFromHtml(p.content)) }} />
                  </td>
                  <td>{new Date(p.postingDate).toLocaleString()}</td>
                  <td>{p.viewCount ?? 0}</td>
                  <td>
                    <button onClick={e => { e.stopPropagation(); handleEdit(p); }}>Sửa</button>
                    <button className="delete-btn" onClick={e => { e.stopPropagation(); handleDelete(p); }}>Xóa</button>
                    <button onClick={e => { e.stopPropagation(); setViewPoster(p); }}>Chi tiết</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal thêm/sửa */}
      {showModal && (
        <PosterFormModal
          poster={editing}
          setPoster={setEditing}
          onSubmit={handleSave}
          onClose={() => setShowModal(false)}
          loading={loading}
          isEdit={!!editing.id}
        />
      )}

      {/* Modal xác nhận xóa */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Bạn chắc chắn muốn xóa poster này?</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="delete-btn" onClick={confirmDeletePoster}>Xóa</button>
              <button onClick={() => setConfirmDelete(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết poster */}
      {viewPoster && (
        <div className="modal-overlay" onClick={() => setViewPoster(null)}>
          <div className="modal-content" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <h2>{viewPoster.name}</h2>
            <p><b>Mô tả:</b> {viewPoster.description}</p>
            {viewPoster.image && (
              <img
                src={getImageUrl(viewPoster.image)}
                alt="poster"
                style={{ width: "100%", maxWidth: 400, borderRadius: 8, margin: "10px 0" }}
              />
            )}
            <div style={{ margin: "10px 0" }}>
              <b>Nội dung:</b>
              <div
                className="poster-content-detail"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(viewPoster.content) }}
              />
            </div>
            <div>
              <b>Ngày đăng:</b> {viewPoster.postingDate ? new Date(viewPoster.postingDate).toLocaleString() : ""}
            </div>
            <button style={{ marginTop: 16 }} onClick={() => setViewPoster(null)}>Đóng</button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPoster;

function PosterFormModal({
  poster,
  setPoster,
  onSubmit,
  onClose,
  loading,
  isEdit = false,
}: {
  poster: Poster;
  setPoster: React.Dispatch<React.SetStateAction<Poster>>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  loading: boolean;
  isEdit?: boolean;
}) {
  const quillModules = {
    toolbar: [
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
  };

  return (
    <div className="poster-detail-modal" onClick={onClose}>
      <div className="poster-detail-card" onClick={e => e.stopPropagation()}>
        <h2>{isEdit ? "Sửa Poster" : "Thêm Poster"}</h2>
        {isEdit && (
          <div className="poster-modal-title">
            {poster.name || "Chưa có tên poster"}
          </div>
        )}
        <form className="admin-poster-form" onSubmit={onSubmit}>
          <label>
            Tên Poster
            <input
              type="text"
              value={poster.name || ""}
              onChange={e => setPoster(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </label>
          <label>
            Mô tả
            <input
              type="text"
              value={poster.description || ""}
              onChange={e => setPoster(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </label>
          <label>
            Ảnh đại diện
            <ImageUpload
              value={poster.image}
              onChange={url => setPoster(prev => ({ ...prev, image: url }))}
              uploadApi="/api/Manage/Image"
            />
          </label>
          <label>
            Nội dung
            <ReactQuill
              theme="snow"
              value={poster.content || ""}
              onChange={val => setPoster(prev => ({ ...prev, content: val }))}
              modules={quillModules}
            />
          </label>
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {isEdit ? "Lưu" : "Thêm Poster"}
            </button>
            <button type="button" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
