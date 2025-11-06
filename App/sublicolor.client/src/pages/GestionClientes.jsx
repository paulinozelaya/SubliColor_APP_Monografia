import { useEffect, useState, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import clienteApi from "../api/cliente";
import personaApi from "../api/personas";
import { useToast } from "../context/ToastContext";

export default function GestionClientes() {
  const [clientes, setClientes] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    idCliente: null,
    idPersona: null,
    estaActivo: true,
  });

 const toast = useToast();

  // Cargar datos iniciales
  useEffect(() => {
    cargarClientes();
    cargarPersonas();
  }, []);

  const cargarClientes = async () => {
    try {
      const data = await clienteApi.getAll();
      setClientes(data);
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los clientes",
      });
    }
  };

  const cargarPersonas = async () => {
    try {
      const data = await personaApi.getAll();
      setPersonas(
        data.map((p) => ({
          label: `${p.primerNombre} ${p.primerApellido}`,
          value: p.idPersona,
        }))
      );
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar las personas",
      });
    }
  };

  const guardarCliente = async () => {
    if (!form.idPersona) {
      toast.current.show({
        severity: "warn",
        summary: "Campo obligatorio",
        detail: "Debe seleccionar una persona",
        life: 3000,
      });
      return;
    }

    try {
      if (form.idCliente) {
        await clienteApi.update(form.idCliente, { idPersona: form.idPersona });
        toast.current.show({
          severity: "success",
          summary: "Cliente actualizado correctamente",
          life: 3000,
        });
      } else {
        await clienteApi.create({ idPersona: form.idPersona });
        toast.current.show({
          severity: "success",
          summary: "Cliente creado correctamente",
          life: 3000,
        });
      }
      setVisible(false);
      resetForm();
      cargarClientes();
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error al guardar el cliente",
        life: 3000,
      });
    }
  };

  const eliminarCliente = async (id) => {
    try {
      await clienteApi.remove(id);
      toast.current.show({
        severity: "warn",
        summary: "Cliente eliminado correctamente",
      });
      cargarClientes();
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error al eliminar cliente",
      });
    }
  };

  const abrirEditar = (row) => {
    setForm({
      idCliente: row.idCliente,
      idPersona: row.idPersona,
      estaActivo: row.estaActivo,
    });
    setVisible(true);
  };

  const abrirNuevo = () => {
    resetForm();
    setVisible(true);
  };

  const resetForm = () => {
    setForm({
      idCliente: null,
      idPersona: null,
      estaActivo: true,
    });
  };

  return (
    <div className="p-0 animate-fadeIn">
      <Card
        title={
          <div className="flex justify-between items-center pr-2">
            <div className="flex items-center gap-2 text-indigo-900 font-semibold">
              <i className="pi pi-users text-indigo-600 text-lg"></i>
              <span className="text-xl">Gestión de Clientes</span>
            </div>
            <Button
              label="Nuevo Cliente"
              icon="pi pi-plus"
              className="bg-blue-500 hover:bg-blue-600 border-none text-white shadow-md px-3 py-1.5 rounded-lg transition-all text-sm"
              onClick={abrirNuevo}
            />
          </div>
        }
        className="rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-md bg-white/80"
      >
        <div className="rounded-xl overflow-hidden mt-4">
          <DataTable
            value={clientes}
            paginator
            rows={10}
            stripedRows
            responsiveLayout="scroll"
            emptyMessage="No hay clientes registrados"
          >
            <Column field="idCliente" header="ID" sortable />
            <Column field="nombrePersona" header="Persona" sortable />
            <Column
              field="estaActivo"
              header="Activo"
              body={(row) =>
                row.estaActivo ? (
                  <span className="text-green-600 font-medium">Sí</span>
                ) : (
                  <span className="text-red-500 font-medium">No</span>
                )
              }
            />
            <Column
              header="Acciones"
              body={(row) => (
                <div className="flex gap-2">
                  {/* <Button
                    icon="pi pi-pencil"
                    rounded
                    text
                    severity="info"
                    tooltip="Editar"
                    onClick={() => abrirEditar(row)}
                  /> */}
                  <Button
                    icon="pi pi-trash"
                    rounded
                    text
                    severity="danger"
                    tooltip="Eliminar"
                    onClick={() => eliminarCliente(row.idCliente)}
                  />
                </div>
              )}
            />
          </DataTable>
        </div>
      </Card>

      {/* === Diálogo === */}
      <Dialog
        header={
          <div className="flex items-center gap-2 text-indigo-900 font-semibold">
            <i className="pi pi-user-edit text-indigo-600"></i>
            <span>{form.idCliente ? "Editar Cliente" : "Nuevo Cliente"}</span>
          </div>
        }
        visible={visible}
        style={{ width: "36rem" }}
        modal
        className="rounded-xl backdrop-blur-xl bg-white/95"
        onHide={() => setVisible(false)}
      >
        <div className="p-fluid">
          <label className="text-slate-700 font-medium">
            Persona <span style={{ color: "red" }}>*</span>
          </label>
          <Dropdown
            value={form.idPersona}
            options={personas}
            placeholder="Seleccione una persona"
            className={!form.idPersona ? "p-invalid" : ""}
            onChange={(e) => setForm({ ...form, idPersona: e.value })}
          />

          <div className="flex justify-end gap-3 mt-5">
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
              onClick={guardarCliente}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
