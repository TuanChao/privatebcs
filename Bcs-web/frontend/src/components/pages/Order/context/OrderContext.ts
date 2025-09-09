import React from "react";

export interface OrderContextProps {
  loading?: boolean;
}

export const OrderContext = React.createContext<OrderContextProps>({} as OrderContextProps);
export const OrderContextProvider = OrderContext.Provider;
