import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./ServiceBannerDetail.css"; // Uncomment import CSS
import { useParams, useLocation } from "react-router-dom";
import { getImageUrl } from "../../../../../utils/api";

const ServiceBannerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [serviceBanner, setServiceBanner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu từ state nếu có (từ ServiceBanner component)
  const serviceBannerFromState = location.state?.serviceBanner;

  useEffect(() => {
    // Nếu có dữ liệu từ state, sử dụng luôn
    if (serviceBannerFromState) {
      setServiceBanner(serviceBannerFromState);
      setLoading(false);
      return;
    }

    // Nếu không có dữ liệu từ state, fetch từ API
    fetch(`/api/Manage/CsServiceBanner/${id}/Public`)
      .then((res) => {
        if (!res.ok) throw new Error("Không tìm thấy banner dịch vụ");
        return res.json();
      })
      .then((data) => {
        setServiceBanner(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching service banner:", err);
        setLoading(false);
      });
  }, [id, serviceBannerFromState]);

  if (loading) return <div>Đang tải...</div>;
  if (!serviceBanner) return <div>Không tìm thấy banner dịch vụ</div>;

  return (
    <div className="service-banner-detail" style={{ paddingTop: "100px" }}>
      <div className="service-banner-detail-top">
        <div className="service-banner-detail-top-left">
          <h1 className="service-banner-detail-name">{serviceBanner.name}</h1>
          <p className="service-banner-detail-title">{serviceBanner.description}</p>
          <div className="service-banner-detail-download">
            {serviceBanner.pdf ? (
              <a
                className="download-btn-nice"
                href={getImageUrl(serviceBanner.pdf)}
                download
                rel="noopener noreferrer"
                title="Tải Datasheet PDF"
              >
                <i className="bi bi-file-earmark-arrow-down-fill"></i>
                <span>Tải Datasheet PDF</span>
              </a>
            ) : (
              <span
                style={{
                  color: "#fff",
                  opacity: 0.6,
                  fontStyle: "italic",
                }}
              >
                Chưa có datasheet
              </span>
            )}
          </div>
        </div>
        <div className="service-banner-detail-top-right">
          {serviceBanner.image && (
            <img
              src={getImageUrl(serviceBanner.image)}
              className="service-banner-detail-image"
              alt="Ảnh banner dịch vụ"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
        </div>
      </div>
      <div className="service-banner-content">
        <div dangerouslySetInnerHTML={{ __html: serviceBanner.content }} />
      </div>
    </div>
  );
};

export default ServiceBannerDetail;
