import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { useToast } from "../context/ToastContext";
import ventaApi from "../api/ventas";
import clienteApi from "../api/cliente";
import productoApi from "../api/productos";
import valorApi from "../api/catalogos";

export default function GestionVentas() {
  const toast = useToast();
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);

  const [visible, setVisible] = useState(false);
  const [detalles, setDetalles] = useState([]);

  const [detalleVisible, setDetalleVisible] = useState(false);
  const [detalleVenta, setDetalleVenta] = useState(null);

  const [form, setForm] = useState({
    idCliente: null,
    numeroFactura: "",
    fechaVenta: new Date(),
    descuento: 0,
    idMetodoPago: null,
    observacion: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const [ventasRes, clientesRes, productosRes, metodosRes] =
      await Promise.all([
        ventaApi.getAll(),
        clienteApi.getAll(),
        productoApi.getActivosConStock(),
        valorApi.getValores("MP"),
      ]);

    console.log("Clientes cargados:", clientesRes);

    setVentas(ventasRes);
    setClientes(
      (clientesRes || [])
        .filter((c) => c.estaActivo)
        .map((c) => ({
          idCliente: c.idCliente,
          nombrePersona: c.nombrePersona?.trim() || "Sin nombre",
        }))
    );
    setProductos(productosRes);
    setMetodosPago(metodosRes);
  };

  const abrirNuevo = () => {
    const ultimo = ventas.length
      ? Math.max(...ventas.map((v) => v.idVenta))
      : 0;
    const nuevoNumero = `V-${(ultimo + 1).toString().padStart(6, "0")}`;

    setForm({
      idCliente: null,
      numeroFactura: nuevoNumero,
      fechaVenta: new Date(),
      descuento: 0,
      idMetodoPago: null,
      observacion: "",
    });
    setDetalles([]);
    setVisible(true);
  };

  const agregarDetalle = () => {
    setDetalles([
      ...detalles,
      {
        idProducto: null,
        cantidad: 1,
        precioUnitario: 0,
        descuento: 0,
      },
    ]);
  };

  const eliminarDetalle = (index) => {
    const nuevos = [...detalles];
    nuevos.splice(index, 1);
    setDetalles(nuevos);
  };

  const actualizarDetalle = (index, campo, valor) => {
    const nuevos = [...detalles];
    nuevos[index][campo] = valor;

    // 🧩 Si el campo modificado es el producto, cargamos su precio
    if (campo === "idProducto") {
      const prod = productos.find((p) => p.idProducto === valor);
      if (prod) {
        nuevos[index].precioUnitario = prod.precioVenta || 0;
        nuevos[index].descuento = prod.descuento || 0; // si tienes campo descuento
      }
    }

    setDetalles(nuevos);
  };

  const calcularSubTotal = () =>
    detalles.reduce(
      (acc, d) => acc + (d.precioUnitario - (d.descuento || 0)) * d.cantidad,
      0
    );

  const calcularTotal = () => calcularSubTotal() - (form.descuento || 0);

    const guardarVenta = async () => {
      try {
        if (!form.idCliente) {
          toast.current.show({
            severity: "warn",
            summary: "Campo requerido",
            detail: "Debes seleccionar un cliente",
          });
          return;
        }

        if (!detalles.length) {
          toast.current.show({
            severity: "warn",
            summary: "Sin productos",
            detail: "Debes agregar al menos un producto",
          });
          return;
        }

        const data = {
          idCliente: form.idCliente,
          numeroFactura: form.numeroFactura,
          descuento: form.descuento,
          idMetodoPago: form.idMetodoPago,
          observacion: form.observacion,
          detalles: detalles.map((d) => ({
            idProducto: d.idProducto,
            cantidad: d.cantidad,
            precioUnitario: d.precioUnitario,
            descuento: d.descuento,
          })),
        };

        await ventaApi.create(data);
        toast.current.show({
          severity: "success",
          summary: "Venta registrada",
          detail: "La venta se guardó correctamente",
        });

        setVisible(false);
        cargarDatos();
      } catch {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo registrar la venta",
        });
      }
    };

  const eliminarVenta = async (id) => {
    try {
      await ventaApi.remove(id);
      toast.current.show({
        severity: "warn",
        summary: "Eliminada",
        detail: "Venta eliminada correctamente",
      });
      cargarDatos();
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar la venta",
      });
    }
  };

  const verDetalleVenta = async (venta) => {
    try {
      const data = await ventaApi.getById(venta.idVenta); // tu API debe devolver detalles e items
      setDetalleVenta(data);
      setDetalleVisible(true);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo cargar el detalle de la venta",
      });
    }
  };

  return (
    <div className="p-0 animate-fadeIn">
      {/* === LISTADO DE VENTAS === */}
      <Card
        title={
          <div className="flex justify-between items-center pr-2">
            <div className="flex items-center gap-2 text-indigo-900 font-semibold">
              <i className="pi pi-credit-card text-indigo-600 text-lg"></i>
              <span className="text-xl">Gestión de Ventas</span>
            </div>
            <Button
              label="Nueva Venta"
              icon="pi pi-plus"
              className="bg-blue-500 hover:bg-blue-600 border-none shadow-md text-white px-3 py-1.5 rounded-lg transition-all text-sm"
              onClick={abrirNuevo}
            />
          </div>
        }
        className="rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-md bg-white/80"
      >
        <DataTable
          value={ventas}
          paginator
          rows={10}
          className="text-sm"
          stripedRows
          emptyMessage="No hay ventas registradas"
          responsiveLayout="scroll"
        >
          <Column field="idVenta" header="ID" style={{ width: "6%" }} />
          <Column field="nombreCliente" header="Cliente" sortable />
          <Column field="numeroFactura" header="Factura" />
          <Column
            field="fechaCreacion"
            header="Fecha"
            body={(r) =>
              r.fechaCreacion
                ? new Date(r.fechaCreacion).toLocaleDateString("es-NI")
                : "-"
            }
          />
          <Column
            field="total"
            header="Total"
            body={(r) => `C$ ${r.total?.toFixed(2)}`}
            sortable
          />
          <Column
            field="metodoPago"
            header="Método Pago"
            body={(r) => r.metodoPago || "-"}
          />
          <Column
            field="estaActivo"
            header="Activo"
            body={(r) =>
              r.estaActivo ? (
                <span className="text-green-600 font-semibold">Sí</span>
              ) : (
                <span className="text-red-600 font-semibold">No</span>
              )
            }
          />
          <Column
            header="Acciones"
            body={(r) => (
              <div className="flex gap-2 justify-center">
                <Button
                  icon="pi pi-search"
                  rounded
                  text
                  severity="info"
                  tooltip="Ver Detalle"
                  onClick={() => {
                    verDetalleVenta(r);
                  }}
                />

                <Button
                  icon="pi pi-trash"
                  rounded
                  text
                  severity="danger"
                  tooltip="Eliminar"
                  onClick={() => eliminarVenta(r.idVenta)}
                />
              </div>
            )}
          />
        </DataTable>
      </Card>

      {/* === DIALOGO DE CREAR VENTA === */}
      <Dialog
        header={
          <div className="flex items-center gap-2 text-indigo-900 font-semibold">
            <i className="pi pi-shopping-cart text-indigo-600"></i>
            <span>Nueva Venta</span>
          </div>
        }
        visible={visible}
        style={{ width: "70rem" }}
        modal
        className="rounded-xl backdrop-blur-xl bg-white/90"
        onHide={() => setVisible(false)}
      >
        <div className="p-fluid space-y-3 mt-1">
          {/* === ENCABEZADO === */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-medium text-slate-700">Cliente *</label>
              <Dropdown
                value={form.idCliente}
                options={clientes}
                onChange={(e) => setForm({ ...form, idCliente: e.value })}
                optionLabel="nombrePersona"
                optionValue="idCliente"
                placeholder="Seleccione cliente"
                className="w-full"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700">
                Número de Factura
              </label>
              <InputText
                value={form.numeroFactura}
                onChange={(e) =>
                  setForm({ ...form, numeroFactura: e.target.value })
                }
                placeholder="Opcional"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700">
                Método de Pago
              </label>
              <Dropdown
                value={form.idMetodoPago}
                options={metodosPago}
                onChange={(e) => setForm({ ...form, idMetodoPago: e.value })}
                optionLabel="nombre"
                optionValue="idValor"
                placeholder="Seleccione método"
                className="w-full"
              />
            </div>
          </div>

          {/* === DETALLES DE PRODUCTOS === */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-indigo-800">
                Detalle de Productos
              </h4>
              <Button
                icon="pi pi-plus"
                label="Agregar Producto"
                className="bg-indigo-500 hover:bg-indigo-600 border-none text-white"
                onClick={agregarDetalle}
              />
            </div>

            <div className="overflow-x-auto border rounded-xl shadow-inner p-2">
              <table className="w-full text-sm text-slate-700">
                <thead className="bg-indigo-50 text-indigo-900">
                  <tr>
                    <th className="p-2 text-left">Producto</th>
                    <th className="p-2 text-center">Cantidad</th>
                    <th className="p-2 text-center">Precio Unitario</th>
                    <th className="p-2 text-center">Descuento</th>
                    <th className="p-2 text-center">Total</th>
                    <th className="p-2 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.map((d, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">
                        <Dropdown
                          value={d.idProducto}
                          options={productos}
                          onChange={(e) =>
                            actualizarDetalle(i, "idProducto", e.value)
                          }
                          optionLabel="nombre"
                          optionValue="idProducto"
                          placeholder="Seleccione"
                          className="w-full"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <InputNumber
                          value={d.cantidad}
                          onValueChange={(e) =>
                            actualizarDetalle(i, "cantidad", e.value || 0)
                          }
                          min={1}
                          showButtons
                          className="w-24"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <InputNumber
                          value={d.precioUnitario}
                          onValueChange={(e) =>
                            actualizarDetalle(i, "precioUnitario", e.value || 0)
                          }
                          mode="currency"
                          currency="NIO"
                          locale="es-NI"
                          className="w-28"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <InputNumber
                          value={d.descuento}
                          onValueChange={(e) =>
                            actualizarDetalle(i, "descuento", e.value || 0)
                          }
                          mode="currency"
                          currency="NIO"
                          locale="es-NI"
                          className="w-24"
                        />
                      </td>
                      <td className="p-2 text-center font-semibold text-slate-800">
                        C${" "}
                        {(
                          (d.precioUnitario - (d.descuento || 0)) *
                          d.cantidad
                        ).toFixed(2)}
                      </td>
                      <td className="p-2 text-center">
                        <Button
                          icon="pi pi-times"
                          rounded
                          text
                          severity="danger"
                          tooltip="Eliminar"
                          onClick={() => eliminarDetalle(i)}
                        />
                      </td>
                    </tr>
                  ))}
                  {!detalles.length && (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-3 text-slate-500"
                      >
                        No hay productos agregados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* === TOTALES === */}
          <div className="grid grid-cols-2 mt-4 gap-4">
            <div>
              <label className="font-medium text-slate-700">Observación</label>
              <InputTextarea
                rows={2}
                value={form.observacion}
                onChange={(e) =>
                  setForm({ ...form, observacion: e.target.value })
                }
                autoResize
              />
            </div>
            <div className="flex flex-col justify-end items-end space-y-2 pr-6">
              <div>
                <span className="font-medium text-slate-600 mr-2">
                  Subtotal:
                </span>
                <span className="font-semibold text-slate-800">
                  C$ {calcularSubTotal().toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-600">
                  Descuento total:
                </span>
                <InputNumber
                  value={form.descuento}
                  onValueChange={(e) =>
                    setForm({ ...form, descuento: e.value || 0 })
                  }
                  mode="currency"
                  currency="NIO"
                  locale="es-NI"
                  className="w-32"
                />
              </div>
              <div>
                <span className="font-medium text-slate-700 mr-2 text-lg">
                  Total:
                </span>
                <span className="font-bold text-indigo-700 text-lg">
                  C$ {calcularTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* === BOTONES === */}
          <div className="pt-4 flex justify-end gap-3">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text text-slate-600 hover:text-red-500"
              onClick={() => setVisible(false)}
            />
            <Button
              label="Guardar Venta"
              icon="pi pi-check"
              className="bg-indigo-600 hover:bg-indigo-700 border-none text-white px-4 py-2 rounded-lg transition-all"
              onClick={guardarVenta}
            />
          </div>
        </div>
      </Dialog>

      {/* === DIALOGO DE DETALLE DE VENTA === */}
      <Dialog
        header={
          <div className="flex items-center gap-2 text-indigo-900 font-semibold">
            <i className="pi pi-eye text-indigo-600"></i>
            <span>Detalle de Venta</span>
          </div>
        }
        visible={detalleVisible}
        style={{ width: "60rem" }}
        modal
        className="rounded-xl backdrop-blur-xl bg-white/90"
        onHide={() => setDetalleVisible(false)}
      >
        {detalleVenta ? (
          <div className="space-y-4 mt-1">
            {/* === DATOS PRINCIPALES === */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-slate-700">Cliente:</p>
                <p className="text-slate-800">
                  {detalleVenta.nombreCliente || "Mostrador"}
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-700">Factura:</p>
                <p className="text-slate-800">
                  {detalleVenta.numeroFactura || "-"}
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-700">Fecha:</p>
                <p className="text-slate-800">
                  {new Date(detalleVenta.fechaCreacion).toLocaleDateString(
                    "es-NI"
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-slate-700">Método de Pago:</p>
                <p className="text-slate-800">
                  {detalleVenta.metodoPago || "No definido"}
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-700">Estado:</p>
                <p className="text-slate-800">
                  {detalleVenta.estaActivo ? "Activa" : "Anulada"}
                </p>
              </div>
            </div>

            {/* === TABLA DE DETALLE === */}
            <div className="overflow-x-auto border rounded-xl shadow-inner p-2">
              <table className="w-full text-sm text-slate-700">
                <thead className="bg-indigo-50 text-indigo-900">
                  <tr>
                    <th className="p-2 text-left">Producto</th>
                    <th className="p-2 text-center">Cantidad</th>
                    <th className="p-2 text-center">Precio Unitario</th>
                    <th className="p-2 text-center">Descuento</th>
                    <th className="p-2 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {detalleVenta.detalles?.length ? (
                    detalleVenta.detalles.map((d, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-2">{d.nombreProducto}</td>
                        <td className="p-2 text-center">{d.cantidad}</td>
                        <td className="p-2 text-center">
                          C$ {d.precioUnitario.toFixed(2)}
                        </td>
                        <td className="p-2 text-center">
                          C$ {(d.descuento || 0).toFixed(2)}
                        </td>
                        <td className="p-2 text-center font-semibold text-slate-800">
                          C${" "}
                          {(
                            (d.precioUnitario - (d.descuento || 0)) *
                            d.cantidad
                          ).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-3 text-slate-500"
                      >
                        Sin productos registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* === TOTALES === */}
            <div className="grid grid-cols-2 mt-2 text-right pr-6">
              <div></div>
              <div className="space-y-1 text-slate-700">
                <p>
                  <span className="font-medium">Subtotal:</span>{" "}
                  <span className="font-semibold">
                    C$ {detalleVenta.subTotal?.toFixed(2)}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Descuento:</span>{" "}
                  <span className="font-semibold">
                    C$ {detalleVenta.descuento?.toFixed(2)}
                  </span>
                </p>
                <p className="text-lg font-bold text-indigo-700">
                  Total: C$ {detalleVenta.total?.toFixed(2)}
                </p>
              </div>
            </div>

            {/* === OBSERVACION === */}
            {detalleVenta.observacion && (
              <div className="mt-4">
                <p className="font-medium text-slate-700">Observaciones:</p>
                <p className="text-slate-600">{detalleVenta.observacion}</p>
              </div>
            )}

            {/* === BOTON CERRAR === */}
            <div className="flex justify-end pt-3">
              <Button
                label="Cerrar"
                icon="pi pi-times"
                className="p-button-text text-slate-600 hover:text-red-500"
                onClick={() => setDetalleVisible(false)}
              />
            </div>
          </div>
        ) : (
          <p className="text-center text-slate-500">Cargando...</p>
        )}
      </Dialog>
    </div>
  );
}
