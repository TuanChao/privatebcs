import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";
import "./AdminIntroduce.css"

interface Introduce {
  id: string;
  year: number;
  name: string;
  description: string;
}

const emptyIntroduce: Introduce = {
  id: "",
  year: new Date().getFullYear(),
  name: "",
  description: "",
};

const AdminIntroduce: React.FC = () => {
  const [list, setList] = useState<Introduce[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [current, setCurrent] = useState<Introduce>(emptyIntroduce);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  };

  // Fetch data
  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Introduce[]>("/api/Manage/Introduce/Public", {
        headers: getAuthHeaders()
      });
      setList(res.data);
    } catch {
      setList([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Add or Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (modal === "add") {
        const { id, ...payload } = current; // Loại bỏ id
        await axios.post("/api/Manage/Introduce", payload, {
          headers: getAuthHeaders()
        });
      } else if (modal === "edit") {
        await axios.put(`/api/Manage/Introduce/${current.id}`, current, {
          headers: getAuthHeaders()
        });
      }
      setModal(null);
      fetchList();
    } catch {}
    setLoading(false);
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    setLoading(true);
    try {
      await axios.delete(`/api/Manage/Introduce/${id}`, {
        headers: getAuthHeaders()
      });
      fetchList();
    } catch {}
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="admin-introduce-root">
        <h2>Quản lý Giới thiệu (Introduce)</h2>
        <button onClick={() => { setCurrent(emptyIntroduce); setModal("add"); }}>
          Thêm mới
        </button>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Năm</th>
              <th>Tên</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {list.map(item => (
              <tr key={item.id}>
                <td>{item.year}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>
                  <button onClick={() => { setCurrent(item); setModal("edit"); }}>Sửa</button>
                  <button onClick={() => handleDelete(item.id)}>Xóa</button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Modal Thêm/Sửa */}
        {modal && (
          <div className="modal-overlay" onClick={() => setModal(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2>{modal === "add" ? "Thêm giới thiệu" : "Sửa giới thiệu"}</h2>
              <form onSubmit={handleSubmit} className="admin-form">
                <label>
                  Năm
                  <input
                    type="number"
                    value={current.year}
                    onChange={e => setCurrent({ ...current, year: Number(e.target.value) })}
                    required
                  />
                </label>
                <label>
                  Tên
                  <input
                    type="text"
                    value={current.name}
                    onChange={e => setCurrent({ ...current, name: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Mô tả
                  <textarea
                    value={current.description}
                    onChange={e => setCurrent({ ...current, description: e.target.value })}
                    required
                  />
                </label>
                <div className="form-actions">
                  <button type="submit" disabled={loading}>
                    {modal === "add" ? "Thêm" : "Lưu"}
                  </button>
                  <button type="button" onClick={() => setModal(null)}>
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminIntroduce;