import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Roles from "./pages/Roles";
import Reportes from "./pages/Reportes";
import RecuperarClave from "./pages/RecuperarClave";
import ResetClave from "./pages/ResetClave";
import Layout from "./components/Layout";
import GestionPersonas from "./pages/GestionPersonas";
import GestionVentas from "./pages/GestionVentas";
import GestionUsuarios from "./pages/GestionUsuarios";
import GestionProductos from "./pages/GestionProductos";
import ProtectedRoute from "./components/ProtectedRoutes";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recuperar" element={<RecuperarClave />} />
        <Route path="/reset" element={<ResetClave />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            {/* 👇 Si entra a "/", lo redirigimos automáticamente al dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<Dashboard />} />
            <Route path="Menu_GestionUsuario" element={<GestionUsuarios />} />
            <Route path="Menu_GestionCliente" element={<Clientes />} />
            {/* <Route path="MENU_ROLES" element={<Roles />} /> */}
            <Route path="Menu_GestionProducto" element={<GestionProductos />} />
            <Route path="Menu_GestionVenta" element={<GestionVentas />} />
            <Route path="Menu_GestionReporte" element={<Reportes />} />
            <Route path="Menu_GestionPersona" element={<GestionPersonas />} />
          </Route>
        </Route>

        {/* Si no existe la ruta, redirige al login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}