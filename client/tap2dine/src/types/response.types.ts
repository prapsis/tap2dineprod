export type TTableResponseType = {
  id: string;
  name: string;
  created_at: string;
  qr_code: string;
};
export type TCategoryResopnseType = {
  id: string;
  name: string;
  description: string;
};
export type TAddonResopnseType = {
  id: string;
  name: string;
  price: number;
};
export type TIngredientResponseType = {
  id: string;
  name: string;
  quantity_available: number;
};

export type TDishResponseType = {
  id: string;
  name: string;
  description: string;
  price: number;
  ingredients: TIngredientResponseType[];
  add_ons: TAddonResopnseType[];
  category: TCategoryResopnseType;
};

export type TOrderResponseType = {
  id: string;
  table: Omit<TTableResponseType, "created_at">;
  items: {
      dish: TDishResponseType;
      add_ons: TAddonResopnseType[];
      quantity: number;
      subtotal: number;
  }[];
  status: string;
  remarks: string;
  created_at: string;
  updated_at: string;
  total_amount: number;
  checked_out: boolean;
  payment_method: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
};
