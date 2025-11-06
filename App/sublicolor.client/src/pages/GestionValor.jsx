import { useEffect, useState, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import valorApi from "../api/valor";
import categoriaApi from "../api/categoria";
import { useToast } from "../context/ToastContext";

export default function GestionValor() {
  const [valores, setValores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    idValor: null,
    idCategoria: null,
    codigoInterno: "",
    nombre: "",
    descripcion: "",
  });
  const [editing, setEditing] = useState(false);
  const toast = useToast();

  useEffect(() => {
    cargarValores();
    cargarCategorias();
  }, []);

  const cargarValores = async () => {
    try {
      const data = await valorApi.getAll();
      setValores(data);
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los valores",
      });
    }
  };

  const cargarCategorias = async () => {
    const data = await categoriaApi.getAll();
    setCategorias(data.map((c) => ({ label: c.nombre, value: c.idCategoria })));
  };

  const abrirNuevo = () => {
    setForm({
      idValor: null,
      idCategoria: null,
      codigoInterno: "",
      nombre: "",
      descripcion: "",
    });
    setEditing(false);
    setVisible(true);
  };

  const abrirEditar = (row) => {
    setForm(row);
    setEditing(true);
    setVisible(true);
  };

  const guardarValor = async () => {
    try {
      if (!form.nombre.trim() || !form.idCategoria) {
        toast.current.show({
          severity: "warn",
          summary: "Campos requeridos",
          detail: "Nombre y categoría son obligatorios",
        });
        return;
      }

      if (editing) {
        await valorApi.update(form.idValor, form);
        toast.current.show({
          severity: "success",
          summary: "Actualizado",
          detail: "Valor actualizado correctamente",
        });
      } else {
        await valorApi.create(form);
        toast.current.show({
          severity: "success",
          summary: "Creado",
          detail: "Valor creado correctamente",
        });
      }

      setVisible(false);
      cargarValores();
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar el valor",
      });
    }
  };

  const eliminarValor = async (id) => {
    try {
      await valorApi.remove(id);
      toast.current.show({
        severity: "warn",
        summary: "Eliminado",
        detail: "Valor eliminado correctamente",
      });
      cargarValores();
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el valor",
      });
    }
  };

  return (
    <div className="p-0 animate-fadeIn">
      {/* === Header Card === */}
      <Card
        title={
          <div className="flex justify-between items-center pr-2">
            <div className="flex items-center gap-2 text-indigo-900 font-semibold">
              <i className="pi pi-tags text-indigo-600 text-lg"></i>
              <span className="text-xl">Gestión de Valores</span>
            </div>
            <Button
              label="Nuevo Valor"
              icon="pi pi-plus"
              className="bg-blue-500 hover:bg-blue-600 border-none shadow-md text-white px-3 py-1.5 rounded-lg transition-all text-sm"
              onClick={abrirNuevo}
            />
          </div>
        }
        className="rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-md bg-white/80"
      >
        <div className="rounded-xl overflow-hidden mt-4">
          <DataTable
            value={valores}
            paginator
            rows={10}
            className="text-sm"
            stripedRows
            responsiveLayout="scroll"
            emptyMessage="No hay valores registrados"
          >
            <Column field="idValor" header="ID" style={{ width: "6%" }} />
            <Column field="nombreCategoria" header="Categoría" sortable style={{ width: "20%" }} />
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
                    onClick={() => eliminarValor(row.idValor)}
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
            <span>{editing ? "Editar Valor" : "Nuevo Valor"}</span>
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
            <label className="text-slate-700 font-medium">Categoría *</label>
            <Dropdown
              value={form.idCategoria}
              options={categorias}
              onChange={(e) => setForm({ ...form, idCategoria: e.value })}
              placeholder="Selecciona una categoría"
              className="w-full"
            />
          </div>

          <div>
            <label className="text-slate-700 font-medium">Código Interno</label>
            <InputText
              value={form.codigoInterno}
              onChange={(e) =>
                setForm({ ...form, codigoInterno: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-slate-700 font-medium">Nombre *</label>
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
              onClick={guardarValor}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
