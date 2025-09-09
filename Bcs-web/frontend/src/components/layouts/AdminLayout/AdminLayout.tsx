import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "src/assets/images/bcs-layout-1.png"
import "./AdminLayout.css";
import LogoutButton from "src/components/pages/Auth/LogoutButton";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    
    setRole(storedRole);
    
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      navigate("/login");
      return;
    }
    
    // Basic token validation
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      
      if (isExpired) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        alert("Phiên đăng nhập đã hết hạn!");
        navigate("/login");
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      alert("Token không hợp lệ!");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="admin-root">
      {/* Sidebar */}
      <div className={`admin-sidebar${sidebarOpen ? " open" : ""}`}>
        <img className="admin-logo" src={logo} alt="Logo" />
        <nav>
          <ul>
            <li>
              <a href="/admin" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-speedometer2 nav-icon"></i>
                <span className="nav-label">Dashboard</span>
              </a>
            </li>
            {role === "Admin" && (
              <li>
                <a href="/admin/user" onClick={() => setSidebarOpen(false)}>
                  <i className="bi bi-people nav-icon"></i>
                  <span className="nav-label">Quản lý người dùng</span>
                </a>
              </li>
            )}
            <li>
              <a href="/admin/poster" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-image nav-icon"></i>
                <span className="nav-label">Quản lý Poster</span>
              </a>
            </li>
            <li>
              <a href="/admin/products" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-box-seam nav-icon"></i>
                <span className="nav-label">Quản lý sản phẩm</span>
              </a>
            </li>
            <li>
              <a href="/admin/productbanner" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-image nav-icon"></i>
                <span className="nav-label">Quản lý banner sản phẩm</span>
              </a>
            </li>
            <li>
              <a href="/admin/service" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-gear nav-icon"></i>
                <span className="nav-label">Quản lý Dịch vụ</span>
              </a>
            </li>
            <li>
              <a href="/admin/servicebanner" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-image nav-icon"></i>
                <span className="nav-label">Quản lý banner dịch vụ</span>
              </a>
            </li>
            <li>
              <a href="/admin/news" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-newspaper nav-icon"></i>
                <span className="nav-label">Quản lý tin tức</span>
              </a>
            </li>
            <li>
              <a href="/admin/newsbanner" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-image nav-icon"></i>
                <span className="nav-label">Quản lý Banner Tin tức</span>
              </a>
            </li>
            <li>
              <a href="/admin/introduce" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-info-circle nav-icon"></i>
                <span className="nav-label">Quản lý Giới thiệu</span>
              </a>
            </li>
            <li>
              <a href="/admin/aboutcontent" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-file-earmark-text nav-icon"></i>
                <span className="nav-label">Quản lý Content</span>
              </a>
            </li>
          </ul>
        </nav>
        <div className="admin-sidebar-footer">
          <LogoutButton />
        </div>
      </div>
      {/* Nút ☰ luôn hiển thị trên mobile */}
      <button
        className="admin-sidebar-toggle"
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>
      <div className="admin-main">
        <header className="admin-header">
          <h1>Quản lý hệ thống</h1>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
