import { Route, Routes } from "react-router";
import Layout from "./pages/auth-pages/layout";
import Dashboard from "./pages/auth-pages/dashboard/page";
import Orders from "./pages/auth-pages/orders/page";
import SingleOrder from "./pages/auth-pages/orders/[orderid]/page";
import MenuPage from "./pages/auth-pages/menu/page";
import InventoryPage from "./pages/auth-pages/inventory/page";
import TablePage from "./pages/auth-pages/table/page";
import DigitalMenu from "./pages/no-auth-pages/digital-menu/page";
import { Toaster } from "sonner";
import LoginPage from "./pages/auth/page";
import ProtectedRoute from "./pages/auth/protected-route";
import RegisterPage from "./pages/auth/register-page";
import CategoryPage from "./pages/auth-pages/category/page";
import ModalX from "./modals/modal";
import AddDish from "./pages/auth-pages/menu/(dish-form)/add-dish";
import AddonPage from "./pages/auth-pages/add-ons/page";
import EditDish from "./pages/auth-pages/menu/(dish-form)/edit-dish";
import OrderCheckout from "./pages/auth-pages/orders/[orderid]/checkout/page";
import CheckoutSuccess from "./pages/auth-pages/orders/[orderid]/checkout/success-page";
import KhaltiPayment from "./pages/auth-pages/orders/[orderid]/checkout/khalti-payment-page";
import TransactionPage from "./pages/auth-pages/transactions/page";
import SuccessPage from "./pages/no-auth-pages/customer-success-page/page";

function App() {
  return (
    <>
      <Toaster richColors closeButton />
      <ModalX />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<SingleOrder />} />
            <Route path="orders/:id/checkout" element={<OrderCheckout />} />
            <Route path="checkout/:id/success" element={<CheckoutSuccess />} />
            <Route path="checkout/:id/khalti" element={<KhaltiPayment />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="menu/add-dish" element={<AddDish />} />
            <Route path="menu/edit-dish/:id" element={<EditDish />} />
            <Route path="table" element={<TablePage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="category" element={<CategoryPage />} />
            <Route path="add-ons" element={<AddonPage />} />
            <Route path="transactions" element={<TransactionPage />} />
          </Route>
          <Route path="/digi-menu/:tableId" element={<DigitalMenu />} />
          <Route path="/payment-success" element={<SuccessPage />} />
        </Routes>
    </>
  );
}

export default App;
