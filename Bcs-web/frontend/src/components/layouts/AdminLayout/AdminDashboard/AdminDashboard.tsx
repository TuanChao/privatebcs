import React, { useEffect, useState } from "react";
import AdminLayout from "src/components/layouts/AdminLayout";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./AdminDashboard.css";
import { Link } from "react-router-dom";

const fetchCount = async (url: string) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(url, {
      credentials: 'include', // Gửi session cookie
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      }
    });
    
    if (!res.ok) {
      return 0;
    }
    
    const data = await res.json();
    
    // Backend trả về { count: number }
    if (data && typeof data.count === "number") {
      return data.count;
    }
    
    return 0;
  } catch (error) {
    return 0;
  }
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    users: 0,
    posters: 0,
    products: 0,
    services: 0,
    news: 0,
    productBanners: 0, 
    serviceBanners: 0, 
  });
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    Promise.all([
      fetchCount("/api/Manage/User/count"),
      fetchCount("/api/Manage/Poster/count"),
      fetchCount("/api/Manage/Product/count"),
      fetchCount("/api/Manage/Service/count"),
      fetchCount("/api/Manage/News/count"),
      fetchCount("/api/Manage/ProductBanner/count"), 
      fetchCount("/api/Manage/CsServiceBanner/count"), 
    ]).then(([users, posters, products, services, news, productBanners, serviceBanners]) => {
      setStats({ users, posters, products, services, news, productBanners, serviceBanners });
    });

    // Lấy tổng lượt xem
    fetchCount("/api/Manage/ViewCount/total").then(viewCount => {
      setTotalViews(viewCount);
    });
  }, []);

  return (
    <AdminLayout>
      <div className="dashboard-root">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-stats">
          <Link to="/admin/user" className="dashboard-card-outer-link">
            <div className="dashboard-card-outer">
              <div className="dashboard-card">
                <i className="bi bi-people dashboard-icon users" />
                <div>
                  <div className="dashboard-number">{stats.users}</div>
                  <div className="dashboard-label">Người dùng</div>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/admin/poster" className="dashboard-card-outer-link">
            <div className="dashboard-card-outer">
              <div className="dashboard-card">
                <i className="bi bi-image dashboard-icon posters" />
                <div>
                  <div className="dashboard-number">{stats.posters}</div>
                  <div className="dashboard-label">Poster</div>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/admin/products" className="dashboard-card-outer-link">
            <div className="dashboard-card-outer">
              <div className="dashboard-card">
                <i className="bi bi-box dashboard-icon products" />
                <div>
                  <div className="dashboard-number">{stats.products}</div>
                  <div className="dashboard-label">Sản phẩm</div>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/admin/productbanner" className="dashboard-card-outer-link">
            <div className="dashboard-card-outer">
              <div className="dashboard-card">
                <i className="bi bi-card-image dashboard-icon product-banners" />
                <div>
                  <div className="dashboard-number">{stats.productBanners}</div>
                  <div className="dashboard-label">Banner sản phẩm</div>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/admin/service" className="dashboard-card-outer-link">
            <div className="dashboard-card-outer">
              <div className="dashboard-card">
                <i className="bi bi-tools dashboard-icon services" />
                <div>
                  <div className="dashboard-number">{stats.services}</div>
                  <div className="dashboard-label">Dịch vụ</div>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/admin/servicebanner" className="dashboard-card-outer-link">
            <div className="dashboard-card-outer">
              <div className="dashboard-card">
                <i className="bi bi-postcard dashboard-icon service-banners" />
                <div>
                  <div className="dashboard-number">{stats.serviceBanners}</div>
                  <div className="dashboard-label">Banner dịch vụ</div>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/admin/news" className="dashboard-card-outer-link">
            <div className="dashboard-card-outer">
              <div className="dashboard-card">
                <i className="bi bi-newspaper dashboard-icon news" />
                <div>
                  <div className="dashboard-number">{stats.news}</div>
                  <div className="dashboard-label">Tin tức</div>
                </div>
              </div>
            </div>
          </Link>
          <div className="dashboard-card-outer">
            <div className="dashboard-card">
              <i className="bi bi-eye dashboard-icon views" />
              <div>
                <div className="dashboard-number">{totalViews}</div>
                <div className="dashboard-label">Tổng lượt xem</div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-welcome">
          <h2>Chào mừng bạn đến với trang quản trị!</h2>
          <p>
            Lỗi thì báo dev
            <br />
            Hãy chọn chức năng ở menu để bắt đầu.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
