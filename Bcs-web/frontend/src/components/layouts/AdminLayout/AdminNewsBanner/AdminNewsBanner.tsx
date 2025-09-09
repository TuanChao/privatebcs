import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import ImageUpload from "src/components/layouts/AdminLayout/common/ImageUpload";
import "./AdminNewsBanner.css"

// Helper function for authenticated API calls
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };
};

const AdminNewsBanner: React.FC = () => {
  const [banners, setBanners] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/Manage/NewsBanner", {
      headers: getAuthHeaders()
    })
      .then(res => res.json())
      .then(data => setBanners(Array.isArray(data) ? data.map(x => x.imageUrl) : []));
  }, []);

  const handleSave = async () => {
    setLoading(true);
    await fetch("/api/Manage/NewsBanner", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(banners.map(imageUrl => ({ imageUrl }))),
    });
    setLoading(false);
    alert("Cập nhật banner thành công!");
  };

  const handleAddBanner = () => setBanners([...banners, ""]);
  const handleChangeBanner = (idx: number, url: string) => {
    setBanners(banners.map((b, i) => (i === idx ? url : b)));
  };
  const handleRemoveBanner = (idx: number) => {
    setBanners(banners.filter((_, i) => i !== idx));
  };

  return (
    <AdminLayout>
      <div className="admin-newsbanner-root">
        <h2>Quản lý Banner Tin tức</h2>
        {banners.map((banner, idx) => (
          <div key={idx} style={{ marginBottom: 16 }}>
            <ImageUpload
              value={banner}
              onChange={url => handleChangeBanner(idx, url)}
              uploadApi="/api/Manage/Image"
            />
            {banner && (
              <img src={banner} alt="banner" style={{ maxWidth: 400, margin: 8 }} loading="lazy" />
            )}
            <button onClick={() => handleRemoveBanner(idx)}>Xóa</button>
          </div>
        ))}
        <button onClick={handleAddBanner}>Thêm banner</button>
        <button onClick={handleSave} disabled={loading || banners.length === 0}>
          Lưu tất cả banner
        </button>
      </div>
    </AdminLayout>
  );
};

export default AdminNewsBanner;