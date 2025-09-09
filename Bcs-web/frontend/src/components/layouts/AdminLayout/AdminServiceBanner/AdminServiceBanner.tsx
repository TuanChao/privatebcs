import React, { useEffect, useState } from "react";
import AdminLayout from "src/components/layouts/AdminLayout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUpload from "../common/ImageUpload";
import { getImageUrl } from "../../../../utils/api";
import "./AdminSerViceBanner.css";

// Helper function for authenticated API calls
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };
};

type ServiceBanner = {
  id: string;
  name: string;
  description: string;
  image: string;
  content: string;
  postingDate: string;
  viewCount?: number;
};

const emptyServiceBanner: ServiceBanner = {
  id: "",
  name: "",
  description: "",
  image: "",
  content: "",
  postingDate: "",
};

function shortDesc(desc: string, max = 60) {
  if (!desc) return "";
  const div = document.createElement("div");
  div.innerHTML = desc;
  const text = div.textContent || div.innerText || "";
  return text.length > max ? text.slice(0, max) + "..." : text;
}

const AdminServiceBanner: React.FC = () => {
  const [serviceBannerList, setServiceBannerList] = useState<ServiceBanner[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ServiceBanner>(emptyServiceBanner);
  const [confirmDelete, setConfirmDelete] = useState<ServiceBanner | null>(null);
  const [viewServiceBanner, setViewServiceBanner] = useState<ServiceBanner | null>(null);
  const [search, setSearch] = useState("");

  // Lấy danh sách service banner
  const fetchServiceBanners = () => {
    setLoading(true);
    fetch("/api/Manage/CsServiceBanner", {
      headers: getAuthHeaders()
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setServiceBannerList(Array.isArray(data) ? data : data.data || []);
      })
      .catch((error) => {
        alert('Có lỗi khi tải dữ liệu: ' + error.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServiceBanners();
  }, []);

  // Thêm mới
  const handleAdd = () => {
    setEditing({ ...emptyServiceBanner, postingDate: new Date().toISOString() });
    setShowModal(true);
  };

  // Sửa
  const handleEdit = (serviceBanner: ServiceBanner) => {
    setEditing(serviceBanner);
    setShowModal(true);
  };

  // Xóa
  const handleDelete = (serviceBanner: ServiceBanner) => {
    setConfirmDelete(serviceBanner);
  };

  const confirmDeleteServiceBanner = () => {
    if (!confirmDelete) return;
    setLoading(true);
    fetch(`/api/Manage/CsServiceBanner/${confirmDelete.id}`, { 
      method: "DELETE",
      headers: getAuthHeaders()
    })
      .then(() => {
        setServiceBannerList((list) => list.filter((p) => p.id !== confirmDelete.id));
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
      ? `/api/Manage/CsServiceBanner/${editing.id}`
      : "/api/Manage/CsServiceBanner";
    
    fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(editing),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!data || !data.id) {
          setShowModal(false);
          setLoading(false);
          fetchServiceBanners();
          return;
        }
        if (editing.id) {
          setServiceBannerList((list) =>
            list.map((p) => (p.id === editing.id ? data : p))
          );
        } else {
          setServiceBannerList((list) => [data, ...list]);
        }
        setShowModal(false);
      })
      .catch((error) => {
        console.error('Error saving ServiceBanner:', error);
        alert('Có lỗi xảy ra khi lưu: ' + error.message);
        setShowModal(false);
      })
      .finally(() => setLoading(false));
  };

  // Lọc service banner theo tên hoặc mô tả
  const filteredServiceBanners = serviceBannerList.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="admin-service-banner-root">
        <h2>Quản lý Service Banner</h2>
        <input
          type="text"
          placeholder="Tìm kiếm service banner..."
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
        <button className="btn-add-service-banner" onClick={handleAdd}>
          + Thêm Service Banner
        </button>
        <table className="admin-service-banner-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Service Banner</th>
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
            ) : filteredServiceBanners.length === 0 ? (
              <tr>
                <td colSpan={8}>Không có dữ liệu</td>
              </tr>
            ) : (
              filteredServiceBanners.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setViewServiceBanner(p)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{shortDesc(p.description)}</td>
                  <td>
                    {p.image && (
                      <img
                        src={getImageUrl(p.image)}
                        alt="service banner"
                        style={{ width: 60, height: 40, objectFit: "cover" }}
                      />
                    )}
                  </td>
                  <td>
                    <div dangerouslySetInnerHTML={{ __html: shortDesc(p.content) }} />
                  </td>
                  <td>{new Date(p.postingDate).toLocaleString()}</td>
                  <td>{p.viewCount ?? 0}</td>
                  <td>
                    <button onClick={e => { e.stopPropagation(); handleEdit(p); }}>Sửa</button>
                    <button className="delete-btn" onClick={e => { e.stopPropagation(); handleDelete(p); }}>Xóa</button>
                    <button onClick={e => { e.stopPropagation(); setViewServiceBanner(p); }}>Chi tiết</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal thêm/sửa */}
      {showModal && (
        <ServiceBannerFormModal
          serviceBanner={editing}
          setServiceBanner={setEditing}
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
            <p>Bạn chắc chắn muốn xóa service banner này?</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="delete-btn" onClick={confirmDeleteServiceBanner}>Xóa</button>
              <button onClick={() => setConfirmDelete(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết service banner */}
      {viewServiceBanner && (
        <div className="modal-overlay" onClick={() => setViewServiceBanner(null)}>
          <div className="modal-content" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <h2>{viewServiceBanner.name}</h2>
            <p><b>Mô tả:</b> {viewServiceBanner.description}</p>
            {viewServiceBanner.image && (
              <img
                src={getImageUrl(viewServiceBanner.image)}
                alt="service banner"
                style={{ width: "100%", maxWidth: 400, borderRadius: 8, margin: "10px 0" }}
              />
            )}
            <div style={{ margin: "10px 0" }}>
              <b>Nội dung:</b>
              <div
                className="service-banner-content-detail"
                dangerouslySetInnerHTML={{ __html: viewServiceBanner.content }}
              />
            </div>
            <div>
              <b>Ngày đăng:</b> {viewServiceBanner.postingDate ? new Date(viewServiceBanner.postingDate).toLocaleString() : ""}
            </div>
            <button style={{ marginTop: 16 }} onClick={() => setViewServiceBanner(null)}>Đóng</button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminServiceBanner;

function ServiceBannerFormModal({
  serviceBanner,
  setServiceBanner,
  onSubmit,
  onClose,
  loading,
  isEdit = false,
}: {
  serviceBanner: ServiceBanner;
  setServiceBanner: React.Dispatch<React.SetStateAction<ServiceBanner>>;
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
    <div className="service-banner-detail-modal" onClick={onClose}>
      <div className="service-banner-detail-card" onClick={e => e.stopPropagation()}>
        <h2>{isEdit ? "Sửa Service Banner" : "Thêm Service Banner"}</h2>
        {isEdit && (
          <div className="service-banner-modal-title">
            {serviceBanner.name || "Chưa có tên service banner"}
          </div>
        )}
        <form className="admin-service-banner-form" onSubmit={onSubmit}>
          <label>
            Tên Service Banner
            <input
              type="text"
              value={serviceBanner.name || ""}
              onChange={e => setServiceBanner(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </label>
          <label>
            Mô tả
            <input
              type="text"
              value={serviceBanner.description || ""}
              onChange={e => setServiceBanner(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </label>
          <label>
            Ảnh đại diện
            <ImageUpload
              value={serviceBanner.image}
              onChange={url => setServiceBanner(prev => ({ ...prev, image: url }))}
              uploadApi="/api/Manage/Image"
            />
          </label>
          <label>
            Nội dung
            <ReactQuill
              theme="snow"
              value={serviceBanner.content || ""}
              onChange={val => setServiceBanner(prev => ({ ...prev, content: val }))}
              modules={quillModules}
            />
          </label>
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {isEdit ? "Lưu" : "Thêm Service Banner"}
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

