import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
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
        if (!producto.codigo || !producto.nombre || producto.precioVenta <= 0) {
            toast.current.show({ severity: "error", summary: "Error de Validación", detail: "El código, nombre y precio son obligatorios." });
            return;
        }

      if (isEdit) {
        await api.update(producto.idProducto, producto);
        toast.current.show({ severity: "success", summary: "Actualizado", detail: "Producto actualizado correctamente." });
      } else {
        await api.create(producto);
        toast.current.show({ severity: "success", summary: "Creado", detail: "Producto creado correctamente." });
      }
      setModalVisible(false);
      cargarProductos();
    } catch (e) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: e.response?.data || "Error al guardar el producto",
      });
    }
  };

  const eliminarProducto = async (rowData) => {
    try {
      await api.remove(rowData.idProducto);
      toast.current.show({ severity: "warn", summary: "Eliminado", detail: "Producto eliminado." });
      cargarProductos();
    } catch (e) {
      toast.current.show({ severity: "error", summary: "Error al eliminar", detail: e.message });
    }
  };

  const accionesBodyTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        tooltip="Editar"
        onClick={() => abrirEditar(rowData)}
      />
      <Button
        icon="pi pi-trash"
        rounded
        text
        severity="danger"
        tooltip="Eliminar"
        onClick={() => eliminarProducto(rowData)}
      />
    </div>
  );

  const dialogFooter = (
    <div className="pt-3 flex justify-end gap-3">
        <Button
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-text text-slate-600 hover:text-red-500"
            onClick={() => setModalVisible(false)}
        />
        <Button
            label="Guardar"
            icon="pi pi-check"
            className="bg-indigo-600 hover:bg-indigo-700 border-none text-white px-4 py-2 rounded-lg transition-all"
            onClick={guardarProducto}
        />
    </div>
  );

  return (
    <div className="p-0 animate-fadeIn">
      <Toast ref={toast} />

      {/* === Header Card === */}
      <Card
        title={
          <div className="flex justify-between items-center pr-2">
            <div className="flex items-center gap-2 text-indigo-900 font-semibold">
              <i className="pi pi-box text-indigo-600 text-lg"></i>
              <span className="text-xl">Gestión de Productos</span>
            </div>
            <Button
              label="Nuevo Producto"
              icon="pi pi-plus"
              className="bg-blue-500 hover:bg-blue-600 border-none shadow-md text-white px-3 py-1.5 rounded-lg transition-all text-sm"
              onClick={abrirNuevo}
            />
          </div>
        }
        className="rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-md bg-white/80"
      >

        {/* Tabla de productos */}
        <div className="rounded-xl overflow-hidden mt-4">
          <DataTable
            value={productos}
            paginator
            rows={10}
            className="text-sm"
            emptyMessage="No hay productos registrados"
            stripedRows
            responsiveLayout="scroll"
          >
            <Column field="codigo" header="Código" sortable></Column>
            <Column field="nombre" header="Nombre" sortable></Column>
            <Column field="descripcion" header="Descripción"></Column>
            <Column 
                field="precioVenta" 
                header="Precio Venta" 
                sortable 
                body={(rowData) => 
                    <span className="font-medium text-green-700">
                        {rowData.precioVenta.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </span>
                }
            ></Column>
            <Column 
                field="cantidadActual" 
                header="Stock"
                body={(rowData) => 
                    <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
                        rowData.cantidadActual > 10
                            ? "bg-green-100 text-green-700"
                            : rowData.cantidadActual > 0
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-600"
                    }`}>
                        {rowData.cantidadActual}
                    </span>
                }
            ></Column>
            <Column header="Acciones" body={accionesBodyTemplate} />
          </DataTable>
        </div>
      </Card>

      {/* === Diálogo === */}
      <Dialog 
        header={
            <div className="flex items-center gap-2 text-indigo-900 font-semibold">
                <i className="pi pi-box text-indigo-600"></i>
                <span>{isEdit ? "Editar Producto" : "Nuevo Producto"}</span>
            </div>
        } 
        visible={modalVisible} 
        style={{ width: "36rem" }} 
        modal
        className="rounded-xl backdrop-blur-xl bg-white/90"
        footer={dialogFooter} 
        onHide={() => setModalVisible(false)}
    >
        <div className="p-fluid space-y-3">
          <div className="field">
            <label className="font-medium text-slate-700">Código</label>
            <InputText value={producto.codigo || ""} onChange={(e) => setProducto({ ...producto, codigo: e.target.value })} autoComplete="off" />
          </div>
          <div className="field">
            <label className="font-medium text-slate-700">Nombre</label>
            <InputText value={producto.nombre || ""} onChange={(e) => setProducto({ ...producto, nombre: e.target.value })} autoComplete="off" />
          </div>
          <div className="field">
            <label className="font-medium text-slate-700">Descripción</label>
            <InputText value={producto.descripcion || ""} onChange={(e) => setProducto({ ...producto, descripcion: e.target.value })} autoComplete="off" />
          </div>
          <div className="field">
            <label className="font-medium text-slate-700">Precio Venta</label>
            <InputNumber 
                value={producto.precioVenta || 0} 
                onValueChange={(e) => setProducto({ ...producto, precioVenta: e.value })} 
                mode="currency" 
                currency="USD" 
                locale="en-US" 
                className="w-full bg-white"
            />
          </div>
            {/* Solo se muestra el Stock Inicial en 'Nuevo Producto' */}
          {!isEdit && (
                <div className="field">
                    <label className="font-medium text-slate-700">Stock Inicial</label>
                    <InputNumber 
                        value={producto.cantidadInicial || 0} 
                        onValueChange={(e) => setProducto({ ...producto, cantidadInicial: e.value })} 
                        className="w-full bg-white"
                    />
                </div>
            )}
        </div>
      </Dialog>
    </div>
  );
}