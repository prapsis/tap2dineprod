import { BrowserRouter, Route, Routes } from "react-router"
import Layout from "./pages/auth-pages/layout"
import Dashboard from "./pages/auth-pages/dashboard/page"
import Orders from "./pages/auth-pages/orders/page"
import SingleOrder from "./pages/auth-pages/orders/[orderid]/page"
import MenuPage from "./pages/auth-pages/menu/page"
import InventoryPage from "./pages/auth-pages/inventory/page"
import TablePage from "./pages/auth-pages/table/page"
import DigitalMenu from "./pages/no-auth-pages/digital-menu/page"
import { Toaster } from "sonner"
import LoginPage from "./pages/auth/page"
import ProtectedRoute from "./pages/auth/protected-route"
import RegisterPage from "./pages/auth/register-page"
import CategoryPage from "./pages/auth-pages/category/page"
import ModalX from "./modals/modal"


function App() {
  return (
    <>
      <Toaster richColors closeButton />
      <ModalX/>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path='/' element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path='orders' element={<Orders />} />
            <Route path="orders/:id" element={<SingleOrder />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="table" element={<TablePage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="category" element={<CategoryPage />} />

          </Route>
          <Route path="/digi-menu" element={<DigitalMenu />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
