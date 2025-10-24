import { useEffect, useState, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import usuarioApi from "../api/usuario";
import personaApi from "../api/personas";
import rolApi from "../api/rol";

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [roles, setRoles] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    idUsuario: null,
    usuario: "",
    email: "",
    clave: "",
    idPersona: null,
    roles: [],
  });
  const toast = useRef(null);

  useEffect(() => {
    cargarUsuarios();
    cargarPersonas();
    cargarRoles();
  }, []);

  const cargarUsuarios = async () => {
    const data = await usuarioApi.getAll();
    setUsuarios(data);
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

  const cargarRoles = async () => {
    const data = await rolApi.getAll();
    setRoles(
      data.map((r) => ({
        label: r.nombre,
        value: r.idRol,
      }))
    );
  };

  const guardarUsuario = async () => {
    try {
      if (form.idUsuario) {
        await usuarioApi.update(form.idUsuario, form);
        toast.current.show({
          severity: "success",
          summary: "Usuario actualizado correctamente",
        });
      } else {
        await usuarioApi.create(form);
        toast.current.show({
          severity: "success",
          summary: "Usuario creado correctamente",
        });
      }
      setVisible(false);
      resetForm();
      cargarUsuarios();
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error al guardar usuario",
      });
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      await usuarioApi.remove(id);
      toast.current.show({
        severity: "warn",
        summary: "Usuario eliminado correctamente",
      });
      cargarUsuarios();
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error al eliminar usuario",
      });
    }
  };

  const abrirEditar = (row) => {
    console.log(row)
    setForm({
      idUsuario: row.idUsuario,
      usuario: row.usuario,
      email: row.email,
      clave: "",
      idPersona: row.idPersona,
      roles: row.rolesIds || [],
    });
    setVisible(true);
  };

  const resetForm = () => {
    setForm({
      idUsuario: null,
      usuario: "",
      email: "",
      clave: "",
      idPersona: null,
      roles: [],
    });
  };

  return (
    <div className="p-0 animate-fadeIn">
      <Toast ref={toast} />

      {/* === Header Card === */}
      <Card
        title={
          <div className="flex justify-between items-center pr-2">
            <div className="flex items-center gap-2 text-indigo-900 font-semibold">
              <i className="pi pi-users text-indigo-600 text-lg"></i>
              <span className="text-xl">Gestión de Usuarios</span>
            </div>
            <Button
              label="Nuevo Usuario"
              icon="pi pi-plus"
              className="bg-blue-500 hover:bg-blue-600 border-none shadow-md text-white px-3 py-1.5 rounded-lg transition-all text-sm"
              onClick={() => {
                resetForm();
                setVisible(true);
              }}
            />
          </div>
        }
        className="rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-md bg-white/80"
      >

        {/* Tabla de usuarios */}
        <div className="rounded-xl overflow-hidden mt-4">
          <DataTable
            value={usuarios}
            paginator
            rows={10}
            className="text-sm"
            emptyMessage="No hay usuarios registrados"
            stripedRows
            responsiveLayout="scroll"
          >
            <Column field="idUsuario" header="ID" sortable></Column>
            <Column field="usuario" header="Usuario" sortable></Column>
            <Column field="email" header="Email" sortable></Column>
            <Column field="nombrePersona" header="Persona" sortable></Column>
            <Column
              field="roles"
              header="Roles"
              body={(row) => (
                <span className="text-indigo-700 font-medium">
                  {row.roles.join(", ")}
                </span>
              )}
            />
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
                    onClick={() => eliminarUsuario(row.idUsuario)}
                  />
                </div>
              )}
            />
          </DataTable>
        </div>
      </Card>

      {/* === Diálogo === */}
      {/* === Diálogo === */}
      <Dialog
        header={
          <div className="flex items-center gap-2 text-indigo-900 font-semibold">
            <i className="pi pi-user-edit text-indigo-600"></i>
            <span>{form.idUsuario ? "Editar Usuario" : "Nuevo Usuario"}</span>
          </div>
        }
        visible={visible}
        style={{ width: "36rem" }}
        modal
        className="rounded-xl backdrop-blur-xl bg-white/90"
        onHide={() => setVisible(false)}
      >
        <div className="p-fluid space-y-3">
          <div className="field">
            <label className="font-medium text-slate-700">Usuario</label>
            <InputText
              value={form.usuario}
              onChange={(e) => setForm({ ...form, usuario: e.target.value })}
              autoComplete="off"
            />
          </div>

          <div className="field">
            <label className="font-medium text-slate-700">Email</label>
            <InputText
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="off"
            />
          </div>

          {!form.idUsuario && (
            <div className="field">
              <label className="font-medium text-slate-700">Contraseña</label>
              <Password
                value={form.clave}
                onChange={(e) => setForm({ ...form, clave: e.target.value })}
                toggleMask
                feedback={false}
                inputProps={{ autoComplete: "new-password" }}
              />
            </div>
          )}

          <div className="field">
            <label className="font-medium text-slate-700">Persona</label>
            <Dropdown
              value={form.idPersona}
              options={personas}
              onChange={(e) => setForm({ ...form, idPersona: e.value })}
              placeholder="Selecciona una persona"
              className="w-full bg-white" 
            />
          </div>

          <div className="field">
            <label className="font-medium text-slate-700">Roles</label>
            <MultiSelect
              value={form.roles}
              options={roles}
              onChange={(e) => setForm({ ...form, roles: e.value })}
              placeholder="Selecciona roles"
              display="chip"
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
              onClick={guardarUsuario}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}