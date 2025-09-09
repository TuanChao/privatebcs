import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";
import "./AdminAboutConTent.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { apiRequest, getImageUrl } from "../../../../utils/api";

interface AboutContent {
  id: string; 
  content: string;
}

const emptyAboutContent: AboutContent = {
  id: "",
  content: "",
};

const AdminAboutContent: React.FC = () => {
  const [list, setList] = useState<AboutContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [current, setCurrent] = useState<AboutContent>(emptyAboutContent);
  const [viewContent, setViewContent] = useState<AboutContent | null>(null);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  };

  // Helper function to get auth headers for file upload
  const getFileUploadHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Authorization": `Bearer ${token}`
    };
  };

  // ReactQuill modules configuration
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
        image: function () {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");
          input.click();
          input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
              const formData = new FormData();
              formData.append("file", file);
              
              const res = await axios.post("/api/Upload", formData, {
                headers: getFileUploadHeaders(),
              });
              const url = res.data.url;
              const quill = (this as any).quill;
              const range = quill.getSelection();
              quill.insertEmbed(range.index, "image", url);
            }
          };
        },
      },
    },
  };

  // Fetch data
  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await axios.get<AboutContent[]>("/api/Manage/AboutContent/Public", {
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
        // Chỉ truyền content khi thêm mới
        await axios.post("/api/Manage/AboutContent", { content: current.content }, {
          headers: getAuthHeaders()
        });
      } else if (modal === "edit") {
        await axios.put(`/api/Manage/AboutContent/${current.id}`, { content: current.content }, {
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
      await axios.delete(`/api/Manage/AboutContent/${id}`, {
        headers: getAuthHeaders()
      });
      fetchList();
    } catch {}
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="admin-aboutcontent-root">
        <h2>Quản lý Content</h2>
        <button
          className="btn-add-aboutcontent"
          onClick={() => {
            setCurrent(emptyAboutContent);
            setModal("add");
          }}
          disabled={loading}
        >
          + Thêm Content
        </button>
        <table className="admin-aboutcontent-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nội dung</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} style={{ textAlign: "center" }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: "center" }}>
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              list.map((item) => (
                <tr
                  key={item.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setViewContent(item)}
                >
                  <td>{item.id}</td>
                  <td>
                    <div
                      className="aboutcontent-content-detail"
                      style={{
                        maxWidth: 600,
                        whiteSpace: "pre-line",
                        wordBreak: "break-word",
                      }}
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                  </td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrent(item);
                        setModal("edit");
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                    >
                      Xóa
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewContent(item);
                      }}
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Modal Thêm/Sửa */}
        {modal && (
          <div
            className="aboutcontent-detail-modal"
            onClick={() => setModal(null)}
          >
            <div
              className="aboutcontent-detail-card"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{modal === "add" ? "Thêm Content" : "Sửa Content"}</h2>
              <form
                onSubmit={handleSubmit}
                className="admin-aboutcontent-form"
              >
                <label>
                  Nội dung
                  <ReactQuill
                    theme="snow"
                    value={current.content}
                    onChange={(val) => setCurrent({ ...current, content: val })}
                    modules={quillModules}
                    style={{ minHeight: 180, marginBottom: 12 }}
                  />
                </label>
                {/* Đã bỏ input ảnh minh họa và hiển thị ảnh */}
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

        {/* Modal Chi tiết */}
        {viewContent && (
          <div
            className="aboutcontent-detail-modal"
            onClick={() => setViewContent(null)}
          >
            <div
              className="aboutcontent-detail-card"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Chi tiết Content</h2>
              <div
                className="aboutcontent-content-detail"
                style={{ minHeight: 120 }}
                dangerouslySetInnerHTML={{ __html: viewContent.content }}
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAboutContent;
