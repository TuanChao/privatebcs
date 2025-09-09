import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./SocProduct.css";
import { useParams } from "react-router-dom";
import { apiRequest, getImageUrl } from "../../../../../../utils/api";

type Poster = {
  id: string;
  name: string;
  description: string;
  image: string;
  content: string;
  postingDate: string;
};

const SocProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [poster, setPoster] = useState<Poster | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/Manage/Poster/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPoster({
          id: data.id,
          name: data.name ?? data.Name,
          description: data.description,
          image: data.image,
          content: data.content,
          postingDate: data.postingDate,
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ paddingTop: 100 }}>Đang tải...</div>;
  if (!poster) return <div style={{ paddingTop: 100 }}>Không tìm thấy dịch vụ</div>;

  return (
    <div className="soc-product-detail">
      <div className="soc-product-inner" style={{ paddingTop: "100px" }}>
        <div className="soc-product-detail-top">
          <div className="soc-product-detail-top-content">
            <h1 className="soc-product-detail-name">{poster.name}</h1>
            <p className="soc-product-detail-title">{poster.description}</p>
          </div>
        </div>
        <div className="soc-product-des-content">
          <div
            className="soc-product-detail-content"
            dangerouslySetInnerHTML={{ __html: poster.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default SocProduct;