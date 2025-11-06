import { useEffect, useState, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import rolApi from "../api/rol";
import { useToast } from "../context/ToastContext";

export default function GestionRoles() {
  const [roles, setRoles] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    idRol: null,
    nombre: "",
    descripcion: "",
  });
  const [editing, setEditing] = useState(false);
  const toast = useToast();

  useEffect(() => {
    cargarRoles();
  }, []);

  const cargarRoles = async () => {
    try {
      const data = await rolApi.getAll();
      setRoles(data);
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los roles",
      });
    }
  };

  const abrirNuevo = () => {
    setForm({ idRol: null, nombre: "", descripcion: "" });
    setEditing(false);
    setVisible(true);
  };

  const abrirEditar = (row) => {
    setForm(row);
    setEditing(true);
    setVisible(true);
  };

  const guardarRol = async () => {
    try {
      if (!form.codigoInterno.trim() || !form.nombre.trim()) {
        toast.current.show({
          severity: "warn",
          summary: "Campos requeridos",
          detail: "Código interno y nombre son obligatorios",
        });
        return;
      }

      if (editing) {
        await rolApi.update(form.idRol, form);
        toast.current.show({
          severity: "success",
          summary: "Actualizado",
          detail: "Rol actualizado correctamente",
        });
      } else {
        await rolApi.create(form);
        toast.current.show({
          severity: "success",
          summary: "Creado",
          detail: "Rol creado correctamente",
        });
      }

      setVisible(false);
      cargarRoles();
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar el rol",
      });
    }
  };

  const eliminarRol = async (id) => {
    try {
      await rolApi.remove(id);
      toast.current.show({
        severity: "warn",
        summary: "Eliminado",
        detail: "Rol eliminado correctamente",
      });
      cargarRoles();
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el rol",
      });
    }
  };

  return (
    <div className="p-0 animate-fadeIn">
      {/* === ENCABEZADO === */}
      <Card
        title={
          <div className="flex justify-between items-center pr-2">
            <div className="flex items-center gap-2 text-indigo-900 font-semibold">
              <i className="pi pi-shield text-indigo-600 text-lg"></i>
              <span className="text-xl">Gestión de Roles</span>
            </div>
            <Button
              label="Nuevo Rol"
              icon="pi pi-plus"
              className="bg-blue-500 hover:bg-blue-600 border-none shadow-md text-white px-3 py-1.5 rounded-lg transition-all text-sm"
              onClick={abrirNuevo}
            />
          </div>
        }
        className="rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-md bg-white/80"
      >
        {/* === TABLA === */}
        <div className="rounded-xl overflow-hidden mt-4">
          <DataTable
            value={roles}
            paginator
            rows={10}
            className="text-sm"
            stripedRows
            emptyMessage="No hay roles registrados"
            responsiveLayout="scroll"
          >
            <Column field="idRol" header="ID" style={{ width: "8%" }} />
            <Column
              field="codigoInterno"
              header="Codigo Interno"
              style={{ width: "8%" }}
            />
            <Column field="nombre" header="Nombre" style={{ width: "25%" }} />
            <Column field="descripcion" header="Descripción" />
            <Column
              field="estaActivo"
              header="Activo"
              body={(row) => (
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-md ${
                    row.estaActivo
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {row.estaActivo ? "Sí" : "No"}
                </span>
              )}
              style={{ width: "10%", textAlign: "center" }}
            />
            <Column
              header="Acciones"
              body={(row) => (
                <div className="flex gap-2 justify-center">
                  <Button
                    icon="pi pi-pencil"
                    rounded
                    text
                    severity="info"
                    tooltip="Editar"
                    onClick={() => abrirEditar(row)}
                  />
                  <Button
                    icon="pi pi-trash"
                    rounded
                    text
                    severity="danger"
                    tooltip="Eliminar"
                    onClick={() => eliminarRol(row.idRol)}
                  />
                </div>
              )}
              style={{ width: "15%", textAlign: "center" }}
            />
          </DataTable>
        </div>
      </Card>

      {/* === DIÁLOGO === */}
      <Dialog
        header={
          <div className="flex items-center gap-2 text-indigo-900 font-semibold">
            <i className="pi pi-shield text-indigo-600"></i>
            <span>{editing ? "Editar Rol" : "Nuevo Rol"}</span>
          </div>
        }
        visible={visible}
        style={{ width: "36rem" }}
        modal
        className="rounded-xl backdrop-blur-xl bg-white/90"
        onHide={() => setVisible(false)}
      >
        <div className="p-fluid space-y-3">
          <div>
            <label className="font-medium text-slate-700">
              Codigo Interno *
            </label>
            <InputText
              value={form.codigoInterno}
              disabled={editing}
              onChange={(e) =>
                setForm({ ...form, codigoInterno: e.target.value })
              }
              autoComplete="off"
            />
          </div>

          <div>
            <label className="font-medium text-slate-700">Nombre *</label>
            <InputText
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              autoComplete="off"
            />
          </div>

          <div>
            <label className="font-medium text-slate-700">Descripción</label>
            <InputText
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
              autoComplete="off"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text text-slate-600 hover:text-red-500"
              onClick={() => setVisible(false)}
            />
            <Button
              label="Guardar"
              icon="pi pi-check"
              className="bg-indigo-600 hover:bg-indigo-700 border-none text-white px-4 py-2 rounded-lg transition-all"
              onClick={guardarRol}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
