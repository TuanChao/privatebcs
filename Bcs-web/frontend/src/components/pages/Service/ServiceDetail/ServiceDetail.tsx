import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./ServiceDetail.css";
import { useParams } from "react-router-dom";

type Service = {
  id: number;
  name: string;
  description: string;
  image: string;
  content: string;
  postingDate: string;
};

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID dịch vụ không hợp lệ");
      setLoading(false);
      return;
    }

    const fetchService = async () => {
      try {
        const response = await fetch(`/api/Manage/CsService/${id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Không tìm thấy dịch vụ");
        }

        const data = await response.json();
        const detail = data && data.id ? data : data.data || null;

        if (!detail) {
          throw new Error("Dữ liệu dịch vụ không hợp lệ");
        }

        setService(detail);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="service-detail-loading">
        <div className="loading-spinner">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="service-detail-error">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="service-detail-not-found">
        <div className="not-found-message">Không tìm thấy dịch vụ</div>
      </div>
    );
  }

  return (
    <div className="service-detail" style={{ paddingTop: "100px" }}>
      <div className="service-detail-top">
        <div className="service-detail-top-left">
          <h1 className="service-detail-name">{service.name}</h1>
          <p className="service-detail-title">{service.description}</p>
        </div>
        <div className="service-detail-top-right">
          {service.image && (
            <img
              src={service.image}
              className="service-detail-image"
              alt={`Ảnh dịch vụ ${service.name}`}
              loading="lazy"
            />
          )}
        </div>
      </div>
      <div className="service-content">
        <div
          className="service-detail-content"
          dangerouslySetInnerHTML={{ __html: service.content }}
        />
      </div>
    </div>
  );
};

export default ServiceDetail;