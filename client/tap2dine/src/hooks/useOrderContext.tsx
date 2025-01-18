import { useContext } from "react";
import { OrderContext, OrderContextType } from "../context/orderContext";

export const useOrderContext = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
};
