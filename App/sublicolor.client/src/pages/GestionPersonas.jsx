import { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { TabView, TabPanel } from "primereact/tabview";
import personaApi from "../api/personas";
import catalogosApi from "../api/catalogos";
import { useToast } from "../context/ToastContext";

export default function GestionPersonas() {
  const [personas, setPersonas] = useState([]);
  const [visible, setVisible] = useState(false);
  const [tiposContacto, setTiposContacto] = useState([]);
  const [tiposIdentificacion, setTiposIdentificacion] = useState([]);

  const [form, setForm] = useState({
    idPersona: null,
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    contactos: [{ idTipoContacto: null, contacto: "" }],
    direcciones: [{ idPersonaDireccion: null, direccion: "" }],
    identificaciones: [{ idTipoIdentificacion: null, identificacion: "" }],
  });

  const toast = useToast();

  useEffect(() => {
    cargarPersonas();
    cargarCatalogos();
  }, []);

  const cargarPersonas = async () => {
    try {
      const data = await personaApi.getAll();
      setPersonas(data);
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar las personas",
      });
    }
  };

  const cargarCatalogos = async () => {
    try {
      setTiposContacto(await catalogosApi.getValores("TC"));
      setTiposIdentificacion(await catalogosApi.getValores("TI"));
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error al cargar catálogos",
      });
    }
  };

  const abrirNuevo = () => {
    resetForm();
    setVisible(true);
  };

  const abrirEditar = (p) => {
    setForm({
      idPersona: p.idPersona,
      primerNombre: p.primerNombre,
      segundoNombre: p.segundoNombre,
      primerApellido: p.primerApellido,
      segundoApellido: p.segundoApellido,
      contactos: p.contactos?.length
        ? p.contactos
        : [{ idTipoContacto: null, contacto: "" }],
      direcciones: p.direcciones?.length
        ? p.direcciones
        : [{ idPersonaDireccion: null, direccion: "" }],
      identificaciones: p.identificaciones?.length
        ? p.identificaciones
        : [{ idTipoIdentificacion: null, identificacion: "" }],
    });
    setVisible(true);
  };

  const resetForm = () => {
    setForm({
      idPersona: null,
      primerNombre: "",
      segundoNombre: "",
      primerApellido: "",
      segundoApellido: "",
      contactos: [{ idTipoContacto: null, contacto: "" }],
      direcciones: [{ idPersonaDireccion: null, direccion: "" }],
      identificaciones: [{ idTipoIdentificacion: null, identificacion: "" }],
    });
  };

  const guardarPersona = async () => {
    // ✅ Ejecutar validación primero
    if (!validarFormulario()) return;

    try {
      if (form.idPersona) {
        await personaApi.update(form.idPersona, form);
        toast.current.show({
          severity: "success",
          summary: "Persona actualizada correctamente",
          life: 3000,
        });
      } else {
        await personaApi.create(form);
        toast.current.show({
          severity: "success",
          summary: "Persona creada correctamente",
          life: 3000,
        });
      }
      setVisible(false);
      resetForm();
      cargarPersonas();
    } catch (error) {
      let message = "Ocurrió un error";
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        message = Object.values(errors).flat().join(" | ");
      } else if (typeof error.response?.data === "string") {
        message = error.response.data;
      } else if (error.response?.data?.title) {
        message = error.response.data.title;
      }

      toast.current.show({
        severity: "error",
        summary: "Error al guardar persona",
        detail: message,
        life: 5000,
      });
    }
  };

  const eliminarPersona = async (id) => {
    try {
      await personaApi.remove(id);
      toast.current.show({
        severity: "warn",
        summary: "Persona eliminada correctamente",
      });
      cargarPersonas();
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error al eliminar persona",
      });
    }
  };

  const agregarItem = (tipo) => {
    if (tipo === "contactos") {
      setForm({
        ...form,
        contactos: [...form.contactos, { idTipoContacto: null, contacto: "" }],
      });
    } else if (tipo === "direcciones") {
      setForm({
        ...form,
        direcciones: [
          ...form.direcciones,
          { idPersonaDireccion: null, direccion: "" },
        ],
      });
    } else if (tipo === "identificaciones") {
      setForm({
        ...form,
        identificaciones: [
          ...form.identificaciones,
          { idTipoIdentificacion: null, identificacion: "" },
        ],
      });
    }
  };

  const eliminarItem = (tipo, index) => {
    const updated = [...form[tipo]];
    updated.splice(index, 1);
    setForm({ ...form, [tipo]: updated });
  };

  const actualizarItem = (tipo, index, field, value) => {
    const items = [...form[tipo]];
    items[index][field] = value;
    setForm({ ...form, [tipo]: items });
  };

  const validarFormulario = () => {
    // 1️⃣ Validar datos personales
    if (!form.primerNombre.trim()) {
      toast.current.show({
        severity: "warn",
        summary: "Campo obligatorio",
        detail: "El primer nombre es obligatorio",
        life: 4000,
      });
      return false;
    }

    if (!form.primerApellido.trim()) {
      toast.current.show({
        severity: "warn",
        summary: "Campo obligatorio",
        detail: "El primer apellido es obligatorio",
        life: 4000,
      });
      return false;
    }

    // 2️⃣ Validar contactos
    const contactosValidos = form.contactos.filter(
      (c) => c.idTipoContacto && c.contacto.trim()
    );
    if (contactosValidos.length === 0) {
      toast.current.show({
        severity: "warn",
        summary: "Contacto requerido",
        detail: "Debe agregar al menos un contacto válido",
        life: 4000,
      });
      return false;
    }

    // 3️⃣ Validar direcciones
    const direccionesValidas = form.direcciones.filter(
      (d) => d.direccion && d.direccion.trim()
    );
    if (direccionesValidas.length === 0) {
      toast.current.show({
        severity: "warn",
        summary: "Dirección requerida",
        detail: "Debe ingresar al menos una dirección",
        life: 4000,
      });
      return false;
    }

    // 4️⃣ Validar identificaciones (siempre debe haber al menos una válida)
    const identificacionesValidas = form.identificaciones.filter(
      (i) => i.idTipoIdentificacion && i.identificacion.trim()
    );
    if (identificacionesValidas.length === 0) {
      toast.current.show({
        severity: "warn",
        summary: "Identificación requerida",
        detail: "Debe agregar al menos una identificación válida",
        life: 4000,
      });
      return false;
    }

    return true;
  };

  return (
    <div className="p-0 animate-fadeIn">
      {/* === Card principal === */}
      <Card
        title={
          <div className="flex justify-between items-center pr-2">
            <div className="flex items-center gap-2 text-indigo-900 font-semibold">
              <i className="pi pi-id-card text-indigo-600 text-lg"></i>
              <span className="text-xl">Gestión de Personas</span>
            </div>
            <Button
              label="Nueva Persona"
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
            value={personas}
            paginator
            rows={10}
            stripedRows
            responsiveLayout="scroll"
            emptyMessage="No hay personas registradas"
          >
            <Column field="idPersona" header="ID" sortable></Column>
            <Column
              field="primerNombre"
              header="Nombre"
              body={(p) => `${p.primerNombre} ${p.segundoNombre || ""}`.trim()}
              sortable
            ></Column>
            <Column
              field="primerApellido"
              header="Apellido"
              body={(p) =>
                `${p.primerApellido} ${p.segundoApellido || ""}`.trim()
              }
              sortable
            ></Column>
            <Column
              header="Acciones"
              body={(p) => (
                <div className="flex gap-2">
                  <Button
                    icon="pi pi-pencil"
                    rounded
                    text
                    severity="info"
                    tooltip="Editar"
                    onClick={() => abrirEditar(p)}
                  />
                  <Button
                    icon="pi pi-trash"
                    rounded
                    text
                    severity="danger"
                    tooltip="Eliminar"
                    onClick={() => eliminarPersona(p.idPersona)}
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
            <span>{form.idPersona ? "Editar Persona" : "Nueva Persona"}</span>
          </div>
        }
        visible={visible}
        style={{ width: "44rem" }}
        modal
        className="rounded-xl backdrop-blur-xl bg-white/95"
        onHide={() => setVisible(false)}
      >
        <div className="p-fluid">
          {/* === DATOS PERSONALES === */}
          <h3 className="text-indigo-700 text-lg font-semibold mb-3">
            Datos personales
          </h3>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <label className="text-slate-700 font-medium">
                Primer Nombre <span style={{ color: "red" }}>*</span>
              </label>
              <InputText
                className={!form.primerNombre.trim() ? "p-invalid" : ""}
                value={form.primerNombre}
                onChange={(e) =>
                  setForm({ ...form, primerNombre: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium">
                Segundo Nombre
              </label>
              <InputText
                value={form.segundoNombre}
                onChange={(e) =>
                  setForm({ ...form, segundoNombre: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium">
                Primer Apellido <span style={{ color: "red" }}>*</span>
              </label>
              <InputText
                className={!form.primerApellido.trim() ? "p-invalid" : ""}
                value={form.primerApellido}
                onChange={(e) =>
                  setForm({ ...form, primerApellido: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium">
                Segundo Apellido
              </label>
              <InputText
                value={form.segundoApellido}
                onChange={(e) =>
                  setForm({ ...form, segundoApellido: e.target.value })
                }
              />
            </div>
          </div>

          {/* === SECCIONES CON TABS === */}
          <TabView className="custom-tabs">
            {/* CONTACTOS */}
            <TabPanel header="📞 Contactos">
              {form.contactos.map((c, index) => {
                const invalidTipo = !c.idTipoContacto;
                const invalidValor = !c.contacto.trim();

                return (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 mb-3 items-center"
                  >
                    <div className="col-span-5">
                      <Dropdown
                        value={c.idTipoContacto}
                        options={tiposContacto}
                        optionLabel="nombre"
                        optionValue="idValor"
                        placeholder="Tipo de contacto"
                        className={invalidTipo ? "p-invalid" : ""}
                        onChange={(e) =>
                          actualizarItem(
                            "contactos",
                            index,
                            "idTipoContacto",
                            e.value
                          )
                        }
                      />
                    </div>
                    <div className="col-span-6">
                      <InputText
                        placeholder="Ej. +505 8888-8888"
                        className={invalidValor ? "p-invalid" : ""}
                        value={c.contacto || ""}
                        onChange={(e) =>
                          actualizarItem(
                            "contactos",
                            index,
                            "contacto",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button
                        icon="pi pi-trash"
                        className="p-button-rounded p-button-text text-red-600"
                        tooltip="Eliminar"
                        onClick={() => eliminarItem("contactos", index)}
                      />
                    </div>
                  </div>
                );
              })}
              <Button
                icon="pi pi-plus"
                label="Agregar contacto"
                className="bg-blue-500 hover:bg-blue-600 text-white border-none mt-2"
                onClick={() => agregarItem("contactos")}
              />
            </TabPanel>

            {/* DIRECCIONES */}
            <TabPanel header="🏠 Direcciones">
              {form.direcciones.map((d, index) => {
                const invalidDir = !d.direccion.trim();

                return (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 mb-3 items-center"
                  >
                    <div className="col-span-11">
                      <InputText
                        placeholder="Ej. Avenida Central, casa #24, Managua"
                        className={invalidDir ? "p-invalid" : ""}
                        value={d.direccion || ""}
                        onChange={(e) =>
                          actualizarItem(
                            "direcciones",
                            index,
                            "direccion",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button
                        icon="pi pi-trash"
                        className="p-button-rounded p-button-text text-red-600"
                        tooltip="Eliminar"
                        onClick={() => eliminarItem("direcciones", index)}
                      />
                    </div>
                  </div>
                );
              })}
              <Button
                icon="pi pi-plus"
                label="Agregar dirección"
                className="bg-blue-500 hover:bg-blue-600 text-white border-none mt-2"
                onClick={() => agregarItem("direcciones")}
              />
            </TabPanel>

            {/* IDENTIFICACIONES */}
            <TabPanel header="🪪 Identificaciones">
              {form.identificaciones.map((i, index) => {
                const invalidTipo = !i.idTipoIdentificacion;
                const invalidVal = !i.identificacion.trim();

                return (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 mb-3 items-center"
                  >
                    <div className="col-span-5">
                      <Dropdown
                        value={i.idTipoIdentificacion}
                        options={tiposIdentificacion}
                        optionLabel="nombre"
                        optionValue="idValor"
                        placeholder="Tipo de identificación"
                        className={invalidTipo ? "p-invalid" : ""}
                        onChange={(e) =>
                          actualizarItem(
                            "identificaciones",
                            index,
                            "idTipoIdentificacion",
                            e.value
                          )
                        }
                      />
                    </div>
                    <div className="col-span-6">
                      <InputText
                        placeholder="Número de documento"
                        className={invalidVal ? "p-invalid" : ""}
                        value={i.identificacion || ""}
                        onChange={(e) =>
                          actualizarItem(
                            "identificaciones",
                            index,
                            "identificacion",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button
                        icon="pi pi-trash"
                        className="p-button-rounded p-button-text text-red-600"
                        tooltip="Eliminar"
                        onClick={() => eliminarItem("identificaciones", index)}
                      />
                    </div>
                  </div>
                );
              })}
              <Button
                icon="pi pi-plus"
                label="Agregar identificación"
                className="bg-blue-500 hover:bg-blue-600 text-white border-none mt-2"
                onClick={() => agregarItem("identificaciones")}
              />
            </TabPanel>
          </TabView>

          {/* === BOTONES === */}
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
              onClick={guardarPersona}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
