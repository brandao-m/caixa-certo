import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import AppLayout from "../layouts/AppLayout";
import ClientsPage from "../pages/ClientsPage";
import DashboardPage from "../pages/DashboardPage";
import ExpensesPage from "../pages/ExpensesPage";
import LoginPage from "../pages/LoginPage";
import ServiceRecordsPage from "../pages/ServiceRecordsPage";
import ServicesPage from "../pages/ServicesPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/service-records" element={<ServiceRecordsPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;