import { useState, useRef } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import api from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function ResetClave() {
  const [token, setToken] = useState("");
  const [nuevaClave, setNuevaClave] = useState("");
  const toast = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.resetear(token, nuevaClave);
      toast.current.show({
        severity: "success",
        summary: "Clave actualizada",
        detail: "Ya puedes iniciar sesión.",
        life: 3000,
      });
      setTimeout(() => navigate("/login"), 1500); // redirigir al login
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data || "No se pudo actualizar la clave.",
        life: 3000,
      });
    }
  };

  return (
    <div className="flex justify-content-center align-items-center h-screen">
      <Toast ref={toast} />
      <Card title="Resetear Contraseña" className="w-25rem">
        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="field">
            <label htmlFor="token">Token</label>
            <InputText
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="nuevaClave">Nueva contraseña</label>
            <Password
              id="nuevaClave"
              value={nuevaClave}
              onChange={(e) => setNuevaClave(e.target.value)}
              feedback={true}
              toggleMask
              required
            />
          </div>

          <Button label="Actualizar" icon="pi pi-key" className="mt-3" />
        </form>
      </Card>
    </div>
  );
}
