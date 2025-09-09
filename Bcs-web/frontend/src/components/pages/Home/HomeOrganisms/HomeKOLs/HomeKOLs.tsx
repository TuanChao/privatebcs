import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HomeKOLs.css";

const HomeKOLs: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/Manage/Product/Public")
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : data.data || []));
  }, []);

  if (!products.length) return null;

  return (
    <div className="home-kol-container animate-me">
      <h1 className="home-kol-title">Giải Pháp</h1>
      <div className="products-grid">
        {products.map((item) => (
          <Link to={`/product/${item.id}`} key={item.id} className="card-kol">
            <div
              className="image-kol-wrapper"
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className="product-item">
                <p>{item.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomeKOLs;