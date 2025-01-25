import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/authContext.tsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ModalProvider } from "./context/modalContext.tsx";
import { OrderProvider } from "./context/orderContext.tsx";
import { BrowserRouter } from "react-router";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <OrderProvider>
            <ModalProvider>
              <App />
            </ModalProvider>
          </OrderProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>

  </StrictMode>,
);
