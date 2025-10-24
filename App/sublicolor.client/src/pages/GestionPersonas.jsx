import { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { useEffect } from 'react';
import FormularioPersona from '../pages/FormularioPersonas';
import api from "../api/personas";

export default function GestionPersonas() {
    const [dialogVisible, setDialogVisible] = useState(false);
    const [personas, setPersonas] = useState([]);

    const cargarPersonas = async () => {
        try {
            const data = await api.getAll(); 
            setPersonas(data);
        } catch (error) {
            console.error("Error al cargar personas", error);
        }
    };
    
    useEffect(() => { cargarPersonas(); }, []); 

    const showDialog = () => {
        setDialogVisible(true);
    };

    const hideDialog = () => {
        setDialogVisible(false);
    };

    const onPersonaGuardada = () => {
        cargarPersonas(); 
    };

    const eliminarPersona = async (id) => {
        try {
          await api.eliminarPersona(id);
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

    return (
        <div className="p-4">
            {/* <Toast ref={toast} /> */}
            <Card title="Gestión de Personas" className="shadow-3">
                <div className="flex justify-content-between mb-4">
                    <h2 className="text-xl font-semibold">Listado de Personas</h2>
                    <Button 
                        label="Nueva Persona" 
                        icon="pi pi-plus" 
                        onClick={showDialog} 
                        className="p-button-primary" 
                    />
                </div>
                
                <DataTable value={personas} emptyMessage="No hay personas registradas.">
                    <Column field="id" header="ID"></Column>
                    <Column field="nombreCompleto" header="Nombre"></Column>
                    <Column field="identificacionPrincipal" header="Identificación"></Column>
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
                                onClick={() => eliminarPersona(row.idPersona)}
                            />
                            </div>
                        )}
                        />
                </DataTable>
            </Card>

            <Dialog 
                header="Nuevo Registro de Persona" 
                visible={dialogVisible} 
                style={{ width: '50vw' }} 
                modal 
                onHide={hideDialog}
            >
                {/* Renderizamos el formulario ajustado dentro del diálogo */}
                <FormularioPersona 
                    visible={dialogVisible} 
                    onHide={hideDialog} 
                    onSave={onPersonaGuardada} 
                />
            </Dialog>
        </div>
    );
}