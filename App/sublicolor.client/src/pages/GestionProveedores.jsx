import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useToast } from "../context/ToastContext";
import proveedorApi from "../api/proveedor";

export default function GestionProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    idProveedor: null,
    nombreProveedor: "",
    ruc: "",
    telefono: "",
    correo: "",
    direccion: "",
  });
  const toast = useToast();

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      const data = await proveedorApi.getAll();
      setProveedores(data);
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los proveedores",
      });
    }
  };

  const abrirNuevo = () => {
    setForm({
      idProveedor: null,
      nombreProveedor: "",
      ruc: "",
      telefono: "",
      correo: "",
      direccion: "",
    });
    setEditing(false);
    setVisible(true);
  };

  const abrirEditar = (row) => {
    setForm(row);
    setEditing(true);
    setVisible(true);
  };

  const guardarProveedor = async () => {
    try {
      if (!form.nombreProveedor.trim()) {
        toast.current.show({
          severity: "warn",
          summary: "Campo requerido",
          detail: "El nombre del proveedor es obligatorio",
        });
        return;
      }

      if (editing) {
        await proveedorApi.update(form.idProveedor, form);
        toast.current.show({
          severity: "success",
          summary: "Actualizado",
          detail: "Proveedor actualizado correctamente",
        });
      } else {
        await proveedorApi.create(form);
        toast.current.show({
          severity: "success",
          summary: "Creado",
          detail: "Proveedor creado correctamente",
        });
      }

      setVisible(false);
      cargarProveedores();
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar el proveedor",
      });
    }
  };

  const eliminarProveedor = async (id) => {
    try {
      await proveedorApi.remove(id);
      toast.current.show({
        severity: "warn",
        summary: "Eliminado",
        detail: "Proveedor eliminado correctamente",
      });
      cargarProveedores();
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el proveedor",
      });
    }
  };

  return (
    <div className="p-0 animate-fadeIn">
      {/* === HEADER === */}
      <Card
        title={
          <div className="flex justify-between items-center pr-2">
            <div className="flex items-center gap-2 text-indigo-900 font-semibold">
              <i className="pi pi-truck text-indigo-600 text-lg"></i>
              <span className="text-xl">Gestión de Proveedores</span>
            </div>
            <Button
              label="Nuevo Proveedor"
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
            value={proveedores}
            paginator
            rows={10}
            className="text-sm"
            stripedRows
            emptyMessage="No hay proveedores registrados"
            responsiveLayout="scroll"
          >
            <Column field="nombreProveedor" header="Nombre" sortable />
            <Column field="ruc" header="RUC" sortable />
            <Column field="telefono" header="Teléfono" />
            <Column field="correo" header="Correo" />
            <Column field="direccion" header="Dirección" />
            <Column
              field="estaActivo"
              header="Activo"
              body={(row) =>
                row.estaActivo ? (
                  <span className="text-green-600 font-semibold">Sí</span>
                ) : (
                  <span className="text-red-600 font-semibold">No</span>
                )
              }
              style={{ width: "8%", textAlign: "center" }}
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
                    onClick={() => eliminarProveedor(row.idProveedor)}
                  />
                </div>
              )}
              style={{ width: "15%", textAlign: "center" }}
            />
          </DataTable>
        </div>
      </Card>

      {/* === DIALOG === */}
      <Dialog
        header={
          <div className="flex items-center gap-2 text-indigo-900 font-semibold">
            <i className="pi pi-truck text-indigo-600"></i>
            <span>{editing ? "Editar Proveedor" : "Nuevo Proveedor"}</span>
          </div>
        }
        visible={visible}
        style={{ width: "40rem" }}
        modal
        className="rounded-xl backdrop-blur-xl bg-white/90"
        onHide={() => setVisible(false)}
      >
        <div className="p-fluid space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-slate-700">
                Nombre Proveedor *
              </label>
              <InputText
                value={form.nombreProveedor}
                onChange={(e) =>
                  setForm({ ...form, nombreProveedor: e.target.value })
                }
                autoComplete="off"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700">RUC</label>
              <InputText
                value={form.ruc}
                onChange={(e) => setForm({ ...form, ruc: e.target.value })}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-slate-700">Teléfono</label>
              <InputText
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                autoComplete="off"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700">Correo</label>
              <InputText
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-slate-700">Dirección</label>
            <InputText
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
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
              onClick={guardarProveedor}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}   