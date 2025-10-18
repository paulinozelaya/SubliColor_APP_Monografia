import { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { TabView, TabPanel } from "primereact/tabview";
import { Dropdown } from "primereact/dropdown";
import api from "../api/personas";
import catalogosApi from "../api/catalogos";

export default function GestionPersonas() {
  const [persona, setPersona] = useState({
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    contactos: [],
    direcciones: [],
    identificaciones: [],
  });

  const [tiposContacto, setTiposContacto] = useState([]);
  const [tiposDireccion, setTiposDireccion] = useState([]);
  const [tiposIdentificacion, setTiposIdentificacion] = useState([]);
  const toast = useRef(null);

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        setTiposContacto(await catalogosApi.getValores("TIPO_CONTACTO"));
        setTiposDireccion(await catalogosApi.getValores("TIPO_DIRECCION"));
        setTiposIdentificacion(await catalogosApi.getValores("TIPO_IDENTIFICACION"));
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudieron cargar los catálogos",
          life: 3000,
        });
      }
    };
    cargarCatalogos();
  }, []);

  const handleChange = (field, value) => {
    setPersona({ ...persona, [field]: value });
  };

  const agregarItem = (tipo) => {
    setPersona({
      ...persona,
      [tipo]: [...persona[tipo], { idTipoContacto: null, contacto: "" }],
    });
  };

  const actualizarItem = (tipo, index, field, value) => {
    const items = [...persona[tipo]];
    items[index][field] = value;
    setPersona({ ...persona, [tipo]: items });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.crearPersona(persona);
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Persona guardada correctamente",
        life: 3000,
      });
      setPersona({
        primerNombre: "",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
        contactos: [],
        direcciones: [],
        identificaciones: [],
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data || "No se pudo guardar la persona",
        life: 3000,
      });
    }
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <Card title="Gestión de Personas" className="shadow-3">
        <form onSubmit={handleSubmit} className="p-fluid">
          {/* Datos básicos */}
          <div className="grid">
            <div className="col-6">
              <label>Primer Nombre</label>
              <InputText
                value={persona.primerNombre}
                onChange={(e) => handleChange("primerNombre", e.target.value)}
                required
              />
            </div>
            <div className="col-6">
              <label>Segundo Nombre</label>
              <InputText
                value={persona.segundoNombre}
                onChange={(e) => handleChange("segundoNombre", e.target.value)}
              />
            </div>
            <div className="col-6">
              <label>Primer Apellido</label>
              <InputText
                value={persona.primerApellido}
                onChange={(e) => handleChange("primerApellido", e.target.value)}
                required
              />
            </div>
            <div className="col-6">
              <label>Segundo Apellido</label>
              <InputText
                value={persona.segundoApellido}
                onChange={(e) => handleChange("segundoApellido", e.target.value)}
              />
            </div>
          </div>

          {/* Tabs */}
          <TabView className="mt-4">
            {/* Contactos */}
            <TabPanel header="Contactos">
              {persona.contactos.map((c, index) => (
                <div key={index} className="grid mb-2">
                  <div className="col-4">
                    <Dropdown
                      value={c.idTipoContacto}
                      options={tiposContacto}
                      optionLabel="nombre"
                      optionValue="idValor"
                      placeholder="Seleccione tipo"
                      onChange={(e) =>
                        actualizarItem("contactos", index, "idTipoContacto", e.value)
                      }
                    />
                  </div>
                  <div className="col-8">
                    <InputText
                      placeholder="Contacto"
                      value={c.contacto || ""}
                      onChange={(e) =>
                        actualizarItem("contactos", index, "contacto", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                label="Agregar Contacto"
                icon="pi pi-plus"
                className="mt-2"
                onClick={() => agregarItem("contactos")}
              />
            </TabPanel>

            {/* Direcciones */}
            <TabPanel header="Direcciones">
              {persona.direcciones.map((d, index) => (
                <div key={index} className="grid mb-2">
                  <div className="col-4">
                    <Dropdown
                      value={d.idTipoContacto}
                      options={tiposDireccion}
                      optionLabel="nombre"
                      optionValue="idValor"
                      placeholder="Seleccione tipo"
                      onChange={(e) =>
                        actualizarItem("direcciones", index, "idTipoContacto", e.value)
                      }
                    />
                  </div>
                  <div className="col-8">
                    <InputText
                      placeholder="Dirección"
                      value={d.contacto || ""}
                      onChange={(e) =>
                        actualizarItem("direcciones", index, "contacto", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                label="Agregar Dirección"
                icon="pi pi-plus"
                className="mt-2"
                onClick={() => agregarItem("direcciones")}
              />
            </TabPanel>

            {/* Identificaciones */}
            <TabPanel header="Identificaciones">
              {persona.identificaciones.map((i, index) => (
                <div key={index} className="grid mb-2">
                  <div className="col-4">
                    <Dropdown
                      value={i.idTipoContacto}
                      options={tiposIdentificacion}
                      optionLabel="nombre"
                      optionValue="idValor"
                      placeholder="Seleccione tipo"
                      onChange={(e) =>
                        actualizarItem("identificaciones", index, "idTipoContacto", e.value)
                      }
                    />
                  </div>
                  <div className="col-8">
                    <InputText
                      placeholder="Número"
                      value={i.contacto || ""}
                      onChange={(e) =>
                        actualizarItem("identificaciones", index, "contacto", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                label="Agregar Identificación"
                icon="pi pi-plus"
                className="mt-2"
                onClick={() => agregarItem("identificaciones")}
              />
            </TabPanel>
          </TabView>

          {/* Botón Guardar */}
          <Button
            type="submit"
            label="Guardar Persona"
            icon="pi pi-save"
            className="mt-4"
          />
        </form>
      </Card>
    </div>
  );
}