import React from "react";

export interface ProductContextProps {
  loading?: boolean;
}

export const ProductContext = React.createContext<ProductContextProps>({} as ProductContextProps);
export const ProductContextProvider = ProductContext.Provider;