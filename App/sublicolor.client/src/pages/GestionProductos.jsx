import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import api from "../api/productos"; // <-- axios wrapper

export default function GestionProductos() {
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const toast = useRef(null);

  const cargarProductos = async () => {
    const data = await api.getAll();
    setProductos(data);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const abrirNuevo = () => {
    setProducto({});
    setIsEdit(false);
    setModalVisible(true);
  };

  const abrirEditar = (rowData) => {
    setProducto({ ...rowData });
    setIsEdit(true);
    setModalVisible(true);
  };

  const guardarProducto = async () => {
    try {
      if (isEdit) {
        await api.update(producto.idProducto, producto);
        toast.current.show({ severity: "success", summary: "Actualizado" });
      } else {
        await api.create(producto);
        toast.current.show({ severity: "success", summary: "Creado" });
      }
      setModalVisible(false);
      cargarProductos();
    } catch (e) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: e.response?.data || "Error en el servidor",
      });
    }
  };

  const eliminarProducto = async (rowData) => {
    try {
      await api.remove(rowData.idProducto);
      toast.current.show({ severity: "warn", summary: "Eliminado" });
      cargarProductos();
    } catch (e) {
      toast.current.show({ severity: "error", summary: "Error", detail: e.message });
    }
  };

  const footer = (
    <div>
      <Button label="Cancelar" icon="pi pi-times" onClick={() => setModalVisible(false)} className="p-button-text" />
      <Button label="Guardar" icon="pi pi-check" onClick={guardarProducto} />
    </div>
  );

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <h2>Gestión de Productos</h2>
      <Button label="Nuevo Producto" icon="pi pi-plus" onClick={abrirNuevo} className="mb-3" />

      <DataTable value={productos} paginator rows={10} responsiveLayout="scroll">
        <Column field="codigo" header="Código"></Column>
        <Column field="nombre" header="Nombre"></Column>
        <Column field="descripcion" header="Descripción"></Column>
        <Column field="precioVenta" header="Precio"></Column>
        <Column field="cantidadActual" header="Stock"></Column>
        <Column
          body={(rowData) => (
            <>
              <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => abrirEditar(rowData)} />
              <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => eliminarProducto(rowData)} />
            </>
          )}
        />
      </DataTable>

      <Dialog header={isEdit ? "Editar Producto" : "Nuevo Producto"} visible={modalVisible} style={{ width: "500px" }} footer={footer} onHide={() => setModalVisible(false)}>
        <div className="p-fluid">
          <div className="field">
            <label>Código</label>
            <InputText value={producto.codigo || ""} onChange={(e) => setProducto({ ...producto, codigo: e.target.value })} />
          </div>
          <div className="field">
            <label>Nombre</label>
            <InputText value={producto.nombre || ""} onChange={(e) => setProducto({ ...producto, nombre: e.target.value })} />
          </div>
          <div className="field">
            <label>Descripción</label>
            <InputText value={producto.descripcion || ""} onChange={(e) => setProducto({ ...producto, descripcion: e.target.value })} />
          </div>
          <div className="field">
            <label>Precio Venta</label>
            <InputNumber value={producto.precioVenta || 0} onValueChange={(e) => setProducto({ ...producto, precioVenta: e.value })} mode="currency" currency="USD" />
          </div>
          <div className="field">
            <label>Stock Inicial</label>
            <InputNumber value={producto.cantidadInicial || 0} onValueChange={(e) => setProducto({ ...producto, cantidadInicial: e.value })} />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
