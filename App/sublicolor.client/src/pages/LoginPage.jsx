import { useState, useRef, useContext } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { FloatLabel } from "primereact/floatlabel";
import { useToast } from "../context/ToastContext";

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await api.login(usuario, clave);
      login(data.token, data.usuario);
      navigate("/dashboard");
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data || "Credenciales inválidas",
        life: 3000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-gray-900 relative overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500 via-purple-500 to-transparent blur-3xl animate-pulse"></div>

      {/* Contenedor principal */}
      <div className="relative z-10 w-full max-w-sm p-5 sm:p-6">
        <Card
          className="w-full shadow-2xl border border-white/20 rounded-2xl backdrop-blur-xl bg-white/10"
          header={
            <div className="flex flex-col items-center mb-5">
              <img
                src="/logo192.png"
                alt="logo"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://subir-imagen.com/images/2025/10/15/IMG_9439.jpeg")
                }
                className="h-16 w-16 rounded-full mb-3 shadow-md object-cover"
              />
              <h2 className="text-white text-xl font-semibold tracking-wide">
                SubliColor
              </h2>
              <p className="text-white text-sm">Bienvenido, inicia sesión</p>
            </div>
          }
        >
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 text-gray-100"
          >
            {/* Usuario */}
            <FloatLabel>
              <InputText
                id="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full"
                required
              />
              <label htmlFor="usuario">Usuario</label>
            </FloatLabel>

            {/* Contraseña */}
            <FloatLabel>
              <Password
                id="clave"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                feedback={false}
                toggleMask
                className="w-full inputPass"
                required
              />
              <label htmlFor="clave">Contraseña</label>
            </FloatLabel>

            {/* Botón */}
            <div className="mt-3">
              <Button
                label="Ingresar"
                icon="pi pi-sign-in"
                className="w-full py-2 bg-blue-500 hover:bg-blue-600 border-none text-white font-semibold rounded-lg shadow-md hover:shadow-blue-400/40 transition-all duration-200"
              />
            </div>

            {/* Enlace */}
            <div className="text-center mt-2">
              <Link
                to="/recuperar"
                className="text-sm text-blue-200 hover:text-blue-300 font-medium transition-colors duration-150"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>
        </Card>

        {/* Pie pequeño */}
        <p className="text-center text-gray-400 text-xs mt-6">
          © {new Date().getFullYear()} SubliColor. Todos los derechos
          reservados.
        </p>
      </div>
    </div>
  );
}
