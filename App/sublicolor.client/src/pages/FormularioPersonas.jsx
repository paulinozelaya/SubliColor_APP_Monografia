import { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { TabView, TabPanel } from "primereact/tabview";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import api from "../api/personas";
import catalogosApi from "../api/catalogos";

export default function FormularioPersona({ visible, onHide, onSave }) {
  const [persona, setPersona] = useState({
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    contactos: [], 
    direcciones: [],
    identificaciones: []
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
    let nuevoItem = {};
    if (tipo === "contactos") {
      nuevoItem = { idTipoContacto: null, contacto: "" };
    } else if (tipo === "direcciones") {
      nuevoItem = { idTipoDireccion: null, direccion: "" };
    } else if (tipo === "identificaciones") {
      nuevoItem = { idTipoIdentificacion: null, numero: "" };
    }

    setPersona({
      ...persona,
      [tipo]: [...persona[tipo], nuevoItem],
    });
  };
  
  // Función para eliminar un ítem
  const eliminarItem = (tipo, index) => {
    const items = persona[tipo].filter((_, i) => i !== index);
    setPersona({ ...persona, [tipo]: items });
  };

  // Función genérica para actualizar los items anidados
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
            
            onSave(); 
            onHide();
            
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: error.response?.data || "No se pudo guardar la persona",
                life: 3000,
            });
        }
    };
  
  // Componente reutilizable para renderizar un item anidado con botón de eliminar
  const ItemRow = ({ item, index, tipo, tiposCatalogo, idField, valueField, labelValue }) => (
    <div key={index} className="grid mb-2 items-center">
      <div className="col-4">
        <Dropdown
          value={item[idField]}
          options={tiposCatalogo}
          optionLabel="nombre"
          optionValue="idValor"
          placeholder="Seleccione tipo"
          onChange={(e) =>
            actualizarItem(tipo, index, idField, e.value)
          }
        />
      </div>
      <div className="col-7">
        <InputText
          placeholder={labelValue}
          value={item[valueField] || ""}
          onChange={(e) =>
            actualizarItem(tipo, index, valueField, e.target.value)
          }
        />
      </div>
      <div className="col-1 flex justify-content-end">
        {/* Muestra el botón de eliminar si hay más de 1 ítem */}
        {persona[tipo].length > 1 && (
          <Button
            type="button"
            icon="pi pi-trash"
            className="p-button-danger p-button-text"
            onClick={() => eliminarItem(tipo, index)}
          />
        )}
      </div>
    </div>
  );


  return (
    <form onSubmit={handleSubmit} className="p-fluid p-3">
      <Toast ref={toast} />
      <Card title="Nueva Persona" className="shadow-3">
        <form onSubmit={handleSubmit} className="p-fluid">
          {/* Datos básicos (Se mantiene como estaba) */}
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
                <ItemRow
                  key={index}
                  item={c}
                  index={index}
                  tipo="contactos"
                  tiposCatalogo={tiposContacto}
                  idField="idTipoContacto"
                  valueField="contacto"
                  labelValue="Contacto"
                />
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
                <ItemRow
                  key={index}
                  item={d}
                  index={index}
                  tipo="direcciones"
                  tiposCatalogo={tiposDireccion}
                  idField="idTipoDireccion" 
                  valueField="direccion" 
                  labelValue="Dirección"
                />
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
                <ItemRow
                  key={index}
                  item={i}
                  index={index}
                  tipo="identificaciones"
                  tiposCatalogo={tiposIdentificacion}
                  idField="idTipoIdentificacion" 
                  valueField="numero" 
                  labelValue="Número"
                />
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
            className="mt-4 p-button-success"
          />
        </form>
      </Card>
        <div className="flex justify-content-end gap-2 mt-5">
                <Button 
                    type="button" 
                    label="Cancelar" 
                    icon="pi pi-times" 
                    className="p-button-danger p-button-outlined" 
                    onClick={onHide} 
                />
                <Button
                    type="submit"
                    label="Guardar Persona"
                    icon="pi pi-save"
                    className="p-button-primary"
                />
            </div>
    </form>
  );
}