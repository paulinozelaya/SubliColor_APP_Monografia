import { useState, useRef } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import api from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function RecuperarClave() {
  const [email, setEmail] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.recuperar(email);
      toast.current.show({
        severity: "success",
        summary: "Correo enviado",
        detail: "Revisa tu bandeja de entrada.",
        life: 3000,
      });
      setTimeout(() => navigate("/resetear"), 1500);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data || "No se pudo enviar el correo.",
        life: 3000,
      });
    }
  };

  return (
    <div className="flex justify-content-center align-items-center h-screen">
      <Card title="Recuperar Contraseña" className="w-25rem">
        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="field">
            <label htmlFor="email">Correo</label>
            <InputText
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button label="Enviar" icon="pi pi-envelope" className="mt-3" />
        </form>
      </Card>
    </div>
  );
}
