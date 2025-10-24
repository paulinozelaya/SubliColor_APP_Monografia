import { useEffect, useState, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import clienteApi from "../api/cliente";
import personaApi from "../api/personas"; // para listar personas disponibles

export default function GestionClientes() {
  const [clientes, setClientes] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [editingCliente, setEditingCliente] = useState(null);

  const toast = useRef(null);

  useEffect(() => {
    cargarClientes();
    cargarPersonas();
  }, []);

  const cargarClientes = async () => {
    const data = await clienteApi.getAll();
    setClientes(data);
  };

  const cargarPersonas = async () => {
    const data = await personaApi.getAll();
    setPersonas(
      data.map((p) => ({
        label: `${p.primerNombre} ${p.primerApellido}`,
        value: p.idPersona,
      }))
    );
  };

  const guardarCliente = async () => {
    // Validación básica
    if (!selectedPersona) {
      toast.current.show({
        severity: "error",
        summary: "Error de Validación",
        detail: "Debe seleccionar una persona.",
      });
      return;
    }

    try {
      if (editingCliente) {
        await clienteApi.update(editingCliente.idCliente, {
          idPersona: selectedPersona,
        });
        toast.current.show({
          severity: "success",
          summary: "Cliente actualizado",
        });
      } else {
        await clienteApi.create({ idPersona: selectedPersona });
        toast.current.show({ severity: "success", summary: "Cliente creado" });
      }
      setVisible(false);
      setEditingCliente(null);
      setSelectedPersona(null);
      cargarClientes();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar",
      });
    }
  };

  const eliminarCliente = async (id) => {
    try {
      await clienteApi.remove(id);
      toast.current.show({ severity: "warn", summary: "Cliente eliminado" });
      cargarClientes();
    } catch {
      toast.current.show({ severity: "error", summary: "Error al eliminar" });
    }
  };

  const abrirEditar = (row) => {
    setEditingCliente(row);
    setSelectedPersona(row.idPersona);
    setVisible(true);
  };

  const abrirNuevo = () => {
    setEditingCliente(null);
    setSelectedPersona(null);
    setVisible(true);
  };

  return (
    <div className="p-0 animate-fadeIn">
      <Toast ref={toast} />

      {/* === Header Card === */}
      <Card
        title={
          <div className="flex justify-between items-center pr-2">
            {/* Título */}
            <div className="flex items-center gap-2 text-indigo-900 font-semibold">
              <i className="pi pi-users text-indigo-600 text-lg"></i>
              <span className="text-xl">Gestión de Clientes</span>
            </div>
            <Button
              label="Nuevo Cliente"
              icon="pi pi-plus"
              className="bg-blue-500 hover:bg-blue-600 border-none shadow-md text-white px-3 py-1.5 rounded-lg transition-all text-sm"
              onClick={abrirNuevo}
            />
          </div>
        }
        className="rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-md bg-white/80"
      >
        {/* Tabla de clientes */}
        <div className="rounded-xl overflow-hidden mt-4">
          <DataTable
            value={clientes}
            paginator
            rows={10}
            className="text-sm"
            emptyMessage="No hay clientes registrados"
            stripedRows
            responsiveLayout="scroll"
          >
            <Column field="idCliente" header="ID" sortable />
            <Column field="nombrePersona" header="Nombre Persona" sortable />
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
            />
            <Column
              header="Acciones"
              body={(row) => (
                <div className="flex gap-2">
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
            <i className="pi pi-user-plus text-indigo-600"></i>
            <span>{editingCliente ? "Editar Cliente" : "Nuevo Cliente"}</span>
          </div>
        }
        visible={visible}
        style={{ width: "36rem" }}
        modal
        className="rounded-xl backdrop-blur-xl bg-white/90"
        onHide={() => {
          setVisible(false);
          setEditingCliente(null);
          setSelectedPersona(null);
        }}
      >
        <div className="p-fluid space-y-4">
          <div className="field">
            <label className="font-medium text-slate-700">Persona</label>
            <Dropdown
              value={selectedPersona}
              options={personas}
              onChange={(e) => setSelectedPersona(e.value)}
              placeholder="Selecciona una persona"
              className="w-full bg-white"
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
              onClick={guardarCliente}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}