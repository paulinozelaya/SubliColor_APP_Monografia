import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import apiVentas from "../api/ventas";
import apiClientes from "../api/cliente";
import apiProductos from "../api/productos";
import apiCatalogos from "../api/catalogos";

export default function GestionVentas() {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [ventaDialog, setVentaDialog] = useState(false);
  const [detalleDialog, setDetalleDialog] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [nuevaVenta, setNuevaVenta] = useState({
    idCliente: null,
    numeroFactura: "",
    idMetodoPago: null,
    observacion: "",
    detalles: [],
  });

  const toast = useRef(null);

  // ================= CARGAR DATOS =================
  useEffect(() => {
    cargarVentas();
    cargarClientes();
    cargarProductos();
    cargarMetodosPago();
  }, []);

  const cargarVentas = async () => {
    const data = await apiVentas.getAll();
    setVentas(data);
  };

  const cargarClientes = async () => {
    const data = await apiClientes.getAll();
    setClientes(data);
  };

  const cargarProductos = async () => {
    const data = await apiProductos.getAll();
    setProductos(data);
  };

  const cargarMetodosPago = async () => {
    const data = await apiCatalogos.getByCategoria("MetodoPago"); // BD: Categoria->Valor
    setMetodosPago(data);
  };

  // ================= CREAR NUEVA VENTA =================
  const abrirNuevaVenta = () => {
    setNuevaVenta({
      idCliente: null,
      numeroFactura: `FAC-${Date.now()}`, // ejemplo autogen
      idMetodoPago: null,
      observacion: "",
      detalles: [],
    });
    setVentaDialog(true);
  };

  const agregarDetalle = () => {
    setNuevaVenta({
      ...nuevaVenta,
      detalles: [...nuevaVenta.detalles, { idProducto: null, cantidadProducto: 1, precioUnitario: 0, descuento: 0 }],
    });
  };

  const actualizarDetalle = (index, campo, valor) => {
    const detalles = [...nuevaVenta.detalles];
    detalles[index][campo] = valor;
    setNuevaVenta({ ...nuevaVenta, detalles });
  };

  const guardarVenta = async () => {
    try {
      await apiVentas.create(nuevaVenta);
      toast.current.show({ severity: "success", summary: "Éxito", detail: "Venta registrada", life: 3000 });
      setVentaDialog(false);
      cargarVentas();
    } catch (error) {
      toast.current.show({ severity: "error", summary: "Error", detail: error.response?.data || "No se pudo guardar", life: 3000 });
    }
  };

  // ================= ANULAR =================
  const anularVenta = async (id) => {
    try {
      await apiVentas.remove(id);
      toast.current.show({ severity: "warn", summary: "Venta anulada", life: 3000 });
      cargarVentas();
    } catch {
      toast.current.show({ severity: "error", summary: "Error", detail: "No se pudo anular", life: 3000 });
    }
  };

  // ================= RENDER =================
  return (
    <div>
      <Toast ref={toast} />
      <Card title="Gestión de Ventas">
        <Button label="Nueva Venta" icon="pi pi-plus" onClick={abrirNuevaVenta} className="mb-3" />
        <DataTable value={ventas} paginator rows={10} responsiveLayout="scroll">
          <Column field="numeroFactura" header="Factura" />
          <Column field="nombreCliente" header="Cliente" />
          <Column field="total" header="Total" body={(row) => `$${row.total.toFixed(2)}`} />
          <Column field="fechaCreacion" header="Fecha" body={(row) => new Date(row.fechaCreacion).toLocaleDateString()} />
          <Column
            header="Acciones"
            body={(row) => (
              <>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-info mr-2" onClick={() => { setVentaSeleccionada(row); setDetalleDialog(true); }} />
                <Button icon="pi pi-times" className="p-button-rounded p-button-danger" onClick={() => anularVenta(row.idVenta)} />
              </>
            )}
          />
        </DataTable>
      </Card>

      {/* ================= CREAR VENTA ================= */}
      <Dialog header="Nueva Venta" visible={ventaDialog} style={{ width: "60vw" }} onHide={() => setVentaDialog(false)}>
        <div className="p-fluid">
          <div className="field">
            <label>Cliente</label>
            <Dropdown value={nuevaVenta.idCliente} options={clientes} optionLabel="nombrePersona" optionValue="idCliente"
              onChange={(e) => setNuevaVenta({ ...nuevaVenta, idCliente: e.value })} placeholder="Seleccione cliente" />
          </div>
          <div className="field">
            <label>Número Factura</label>
            <InputText value={nuevaVenta.numeroFactura} onChange={(e) => setNuevaVenta({ ...nuevaVenta, numeroFactura: e.target.value })} />
          </div>
          <div className="field">
            <label>Método de Pago</label>
            <Dropdown value={nuevaVenta.idMetodoPago} options={metodosPago} optionLabel="nombre" optionValue="codigoInterno"
              onChange={(e) => setNuevaVenta({ ...nuevaVenta, idMetodoPago: e.value })} placeholder="Seleccione método" />
          </div>
          <div className="field">
            <label>Observación</label>
            <InputText value={nuevaVenta.observacion} onChange={(e) => setNuevaVenta({ ...nuevaVenta, observacion: e.target.value })} />
          </div>

          <h4>Productos</h4>
          {nuevaVenta.detalles.map((d, i) => (
            <div key={i} className="grid mb-2">
              <div className="col-4">
                <Dropdown value={d.idProducto} options={productos} optionLabel="nombre" optionValue="idProducto"
                  onChange={(e) => actualizarDetalle(i, "idProducto", e.value)} placeholder="Producto" />
              </div>
              <div className="col-2">
                <InputNumber value={d.cantidadProducto} onValueChange={(e) => actualizarDetalle(i, "cantidadProducto", e.value)} min={1} />
              </div>
              <div className="col-2">
                <InputNumber value={d.precioUnitario} onValueChange={(e) => actualizarDetalle(i, "precioUnitario", e.value)} mode="currency" currency="USD" locale="en-US" />
              </div>
              <div className="col-2">
                <InputNumber value={d.descuento} onValueChange={(e) => actualizarDetalle(i, "descuento", e.value)} mode="currency" currency="USD" locale="en-US" />
              </div>
            </div>
          ))}
          <Button label="Agregar Producto" icon="pi pi-plus" onClick={agregarDetalle} className="mt-2" />

          <div className="mt-4 flex justify-content-end">
            <Button label="Guardar" icon="pi pi-check" onClick={guardarVenta} />
          </div>
        </div>
      </Dialog>

      {/* ================= DETALLES ================= */}
      <Dialog header="Detalles de Venta" visible={detalleDialog} style={{ width: "50vw" }} onHide={() => setDetalleDialog(false)}>
        {ventaSeleccionada && (
          <div>
            <h4>Factura: {ventaSeleccionada.numeroFactura}</h4>
            <p><b>Cliente:</b> {ventaSeleccionada.nombreCliente}</p>
            <p><b>Total:</b> ${ventaSeleccionada.total}</p>
            <DataTable value={ventaSeleccionada.detalles}>
              <Column field="nombreProducto" header="Producto" />
              <Column field="cantidadProducto" header="Cantidad" />
              <Column field="precioUnitario" header="Precio" />
              <Column field="descuento" header="Descuento" />
              <Column field="precioTotal" header="Total" />
            </DataTable>
          </div>
        )}
      </Dialog>
    </div>
  );
}