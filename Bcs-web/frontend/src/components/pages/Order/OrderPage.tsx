import React from "react";
import "./OrderPage.css";
import { OrderContextProvider } from "./context";
import OrderTemplate from "./OrderTemplate";

const OrderPage: React.FC = () => {
  return (
    <div className="order-page">
      <OrderContextProvider value={{ loading: false }}>
        <OrderTemplate />
      </OrderContextProvider>
    </div>
  );
};

export default OrderPage;
