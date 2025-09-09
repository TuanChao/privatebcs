import React, { useEffect, useState } from "react";
import AdminLayout from "src/components/layouts/AdminLayout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./AdminService.css";
import ImageUpload from "../common/ImageUpload";
import { getImageUrl } from "../../../../utils/api";
import { sanitizeHtml, extractTextFromHtml } from "../../../../utils/htmlSanitizer";

// Helper function for authenticated API calls
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };
};

type Service = {
  id: string;
  name: string;
  description: string;
  image: string;
  content: string;
  postingDate: string;
  viewCount?: number; 
  isActive?: boolean;
};

const emptyService: Service = {
  id: "",
  name: "",
  description: "",
  image: "",
  content: "",
  postingDate: "",
  viewCount: 0, 
  isActive: true,
};

// Removed unsafe shortDesc function - using sanitizer instead

const AdminService: React.FC = () => {
  const [serviceList, setServiceList] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service>(emptyService);
  const [confirmDelete, setConfirmDelete] = useState<Service | null>(null);
  const [viewService, setViewService] = useState<Service | null>(null);

  // Thêm state cho tìm kiếm
  const [search, setSearch] = useState("");

  // Chuẩn hoá fetch JSON (chống lỗi parse nếu body rỗng)
  const safeParseJSON = async (res: Response) => {
    const text = await res.text();
    try {
      return text ? JSON.parse(text) : null;
    } catch {
      return null;
    }
  };

  // Lấy danh sách dịch vụ
  const fetchServices = () => {
    setLoading(true);
    fetch("/api/Manage/CsService/Public", {
      headers: getAuthHeaders()
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Lỗi API: " + res.status);
        const data = await safeParseJSON(res);
        const arr = Array.isArray(data) ? data : data?.data || [];
        
        // Debug log để xem cấu trúc dữ liệu
        if (arr.length > 0) {
          // console.log("Service data sample:", arr[0]);
          if (arr[0].image) {
            // console.log("Image data type:", typeof arr[0].image);
            // console.log("Image data sample:", arr[0].image.substring(0, 100) + "...");
          }
        }
        
        return arr;
      })
      .then(setServiceList)
      .catch((err) => {
        console.error("Fetch service error:", err);
        setServiceList([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchServices, []);

  // Thêm mới
  const handleAdd = () => {
    setEditing({ ...emptyService, postingDate: new Date().toISOString() });
    setShowModal(true);
  };

  // Sửa
  const handleEdit = (service: Service) => {
    setEditing(service);
    setShowModal(true);
  };

  // Xóa
  const handleDelete = (service: Service) => {
    setConfirmDelete(service);
  };

  // Xác nhận xóa
  const confirmDeleteService = () => {
    if (!confirmDelete) return;
    setLoading(true);
    fetch(`/api/Manage/CsService/${confirmDelete.id}`, { 
      method: "DELETE",
      headers: getAuthHeaders()
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Không thể xóa dịch vụ!");
        }
        setServiceList((list) => list.filter((s) => s.id !== confirmDelete.id));
        setConfirmDelete(null);
      })
      .catch((err) => {
        alert("Lỗi: " + err.message);
        setConfirmDelete(null);
      })
      .finally(() => setLoading(false));
  };

  // Thêm/sửa (Save)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = editing.id ? "PUT" : "POST";
    const url = editing.id
      ? `/api/Manage/CsService/${editing.id}`
      : "/api/Manage/CsService";
    const body = editing.id
      ? { ...editing }
      : (({ id, ...rest }) => rest)(editing);

    fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Có lỗi xảy ra");
        }
        const data = await safeParseJSON(res);
        return data;
      })
      .then((data) => {
        if (data && typeof data === "object" && data.id) {
          setServiceList((list) =>
            editing.id
              ? list.map((s) => (s.id === editing.id ? data : s))
              : [data, ...list]
          );
        } else {
          fetchServices();
        }
        setShowModal(false);
      })
      .catch((err) => {
        alert("Lỗi: " + err.message);
        setShowModal(false);
      })
      .finally(() => setLoading(false));
  };

  // Lọc dịch vụ theo tên hoặc mô tả
  const filteredServices = serviceList.filter(
    s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="admin-service-root">
        <h2>Quản lý Dịch vụ</h2>
        {/* Ô tìm kiếm */}
        <input
          type="text"
          placeholder="Tìm kiếm dịch vụ..."
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
        <button className="btn-add-service" onClick={handleAdd}>
          + Thêm dịch vụ
        </button>
        <table className="admin-service-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên dịch vụ</th>
              <th>Mô tả</th>
              <th>Ảnh</th>
              <th>Nội dung</th>
              <th>Ngày đăng</th>
              <th>Lượt xem</th> {/* Thêm dòng này */}
              <th>Hành động</th>
            <th>Hiển thị</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8}>Đang tải...</td>
              </tr>
            ) : filteredServices.length === 0 ? (
              <tr>
                <td colSpan={8}>Không có dữ liệu</td>
              </tr>
            ) : (
              filteredServices.map((s) => (
                <tr
                  key={s.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setViewService(s)}
                >
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{extractTextFromHtml(s.description)}</td>
                  <td>
                    {s.image && (
                      <img
                        src={getImageUrl(s.image)}
                        alt="service"
                        style={{
                          maxWidth: 180,
                          maxHeight: 120,
                          objectFit: "cover",
                          marginTop: 8,
                          borderRadius: 6,
                          boxShadow: "0 2px 8px #0003",
                          display: "block",
                        }}
                        onError={(e) => {
                          console.log("Image load error for:", s.image);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                  </td>
                  <td>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(extractTextFromHtml(s.content)),
                      }}
                    />
                  </td>
                  <td>
                    {s.postingDate
                      ? new Date(s.postingDate).toLocaleString()
                      : ""}
                  </td>
                  <td>{s.viewCount ?? 0}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={s.isActive ?? true}
                      onClick={e => e.stopPropagation()}
                      onChange={e => {
                        setLoading(true);
                        fetch(`/api/Manage/CsService/${s.id}`, {
                          method: "PUT",
                          headers: getAuthHeaders(),
                          body: JSON.stringify({ ...s, isActive: e.target.checked })
                        })
                          .then(() => fetchServices())
                          .finally(() => setLoading(false));
                      }}
                      disabled={loading}
                      style={{ cursor: "pointer", transform: "scale(1.2)" }}
                    />
                  </td>
                  <td>
                    <button onClick={e => { e.stopPropagation(); handleEdit(s); }}>Sửa</button>
                    <button className="delete-btn" onClick={e => { e.stopPropagation(); handleDelete(s); }}>Xóa</button>
                    <button onClick={e => { e.stopPropagation(); setViewService(s); }}>Chi tiết</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal thêm/sửa */}
      {showModal && (
        <ServiceFormModal
          service={editing}
          setService={setEditing}
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
            <p>Bạn chắc chắn muốn xóa dịch vụ này?</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="delete-btn" onClick={confirmDeleteService}>
                Xóa
              </button>
              <button onClick={() => setConfirmDelete(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết dịch vụ */}
      {viewService && (
        <div className="modal-overlay" onClick={() => setViewService(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: 600 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="service-detail-modal">
              <div className="service-detail-card">
                <h2>{viewService.name}</h2>
                <p>
                  <b>Mô tả:</b> {viewService.description}
                </p>
                {viewService.image && (
                  <img
                    src={getImageUrl(viewService.image)}
                    alt="service"
                    style={{
                      width: "100%",
                      maxWidth: 400,
                      borderRadius: 8,
                      margin: "10px 0",
                    }}
                    onError={(e) => {
                      console.log("Image load error in modal for:", viewService.image);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div style={{ margin: "10px 0" }}>
                  <b>Nội dung:</b>
                  <div
                    className="service-detail-content"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(viewService.content) }}
                  />
                </div>
                <div>
                  <b>Ngày đăng:</b>{" "}
                  {viewService.postingDate
                    ? new Date(viewService.postingDate).toLocaleString()
                    : ""}
                </div>
                <button
                  style={{ marginTop: 16 }}
                  onClick={() => setViewService(null)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminService;

// --- Modal thêm/sửa ---
function ServiceFormModal({
  service,
  setService,
  onSubmit,
  onClose,
  loading,
  isEdit = false,
}: {
  service: Service;
  setService: React.Dispatch<React.SetStateAction<Service>>;
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
    <div className="service-detail-modal" onClick={onClose}>
      <div className="service-detail-card" onClick={(e) => e.stopPropagation()}>
        <h2>{isEdit ? "Sửa dịch vụ" : "Thêm dịch vụ"}</h2>
        {isEdit && (
          <div className="service-modal-title">
            {service.name || "Chưa có tên dịch vụ"}
          </div>
        )}
        <form className="admin-service-form" onSubmit={onSubmit}>
          <label>
            Tên dịch vụ
            <input
              type="text"
              value={service.name}
              onChange={(e) =>
                setService((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </label>
          <label>
            Mô tả
            <input
              type="text"
              value={service.description}
              onChange={(e) =>
                setService((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              required
            />
          </label>
          <label>
            Ảnh dịch vụ
            <ImageUpload
              value={service.image}
              onChange={(url) =>
                setService((prev) => ({
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
              theme="snow"
              value={service.content}
              onChange={(val) =>
                setService((prev) => ({ ...prev, content: val }))
              }
              modules={quillModules}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={service.isActive ?? true}
              onChange={e => setService(prev => ({ ...prev, isActive: e.target.checked }))}
              disabled={loading}
            />
            Hiển thị dịch vụ này
          </label>
          <div style={{ marginTop: 12 }}>
            <button type="submit" disabled={loading}>
              {isEdit ? "Lưu" : "Thêm dịch vụ"}
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
