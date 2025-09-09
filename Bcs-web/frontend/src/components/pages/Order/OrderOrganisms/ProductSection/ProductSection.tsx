import React from "react";
import { ABOUT_CONTENT } from "../../OrderPage.type";
import ProductCard from "../ProductCard";
import TitleSection from "../TitleSection";

const ProductSection: React.FC = () => {
  return (
    <div className="product-section">
      <TitleSection />
      <div className="product-cards-container">
        {ABOUT_CONTENT.map((product, index) => (
          <ProductCard
            key={index}
            imageSrc={product.imageSrc}
            title={product.title}
            description={product.description}
            socialLinks={product.socialLinks}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
