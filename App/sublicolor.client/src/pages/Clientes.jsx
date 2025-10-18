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
    try {
      if (editingCliente) {
        await clienteApi.update(editingCliente.idCliente, {
          idPersona: selectedPersona,
        });
        toast.current.show({ severity: "success", summary: "Cliente actualizado" });
      } else {
        await clienteApi.create({ idPersona: selectedPersona });
        toast.current.show({ severity: "success", summary: "Cliente creado" });
      }
      setVisible(false);
      setEditingCliente(null);
      setSelectedPersona(null);
      cargarClientes();
    } catch (err) {
      toast.current.show({ severity: "error", summary: "Error", detail: "No se pudo guardar" });
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

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <Card title="Gestión de Clientes">
        <Button
          label="Nuevo Cliente"
          icon="pi pi-plus"
          className="mb-3"
          onClick={() => setVisible(true)}
        />
        <DataTable value={clientes} paginator rows={10} responsiveLayout="scroll">
          <Column field="idCliente" header="ID" />
          <Column field="nombrePersona" header="Nombre Persona" />
          <Column
            field="estaActivo"
            header="Activo"
            body={(row) => (row.estaActivo ? "Sí" : "No")}
          />
          <Column
            header="Acciones"
            body={(row) => (
              <>
                <Button
                  icon="pi pi-pencil"
                  className="p-button-text p-button-sm mr-2"
                  onClick={() => abrirEditar(row)}
                />
                <Button
                  icon="pi pi-trash"
                  className="p-button-danger p-button-sm"
                  onClick={() => eliminarCliente(row.idCliente)}
                />
              </>
            )}
          />
        </DataTable>
      </Card>

      <Dialog
        header={editingCliente ? "Editar Cliente" : "Nuevo Cliente"}
        visible={visible}
        style={{ width: "30rem" }}
        modal
        onHide={() => setVisible(false)}
      >
        <div className="p-fluid">
          <div className="field">
            <label>Persona</label>
            <Dropdown
              value={selectedPersona}
              options={personas}
              onChange={(e) => setSelectedPersona(e.value)}
              placeholder="Selecciona una persona"
            />
          </div>
          <Button label="Guardar" icon="pi pi-check" onClick={guardarCliente} className="mt-3" />
        </div>
      </Dialog>
    </div>
  );
}
