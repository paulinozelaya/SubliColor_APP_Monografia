import { useEffect, useState, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import categoriaApi from "../api/categoria";
import { useToast } from "../context/ToastContext";

export default function GestionCategoria() {
  const [categorias, setCategorias] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    idCategoria: null,
    codigoInterno: "",
    nombre: "",
    descripcion: "",
  });
  const [editing, setEditing] = useState(false);
  const toast = useToast();

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const data = await categoriaApi.getAll();
      setCategorias(data);
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar las categorías",
      });
    }
  };

  const abrirNuevo = () => {
    setForm({ idCategoria: null, codigoInterno: "", nombre: "", descripcion: "" });
    setEditing(false);
    setVisible(true);
  };

  const abrirEditar = (row) => {
    setForm(row);
    setEditing(true);
    setVisible(true);
  };

  const guardarCategoria = async () => {
    try {
      if (!form.codigoInterno.trim() || !form.nombre.trim()) {
        toast.current.show({
          severity: "warn",
          summary: "Campos requeridos",
          detail: "Código y nombre son obligatorios",
        });
        return;
      }

      if (editing) {
        await categoriaApi.update(form.idCategoria, form);
        toast.current.show({
          severity: "success",
          summary: "Actualizado",
          detail: "Categoría actualizada correctamente",
        });
      } else {
        await categoriaApi.create(form);
        toast.current.show({
          severity: "success",
          summary: "Creado",
          detail: "Categoría creada correctamente",
        });
      }

      setVisible(false);
      cargarCategorias();
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar la categoría",
      });
    }
  };

  const eliminarCategoria = async (id) => {
    try {
      await categoriaApi.remove(id);
      toast.current.show({
        severity: "warn",
        summary: "Eliminada",
        detail: "Categoría eliminada correctamente",
      });
      cargarCategorias();
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar la categoría",
      });
    }
  };

  const resetForm = () => {
    setForm({ idCategoria: null, codigoInterno: "", nombre: "", descripcion: "" });
  };

  return (
    <div className="p-0 animate-fadeIn">
      {/* === Header Card === */}
      <Card
        title={
          <div className="flex justify-between items-center pr-2">
            <div className="flex items-center gap-2 text-indigo-900 font-semibold">
              <i className="pi pi-bars text-indigo-600 text-lg"></i>
              <span className="text-xl">Gestión de Categorías</span>
            </div>
            <Button
              label="Nueva Categoría"
              icon="pi pi-plus"
              className="bg-blue-500 hover:bg-blue-600 border-none shadow-md text-white px-3 py-1.5 rounded-lg transition-all text-sm"
              onClick={abrirNuevo}
            />
          </div>
        }
        className="rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-md bg-white/80"
      >
        {/* Tabla de categorías */}
        <div className="rounded-xl overflow-hidden mt-4">
          <DataTable
            value={categorias}
            paginator
            rows={10}
            className="text-sm"
            stripedRows
            responsiveLayout="scroll"
            emptyMessage="No hay categorías registradas"
          >
            <Column field="idCategoria" header="ID" sortable style={{ width: "6%" }} />
            <Column field="codigoInterno" header="Código" sortable style={{ width: "15%" }} />
            <Column field="nombre" header="Nombre" sortable style={{ width: "25%" }} />
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
                    onClick={() => eliminarCategoria(row.idCategoria)}
                  />
                </div>
              )}
              style={{ width: "12%", textAlign: "center" }}
            />
          </DataTable>
        </div>
      </Card>

      {/* === Diálogo === */}
      <Dialog
        header={
          <div className="flex items-center gap-2 text-indigo-900 font-semibold">
            <i className="pi pi-pencil text-indigo-600"></i>
            <span>{editing ? "Editar Categoría" : "Nueva Categoría"}</span>
          </div>
        }
        visible={visible}
        style={{ width: "35rem" }}
        modal
        className="rounded-xl backdrop-blur-xl bg-white/95"
        onHide={() => setVisible(false)}
      >
        <div className="p-fluid space-y-3">
          <div>
            <label className="text-slate-700 font-medium">
              Código Interno <span className="text-red-500">*</span>
            </label>
            <InputText
              value={form.codigoInterno}
              disabled={editing}
              onChange={(e) =>
                setForm({ ...form, codigoInterno: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-slate-700 font-medium">
              Nombre <span className="text-red-500">*</span>
            </label>
            <InputText
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </div>

          <div>
            <label className="text-slate-700 font-medium">Descripción</label>
            <InputText
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
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
              onClick={guardarCategoria}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
