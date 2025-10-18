import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from "./context/AuthContext"; // ruta según tu proyecto
import "./index.css"; // 👈 Tailwind y PrimeReact juntos
/* Importa los estilos de PrimeReact después */

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);