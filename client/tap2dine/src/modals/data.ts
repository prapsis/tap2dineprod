import { ModalType } from "../types/modal.types";
import AddAddon from "./add-ons/add-addon-modal";
import EditAddon from "./add-ons/edit-addon-modal";
import AddCategory from "./category/add-category-modal";
import EditCategory from "./category/edit-category-modal";
import DeleteModal from "./delete-modal";
import AddIngredient from "./inventory/add-ingredient";
import EditIngredient from "./inventory/edit-ingredient";
import AddTable from "./table/add-table";
import EditTable from "./table/edit-table";
import ViewQr from "./table/view-qr";

type TModalData = {
  [key in TModalKeys]: {
    title: string;
    component: React.FC<ModalType<key>>;
  };
};

export type TModalKeys =
  | "ADD_CATEGORY"
  | "DELETE_ITEM"
  | "EDIT_CATEGORY"
  | "ADD_INGREDIENT"
  | "EDIT_INGREDIENT"
  | "ADD_TABLE"
  | "EDIT_TABLE"
  | "VIEW_QR"
  | "ADD_ADDON"
  | "EDIT_ADDON";

export const ModalData: TModalData = {
  ADD_CATEGORY: {
    title: "Add Category",
    component: AddCategory,
  },
  EDIT_CATEGORY: {
    title: "Edit Category",
    component: EditCategory,
  },
  DELETE_ITEM: {
    title: "Delete",
    component: DeleteModal,
  },
  ADD_INGREDIENT: {
    title: "Add Ingredient",
    component: AddIngredient,
  },
  EDIT_INGREDIENT: {
    title: "Edit Ingredient",
    component: EditIngredient,
  },
  ADD_TABLE: {
    title: "Add Table",
    component: AddTable,
  },
  EDIT_TABLE: {
    title: "Edit Table",
    component: EditTable,
  },
  VIEW_QR: {
    title: "QR",
    component: ViewQr,
  },
  ADD_ADDON: {
    title: "Add Addon",
    component: AddAddon,
  },
  EDIT_ADDON: {
    title: "Edit Addon",
    component: EditAddon,
  },
};
