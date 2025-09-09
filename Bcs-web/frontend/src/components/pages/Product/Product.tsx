import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Product.css";
import { ProductContextProvider } from "./Context/ProductContext";
import ProductBanner from "./ProductBanner";

type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  // ... các trường khác ...
};

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/Manage/Product/Public")
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : data.data || []));
  }, []);

  return (
    <ProductContextProvider value={{}}>
      <div className="product-page">
        <ProductBanner/>
        <h1 className="product-title">GIẢI PHÁP</h1>
        <div className="product-service">
          {products.map(product => (
            <Link to={`/product/${product.id}`} className="product-link" key={product.id}>
              <div className="product" style={{ backgroundImage: `url(${product.image})` }}>
                <div className="product-item">
                  <p>{product.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ProductContextProvider>
  );
};

export default ProductPage;

