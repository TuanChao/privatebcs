import React, { useEffect, useState } from "react";
import AdminLayout from "src/components/layouts/AdminLayout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import "./AdminPoster.css";
import ImageUpload from "../common/ImageUpload";
import { getImageUrl } from "../../../../utils/api";
import "./AdminProductBanner.css";
import { sanitizeHtml, extractTextFromHtml } from "../../../../utils/htmlSanitizer";

// Helper function for authenticated API calls
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };
};

type ProductBanner = {
  id: string;
  name: string;
  description: string;
  image: string;
  content: string;
  postingDate: string;
  viewCount?: number;
};

const emptyProductBanner: ProductBanner = {
  id: "",
  name: "",
  description: "",
  image: "",
  content: "",
  postingDate: "",
};

// Removed unsafe shortDesc function - using sanitizer instead

const AdminProductBanner: React.FC = () => {
  const [productBannerList, setProductBannerList] = useState<ProductBanner[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ProductBanner>(emptyProductBanner);
  const [confirmDelete, setConfirmDelete] = useState<ProductBanner | null>(null);
  const [viewProductBanner, setViewProductBanner] = useState<ProductBanner | null>(null);
  const [search, setSearch] = useState("");

  // Lấy danh sách product banner
  const fetchProductBanners = () => {
    setLoading(true);
    // console.log('Fetching ProductBanners...');
    fetch("/api/Manage/ProductBanner/Public", {
      headers: getAuthHeaders()
    })
      .then((res) => {
        // console.log('Fetch response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // console.log('Fetched ProductBanner data:', data);
        setProductBannerList(Array.isArray(data) ? data : data.data || []);
      })
      .catch((error) => {
        console.error('Error fetching ProductBanners:', error);
        alert('Có lỗi khi tải dữ liệu: ' + error.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProductBanners();
  }, []);

  // Thêm mới
  const handleAdd = () => {
    setEditing({ ...emptyProductBanner, postingDate: new Date().toISOString() });
    setShowModal(true);
  };

  // Sửa
  const handleEdit = (productBanner: ProductBanner) => {
    setEditing(productBanner);
    setShowModal(true);
  };

  // Xóa
  const handleDelete = (productBanner: ProductBanner) => {
    setConfirmDelete(productBanner);
  };

  const confirmDeleteProductBanner = () => {
    if (!confirmDelete) return;
    setLoading(true);
    fetch(`/api/Manage/ProductBanner/${confirmDelete.id}`, { 
      method: "DELETE",
      headers: getAuthHeaders()
    })
      .then(() => {
        setProductBannerList((list) => list.filter((p) => p.id !== confirmDelete.id));
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
      ? `/api/Manage/ProductBanner/${editing.id}`
      : "/api/Manage/ProductBanner";
    
    console.log('Saving ProductBanner:', {
      method,
      url,
      data: editing
    });

    fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(editing),
    })
      .then((res) => {
        console.log('Response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Response data:', data);
        if (!data || !data.id) {
          setShowModal(false);
          setLoading(false);
          fetchProductBanners();
          return;
        }
        if (editing.id) {
          setProductBannerList((list) =>
            list.map((p) => (p.id === editing.id ? data : p))
          );
        } else {
          setProductBannerList((list) => [data, ...list]);
        }
        setShowModal(false);
      })
      .catch((error) => {
        console.error('Error saving ProductBanner:', error);
        alert('Có lỗi xảy ra khi lưu: ' + error.message);
        setShowModal(false);
      })
      .finally(() => setLoading(false));
  };

  // Lọc product banner theo tên hoặc mô tả
  const filteredProductBanners = productBannerList.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="admin-poster-root">
        <h2>Quản lý Product Banner</h2>
        <input
          type="text"
          placeholder="Tìm kiếm product banner..."
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
          + Thêm Product Banner
        </button>
        <table className="admin-poster-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Product Banner</th>
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
            ) : filteredProductBanners.length === 0 ? (
              <tr>
                <td colSpan={8}>Không có dữ liệu</td>
              </tr>
            ) : (
              filteredProductBanners.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setViewProductBanner(p)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{extractTextFromHtml(p.description)}</td>
                  <td>
                    {p.image && (
                      <img
                        src={getImageUrl(p.image)}
                        alt="product banner"
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
                    <button onClick={e => { e.stopPropagation(); setViewProductBanner(p); }}>Chi tiết</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal thêm/sửa */}
      {showModal && (
        <ProductBannerFormModal
          productBanner={editing}
          setProductBanner={setEditing}
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
            <p>Bạn chắc chắn muốn xóa product banner này?</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="delete-btn" onClick={confirmDeleteProductBanner}>Xóa</button>
              <button onClick={() => setConfirmDelete(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết product banner */}
      {viewProductBanner && (
        <div className="modal-overlay" onClick={() => setViewProductBanner(null)}>
          <div className="modal-content" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <h2>{viewProductBanner.name}</h2>
            <p><b>Mô tả:</b> {viewProductBanner.description}</p>
            {viewProductBanner.image && (
              <img
                src={getImageUrl(viewProductBanner.image)}
                alt="product banner"
                style={{ width: "100%", maxWidth: 400, borderRadius: 8, margin: "10px 0" }}
              />
            )}
            <div style={{ margin: "10px 0" }}>
              <b>Nội dung:</b>
              <div
                className="poster-content-detail"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(viewProductBanner.content) }}
              />
            </div>
            <div>
              <b>Ngày đăng:</b> {viewProductBanner.postingDate ? new Date(viewProductBanner.postingDate).toLocaleString() : ""}
            </div>
            <button style={{ marginTop: 16 }} onClick={() => setViewProductBanner(null)}>Đóng</button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProductBanner;

function ProductBannerFormModal({
  productBanner,
  setProductBanner,
  onSubmit,
  onClose,
  loading,
  isEdit = false,
}: {
  productBanner: ProductBanner;
  setProductBanner: React.Dispatch<React.SetStateAction<ProductBanner>>;
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
        <h2>{isEdit ? "Sửa Product Banner" : "Thêm Product Banner"}</h2>
        {isEdit && (
          <div className="poster-modal-title">
            {productBanner.name || "Chưa có tên product banner"}
          </div>
        )}
        <form className="admin-poster-form" onSubmit={onSubmit}>
          <label>
            Tên Product Banner
            <input
              type="text"
              value={productBanner.name || ""}
              onChange={e => setProductBanner(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </label>
          <label>
            Mô tả
            <input
              type="text"
              value={productBanner.description || ""}
              onChange={e => setProductBanner(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </label>
          <label>
            Ảnh đại diện
            <ImageUpload
              value={productBanner.image}
              onChange={url => setProductBanner(prev => ({ ...prev, image: url }))}
              uploadApi="/api/Manage/Image"
            />
          </label>
          <label>
            Nội dung
            <ReactQuill
              theme="snow"
              value={productBanner.content || ""}
              onChange={val => setProductBanner(prev => ({ ...prev, content: val }))}
              modules={quillModules}
            />
          </label>
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {isEdit ? "Lưu" : "Thêm Product Banner"}
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
