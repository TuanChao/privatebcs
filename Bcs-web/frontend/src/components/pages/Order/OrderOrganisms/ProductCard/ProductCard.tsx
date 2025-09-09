import React from "react";
import "./ProductCard.css";

type ProductCardProps = {
  imageSrc: string;
  title: string;
  description: string;
  socialLinks?: { icon: React.ReactNode; link: string }[];
};

const ProductCard: React.FC<ProductCardProps> = ({ imageSrc, title, socialLinks = [] }) => {
  return (
    <div className="product-card">
      <div className="product-card-image">
        <img src={imageSrc} alt={title} loading="lazy" />
      </div>
      <div className="product-card-content">
        <h3 className="product-card-title">{title}</h3>
        {/* <p className="product-card-description">{description}</p> */}
        <div className="product-card-social">
          {socialLinks.map((social, index) => (
            <>
              <div key={index}>{social.icon}</div>

              <a className="product-card-btn" href={social.link} target="_blank" rel="noopener noreferrer">
                Order Now
              </a>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
