import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./ProductDentail.css";
import { useParams } from "react-router-dom";

const ProductDentail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Helper function để xử lý URL hình ảnh
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath; 
    return imagePath; // Relative URL
  };

  useEffect(() => {
    fetch(`/api/Manage/Product/${id}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Không tìm thấy sản phẩm");
        return res.json();
      })
      .then((data) => {
        // console.log("Product data:", data); // Debug log
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  return (
    <div className="product-detail" style={{ paddingTop: "100px" }}>
      <div className="product-detail-top">
        <div className="product-detail-top-left">
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-title">{product.description}</p>
          <div className="product-detail-download">
            {product.pdf ? (
              <a
                className="download-btn-nice"
                href={getImageUrl(product.pdf)}
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
        <div className="product-detail-top-right">
          {product.image && (
            <img
              src={getImageUrl(product.image)}
              className="product-detail-image"
              alt="Ảnh sản phẩm"
              onError={(e) => {
                console.log("Image load error:", product.image);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
        </div>
      </div>
      <div className="product-content">
        <div dangerouslySetInnerHTML={{ __html: product.content }} />
      </div>
    </div>
  );
};

export default ProductDentail;