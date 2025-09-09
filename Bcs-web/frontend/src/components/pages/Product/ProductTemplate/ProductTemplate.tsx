import React from "react";
import ProductPage from "../Product";
import ProductBanner from "../ProductBanner";

const ProductTemplate: React.FC = () => {
    return (
        <>
        <ProductBanner />
        <ProductPage />
        </>
    );
};

export default ProductTemplate;