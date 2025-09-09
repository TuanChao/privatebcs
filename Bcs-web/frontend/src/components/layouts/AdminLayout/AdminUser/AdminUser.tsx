import React, { useEffect, useState } from "react";
import AdminLayout from "src/components/layouts/AdminLayout";
import "./AdminUser.css";
import ImageUpload from "../common/ImageUpload";
import Enable2FA from "src/components/pages/Auth/Enable2FA"; // Correct import for Enable2FA
import { useNavigate } from "react-router-dom";
import { apiRequest, getImageUrl } from "../../../../utils/api";

// Helper function for authenticated API calls
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };
};

type User = {
  id: string; // <-- Đổi từ number sang string
  userName: string;
  password: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  userDetails: string;
  isActive: boolean;
  joiningDate: string;
  token: string;
  newPassword?: string; // <-- Thêm dòng này
};

const AdminUser: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<User>({
    id: "",
    userName: "",
    password: "",
    email: "",
    phone: "",
    role: "Viewer",
    avatar: "",
    userDetails: "",
    isActive: true,
    joiningDate: new Date().toISOString(),
    token: "",
  });
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [search, setSearch] = useState("");
  const [enable2FAUser, setEnable2FAUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Load user list và kiểm tra quyền
  useEffect(() => {
    fetch("/api/Manage/users", { 
      headers: getAuthHeaders(),
      credentials: "include" 
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403 || res.status === 401) {
            alert("Bạn không có quyền truy cập trang này!");
            navigate("/admin");
            return;
          }
          throw new Error("Lỗi server");
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        // Nếu load được users thành công, có nghĩa là có quyền admin
        localStorage.setItem("role", "Admin");
      })
      .catch((err) => {
        console.error("Fetch users error:", err);
        setUsers([]);
        // Nếu lỗi không phải 403/401 thì chỉ log, không chuyển hướng
      });
  }, [navigate]);

  // Đã xóa useEffect kiểm tra quyền riêng lẻ - sẽ dựa vào kết quả API users

  // Helper chuẩn hóa avatar
  const getAvatarUrl = (avatar: string) => {
    if (!avatar || avatar === "string") return "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' fill='%23ccc'%3e%3crect width='60' height='60' fill='%23f0f0f0'/%3e%3ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3eUser%3c/text%3e%3c/svg%3e";
    if (avatar.startsWith("http")) return avatar;
    return `${avatar}`; // Sử dụng relative URL
  };

  // Search logic
  const filteredUsers = users.filter(
    (u) =>
      u.userName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Edit User
  const handleEdit = (user: User) => setEditingUser(user);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!editingUser) return;
    const { name, value, type } = e.target;
    setEditingUser({
      ...editingUser,
      [name]: type === "checkbox" && e.target instanceof HTMLInputElement ? e.target.checked : value,
    });
  };

  // Save User (Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const userToUpdate: any = {
      Id: editingUser.id,
      UserName: editingUser.userName,
      Email: editingUser.email,
      Phone: editingUser.phone,
      Role: editingUser.role,
      Avatar: editingUser.avatar,
      UserDetails: editingUser.userDetails,
      IsActive: editingUser.isActive,
      JoiningDate: new Date(editingUser.joiningDate).toISOString(),
    };

    if (editingUser.newPassword) {
      userToUpdate.NewPassword = editingUser.newPassword;
    }

    const res = await fetch(
      `/api/Manage/users/${editingUser.id}`, // Đổi thành relative URL
      {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include", // Thêm credentials
        body: JSON.stringify(userToUpdate),
      }
    );
    if (!res.ok) {
      const errorText = await res.text();
      alert("Cập nhật thất bại!\n" + errorText);
      setLoading(false);
      return;
    }
    const updated = await res.json();
    setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
    setEditingUser(null);
    setLoading(false);
  };

  // Delete User
  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;
    await fetch(`/api/Manage/users/${id}`, { 
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include" // Thêm credentials
    });
    setUsers(users.filter((u) => u.id !== id));
  };

  // Add User (Tạo mới PHẢI có password)
  const handleNewUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setNewUser({
      ...newUser,
      [name]: type === "checkbox" && e.target instanceof HTMLInputElement ? e.target.checked : value,
    });
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const userToAdd = {
      UserName: newUser.userName,
      Password: newUser.password,
      Email: newUser.email,
      Phone: newUser.phone,
      Role: newUser.role,
      Avatar: newUser.avatar,
      UserDetails: newUser.userDetails,
      IsActive: newUser.isActive,
      JoiningDate: new Date().toISOString(),
    };

    const res = await fetch(`/api/Manage/users`, { // Đổi thành relative URL
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include", // Thêm credentials
      body: JSON.stringify(userToAdd),
    });
    if (!res.ok) {
      const errorText = await res.text();
      alert("Thêm thất bại!\n" + errorText);
      setLoading(false);
      return;
    }
    const created = await res.json();
    setUsers([...users, created]);
    setNewUser({
      id: "",
      userName: "",
      password: "",
      email: "",
      phone: "",
      role: "Viewer",
      avatar: "",
      userDetails: "",
      isActive: true,
      joiningDate: new Date().toISOString(),
      token: "",
    });
    setShowAddUser(false);
    setLoading(false);
  };

  // );
  // );

  return (
    <AdminLayout>
      <div className="admin-user-edit-root">
        <h2>Quản lý người dùng</h2>
        {editingUser ? (
          <form className="admin-user-form" onSubmit={handleSave}>
            <label>
              Họ tên
              <input
                type="text"
                name="userName"
                value={editingUser.userName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={editingUser.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Số điện thoại
              <input
                type="text"
                name="phone"
                value={editingUser.phone}
                onChange={handleChange}
              />
            </label>
            <label>
              Vai trò
              <select name="role" value={editingUser.role} onChange={handleChange}>
                <option value="Admin">Admin</option>
                <option value="Viewer">Viewer</option>
              </select>
            </label>
            <label>
              Avatar
              <ImageUpload
                value={editingUser.avatar}
                onChange={url => setEditingUser({ ...editingUser, avatar: url })}
                uploadApi={`/api/Manage/Image`} // Sử dụng relative URL
              />
            </label>
            <label>
              Thông tin chi tiết
              <textarea
                name="userDetails"
                value={editingUser.userDetails}
                onChange={handleChange}
              />
            </label>
            <label>
              Kích hoạt
              <input
                type="checkbox"
                name="isActive"
                checked={editingUser.isActive}
                onChange={handleChange}
              />
            </label>
            <label>
              Mật khẩu mới
              <input
                type="password"
                name="newPassword"
                value={editingUser.newPassword || ""}
                onChange={e => setEditingUser({ ...editingUser, newPassword: e.target.value })}
                placeholder="Để trống nếu không đổi"
                autoComplete="new-password"
              />
            </label>
            <div style={{ display: "flex", gap: 12 }}>
              <button type="submit" className="btn-save" disabled={loading}>
                Lưu
              </button>
              <button type="button" className="btn-cancel" onClick={() => setEditingUser(null)}>
                Hủy
              </button>
            </div>
          </form>
        ) : (
          <>
            <button
              className="btn-add-user"
              onClick={() => setShowAddUser(true)}
              style={{ marginBottom: 18 }}
            >
              + Thêm người dùng
            </button>
            {showAddUser && (
              <div className="user-detail-modal" onClick={() => setShowAddUser(false)}>
                <div className="user-detail-card" onClick={e => e.stopPropagation()}>
                  <h2>Thêm người dùng</h2>
                  <form className="admin-user-form" onSubmit={handleAddUser}>
                    <label>
                      Họ tên
                      <input type="text" name="userName" value={newUser.userName} onChange={handleNewUserChange} required />
                    </label>
                    <label>
                      Mật khẩu
                      <input type="password" name="password" value={newUser.password} onChange={handleNewUserChange} required />
                    </label>
                    <label>
                      Email
                      <input type="email" name="email" value={newUser.email} onChange={handleNewUserChange} required />
                    </label>
                    <label>
                      Số điện thoại
                      <input type="text" name="phone" value={newUser.phone} onChange={handleNewUserChange} />
                    </label>
                    <label>
                      Vai trò
                      <select name="role" value={newUser.role} onChange={handleNewUserChange}>
                        <option value="Admin">Admin</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    </label>
                    <label>
                      Avatar
                      <ImageUpload
                        value={newUser.avatar}
                        onChange={url => setNewUser(prev => ({ ...prev, avatar: url }))}
                        uploadApi={`/api/Manage/Image`} // Sử dụng relative URL
                      />
                    </label>
                    <label>
                      Thông tin chi tiết
                      <textarea name="userDetails" value={newUser.userDetails} onChange={handleNewUserChange} />
                    </label>
                    <label>
                      Kích hoạt
                      <input type="checkbox" name="isActive" checked={newUser.isActive} onChange={handleNewUserChange} />
                    </label>
                    <button type="submit" disabled={loading}>
                      Thêm người dùng
                    </button>
                  </form>
                </div>
              </div>
            )}
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ marginBottom: 16, padding: 6, width: 260 }}
            />
            <table className="admin-user-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Avatar</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.id} onClick={() => setViewUser(user)} style={{ cursor: "pointer" }}>
                    <td>{idx + 1}</td>
                    <td>
                      <img
                        src={getAvatarUrl(user.avatar)}
                        alt="avatar"
                        style={{
                          width: 48,
                          height: 48,
                          objectFit: "cover",
                          borderRadius: "50%",
                          background: "#eee",
                          border: "1.5px solid #2563eb"
                        }}
                      />
                    </td>
                    <td>{user.userName}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.role}</td>
                    <td>{user.isActive ? "Kích hoạt" : "Khóa"}</td>
                    <td>
                      <button onClick={e => { e.stopPropagation(); handleEdit(user); }}>Sửa</button>
                      <button onClick={e => { e.stopPropagation(); handleDelete(user.id); }}>Xóa</button>
                      <button onClick={e => { e.stopPropagation(); setViewUser(user); }}>Chi tiết</button>
                      <button onClick={e => { e.stopPropagation(); setEnable2FAUser(user); }}>Bật 2FA</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {viewUser && (
              <div className="user-detail-modal" onClick={() => setViewUser(null)}>
                <div className="user-detail-card" onClick={e => e.stopPropagation()}>
                  <h2>Chi tiết người dùng</h2>
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <img
                      src={getAvatarUrl(viewUser.avatar)}
                      alt="avatar"
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: "50%",
                        background: "#eee",
                        border: "2px solid #2563eb"
                      }}
                    />
                  </div>
                  <ul style={{ textAlign: "left" }}>
                    <li><b>ID:</b> {viewUser.id}</li>
                    <li><b>Họ tên:</b> {viewUser.userName}</li>
                    <li><b>Email:</b> {viewUser.email}</li>
                    <li><b>Số điện thoại:</b> {viewUser.phone}</li>
                    <li><b>Vai trò:</b> {viewUser.role}</li>
                    <li><b>Trạng thái:</b> {viewUser.isActive ? "Kích hoạt" : "Khóa"}</li>
                    <li><b>Ngày tham gia:</b> {new Date(viewUser.joiningDate).toLocaleDateString()}</li>
                    <li><b>Thông tin chi tiết:</b> {viewUser.userDetails}</li>
                  </ul>
                </div>
              </div>
            )}
            {enable2FAUser && (
              <div className="user-detail-modal" onClick={() => setEnable2FAUser(null)}>
                <div className="user-detail-card" onClick={e => e.stopPropagation()}>
                  <Enable2FA userId={enable2FAUser.id as string} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUser;

