import React, { useEffect, useState } from "react";
import AdminLayout from "src/components/layouts/AdminLayout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./AdminProduct.css";
import ImageUpload from "../common/ImageUpload";
import { getImageUrl } from "../../../../utils/api";

// Helper function for authenticated API calls
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };
};

type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  content: string;
  postingDate: string;
  viewCount?: number;
  pdf?: string;
  isActive?: boolean;
};

const emptyProduct: Product = {
  id: "",
  name: "",
  description: "",
  image: "",
  content: "",
  postingDate: "",
};

function shortDesc(desc: string, max = 60) {
  if (!desc) return "";
  // Nếu là HTML, loại bỏ thẻ
  const div = document.createElement("div");
  div.innerHTML = desc;
  const text = div.textContent || div.innerText || "";
  return text.length > max ? text.slice(0, max) + "..." : text;
}

const AdminProduct: React.FC = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product>(emptyProduct);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  // Thêm state cho tìm kiếm
  const [search, setSearch] = useState("");

  // Lấy danh sách sản phẩm
  const fetchProducts = () => {
    setLoading(true);
    fetch("/api/Manage/Product/Public", {
      headers: getAuthHeaders()
    })
      .then((res) => res.json())
      .then((data) => setProductList(Array.isArray(data) ? data : data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Thêm mới
  const handleAdd = () => {
    setEditing({ ...emptyProduct, postingDate: new Date().toISOString() });
    setShowModal(true);
  };

  // Sửa
  const handleEdit = (product: Product) => {
    setEditing(product);
    setShowModal(true);
  };

  // Xóa
  const handleDelete = (product: Product) => {
    setConfirmDelete(product);
  };

  const confirmDeleteProduct = () => {
    if (!confirmDelete) return;
    setLoading(true);
    fetch(`/api/Manage/Product/${confirmDelete.id}`, { 
      method: "DELETE",
      headers: getAuthHeaders()
    })
      .then(() => {
        setProductList((list) => list.filter((p) => p.id !== confirmDelete.id));
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
      ? `/api/Manage/Product/${editing.id}`
      : "/api/Manage/Product";
    fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(editing),
    })
      .then((res) => res.json())
      .then((data) => {
        // Kiểm tra dữ liệu trả về hợp lệ
        if (!data || !data.id) {
          setShowModal(false);
          setLoading(false);
          fetchProducts();
          return;
        }
        if (editing.id) {
          setProductList((list) =>
            list.map((p) => (p.id === editing.id ? data : p))
          );
        } else {
          setProductList((list) => [data, ...list]);
        }
        setShowModal(false);
      })
      .catch(() => {
        setShowModal(false);
      })
      .finally(() => setLoading(false));
  };

  // Lọc sản phẩm theo tên hoặc mô tả
  const filteredProducts = productList.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="admin-product-root">
        <h2>Quản lý Sản phẩm</h2>
        {/* Ô tìm kiếm */}
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
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
        <button className="btn-add-product" onClick={handleAdd}>
          + Thêm sản phẩm
        </button>
        <table className="admin-product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên sản phẩm</th>
              <th>Mô tả</th>
              <th>Ảnh</th>
              <th>Nội dung</th>
              <th>Ngày đăng</th>
              <th>Lượt xem</th> {/* Thêm dòng này */}
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8}>Đang tải...</td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8}>Không có dữ liệu</td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setViewProduct(p)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{shortDesc(p.description)}</td>
                  <td>
                    {p.image && (
                      <img
                        src={getImageUrl(p.image)}
                        alt="product"
                        style={{
                          width: 60,
                          height: 40,
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </td>
                  <td>
                    <div dangerouslySetInnerHTML={{ __html: shortDesc(p.content) }} />
                  </td>
                  <td>{new Date(p.postingDate).toLocaleString()}</td>
                  <td>{p.viewCount ?? 0}</td> {/* Thêm dòng này */}
                  <td>
                    <input
                      type="checkbox"
                      checked={p.isActive ?? true}
                      onClick={e => e.stopPropagation()}
                      onChange={e => {
                        setLoading(true);
                        fetch(`/api/Manage/Product/${p.id}`, {
                          method: "PUT",
                          headers: getAuthHeaders(),
                          body: JSON.stringify({ ...p, isActive: e.target.checked })
                        })
                          .then(() => fetchProducts())
                          .finally(() => setLoading(false));
                      }}
                      disabled={loading}
                      style={{ cursor: "pointer", transform: "scale(1.2)" }}
                    />
                  </td>
                  <td>
                    <button onClick={e => { e.stopPropagation(); handleEdit(p); }}>Sửa</button>
                    <button className="delete-btn" onClick={e => { e.stopPropagation(); handleDelete(p); }}>Xóa</button>
                    <button onClick={e => { e.stopPropagation(); setViewProduct(p); }}>Chi tiết</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal thêm/sửa */}
      {showModal && (
        <ProductFormModal
          product={editing}
          setProduct={setEditing}
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
            <p>Bạn chắc chắn muốn xóa sản phẩm này?</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="delete-btn" onClick={confirmDeleteProduct}>Xóa</button>
              <button onClick={() => setConfirmDelete(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết sản phẩm */}
      {viewProduct && (
        <div className="modal-overlay" onClick={() => setViewProduct(null)}>
          <div className="modal-content" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <h2>{viewProduct.name}</h2>
            <p><b>Mô tả:</b> {viewProduct.description}</p>
            {viewProduct.image && (
              <img
                src={getImageUrl(viewProduct.image)}
                alt="product"
                style={{ width: "100%", maxWidth: 400, borderRadius: 8, margin: "10px 0" }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div style={{ margin: "10px 0" }}>
              <b>Nội dung:</b>
              <div
                className="service-detail-content"
                dangerouslySetInnerHTML={{ __html: viewProduct.content }}
              />
            </div>
            <div>
              <b>Ngày đăng:</b> {viewProduct.postingDate ? new Date(viewProduct.postingDate).toLocaleString() : ""}
            </div>
            <button style={{ marginTop: 16 }} onClick={() => setViewProduct(null)}>Đóng</button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProduct;

function ProductFormModal({
  product,
  setProduct,
  onSubmit,
  onClose,
  loading,
  isEdit = false,
}: {
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
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
    <div className="product-detail-modal" onClick={onClose}>
      <div className="product-detail-card" onClick={e => e.stopPropagation()}>
        <h2>{isEdit ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2>
        {isEdit && (
          <div className="service-modal-title">
            {product.name || "Chưa có tên sản phẩm"}
          </div>
        )}
        <form className="admin-product-form" onSubmit={onSubmit}>
          <label>
            Tên sản phẩm
            <input
              type="text"
              value={product.name || ""}
              onChange={e => setProduct(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </label>
          <label>
            Mô tả
            <input
              type="text"
              value={product.description || ""}
              onChange={e => setProduct(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </label>
          <label>
            Ảnh sản phẩm
            <ImageUpload
              value={product.image}
              onChange={url => setProduct(prev => ({ ...prev, image: url }))}
              uploadApi="/api/Manage/Image"
            />
          </label>
          <label>
            Nội dung
            <ReactQuill
              theme="snow"
              value={product.content || ""}
              onChange={val => setProduct(prev => ({ ...prev, content: val }))}
              modules={quillModules}
            />
          </label>
          <label>
            Datasheet (PDF)
            <input
              type="file"
              accept="application/pdf"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const formData = new FormData();
                  formData.append("file", file);
                  const token = localStorage.getItem("token");
                  const res = await fetch("/api/Manage/Image", { // hoặc tạo API riêng cho file PDF
                    method: "POST",
                    headers: {
                      "Authorization": `Bearer ${token}`,
                    },
                    body: formData,
                  });
                  const data = await res.json();
                  setProduct(prev => ({ ...prev, pdf: data.url }));
                }
              }}
            />
          </label>
          {product.pdf && (
            <a href={product.pdf} target="_blank" rel="noopener noreferrer">
              Xem/Tải datasheet
            </a>
          )}
          <label>
            <input
              type="checkbox"
              checked={product.isActive ?? true}
              onChange={e => setProduct(prev => ({ ...prev, isActive: e.target.checked }))}
              disabled={loading}
            />
            Hiển thị sản phẩm này
          </label>
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {isEdit ? "Lưu" : "Thêm sản phẩm"}
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
