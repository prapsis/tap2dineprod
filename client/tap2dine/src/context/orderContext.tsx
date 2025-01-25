import React, { createContext, useReducer, ReactNode } from "react";

export type OrderItem = {
  dishId: string;
  name: string;
  quantity: number;
  price: number;
  ingredients: { id: string; name: string; include: boolean }[];
  addons: { id: string; name: string; price: number }[];
  totalPrice: number;
};

export type Order = {
  table: string;
  items: OrderItem[];
  remarks: string;
  orderStatus?: 'initial' | 'placed' | 'completed';
  lastOrderId?: string;
};

type OrderAction =
  | { type: "ADD_ITEM"; payload: Omit<OrderItem, "remarks"> }
  | { type: "REMOVE_ITEM"; payload: { dishId: string } }
  | {
      type: "UPDATE_ITEM";
      payload: Partial<Omit<OrderItem, "remarks">> & { dishId: string };
    }
  | { type: "ADD_ORDER_REMARK" }
  | { type: "RESET_ORDER" }
  | { type: "SET_TABLE"; payload: {tableId:string} }
  | { type: "SET_ORDER_STATUS"; payload: Order['orderStatus'] }
  | { type: "SET_LAST_ORDER_ID"; payload: string };

export type OrderContextType = {
  order: Order;
  dispatch: React.Dispatch<OrderAction>;
};

// Initialize the context
export const OrderContext = createContext<OrderContextType | undefined>(
  undefined,
);

const initialOrder: Order = {
  table: String(0),
  items: [],
  remarks: "",
  orderStatus: 'initial'
};

// Reducer function
function orderReducer(state: Order, action: OrderAction): Order {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.items.find(
        (item) => item.dishId === action.payload.dishId,
      );
      if (exists) {
        return state;
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload }],
      };
    }
    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter(
          (item) => item.dishId !== action.payload.dishId,
        ),
      };
    }
    case "UPDATE_ITEM": {
      return {
        ...state,
        items: state.items.map((item) =>
          item.dishId === action.payload.dishId
            ? { 
                ...item, 
                ...action.payload, 
                totalPrice: action.payload.quantity 
                  ? item.totalPrice + (item.price * (action.payload.quantity - item.quantity)) 
                  : item.totalPrice 
              }
            : item,
        ),
      };
    }
    case "RESET_ORDER": {
      return initialOrder;
    }
    case "SET_TABLE": {
      return {
        ...state,
        table: action.payload.tableId
      }
    }
    case "SET_ORDER_STATUS": {
      return {
        ...state,
        orderStatus: action.payload
      }
    }
    case "SET_LAST_ORDER_ID": {
      return {
        ...state,
        lastOrderId: action.payload
      }
    }
    default:
      return state;
  }
}

// Provider component
export const OrderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [order, dispatch] = useReducer(orderReducer, initialOrder);

  return (
    <OrderContext.Provider value={{ order, dispatch }}>
      {children}
    </OrderContext.Provider>
  );
};