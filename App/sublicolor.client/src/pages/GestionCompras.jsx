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
import compraApi from "../api/compras";
import proveedorApi from "../api/proveedor";
import productoApi from "../api/productos";

export default function GestionCompras() {
  const toast = useToast();
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);

  const [visible, setVisible] = useState(false);
  const [detalles, setDetalles] = useState([]);

  const [detalleCompra, setDetalleCompra] = useState(null);
  const [detalleVisible, setDetalleVisible] = useState(false);

  const [form, setForm] = useState({
    idProveedor: null,
    numeroFactura: "",
    fechaCompra: new Date(),
    descuento: 0,
    observacion: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const verDetalleCompra = async (id) => {
    try {
      const data = await compraApi.getById(id);
      setDetalleCompra(data);
      setDetalleVisible(true);
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo cargar el detalle de la compra",
      });
    }
  };

  const cargarDatos = async () => {
    const [comprasRes, proveedoresRes, productosRes] = await Promise.all([
      compraApi.getAll(),
      proveedorApi.getAll(),
      productoApi.getAll(),
    ]);
    setCompras(comprasRes);
    setProveedores(proveedoresRes);
    setProductos(productosRes);
  };

  const abrirNuevo = () => {
    setForm({
      idProveedor: null,
      numeroFactura: "",
      fechaCompra: new Date(),
      descuento: 0,
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
    setDetalles(nuevos);
  };

  const calcularSubTotal = () =>
    detalles.reduce(
      (acc, d) => acc + (d.precioUnitario - (d.descuento || 0)) * d.cantidad,
      0
    );

  const calcularTotal = () => calcularSubTotal() - (form.descuento || 0);

  const guardarCompra = async () => {
    try {
      if (!form.idProveedor) {
        toast.current.show({
          severity: "warn",
          summary: "Campo requerido",
          detail: "Debes seleccionar un proveedor",
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
        ...form,
        detalles: detalles.map((d) => ({
          idProducto: d.idProducto,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
          descuento: d.descuento,
        })),
      };

      await compraApi.create(data);
      toast.current.show({
        severity: "success",
        summary: "Compra guardada",
        detail: "La compra se registró correctamente",
      });

      setVisible(false);
      cargarDatos();
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar la compra",
      });
    }
  };

  const eliminarCompra = async (id) => {
    try {
      await compraApi.remove(id);
      toast.current.show({
        severity: "warn",
        summary: "Eliminado",
        detail: "Compra eliminada correctamente",
      });
      cargarDatos();
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar la compra",
      });
    }
  };

  return (
    <div className="p-0 animate-fadeIn">
      <Card
        title={
          <div className="flex justify-between items-center pr-2">
            <div className="flex items-center gap-2 text-indigo-900 font-semibold">
              <i className="pi pi-shopping-cart text-indigo-600 text-lg"></i>
              <span className="text-xl">Gestión de Compras</span>
            </div>
            <Button
              label="Nueva Compra"
              icon="pi pi-plus"
              className="bg-blue-500 hover:bg-blue-600 border-none shadow-md text-white px-3 py-1.5 rounded-lg transition-all text-sm"
              onClick={abrirNuevo}
            />
          </div>
        }
        className="rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-md bg-white/80"
      >
        <DataTable
          value={compras}
          paginator
          rows={10}
          className="text-sm"
          stripedRows
          emptyMessage="No hay compras registradas"
          responsiveLayout="scroll"
        >
          <Column field="idCompra" header="ID" style={{ width: "5%" }} />
          <Column field="nombreProveedor" header="Proveedor" sortable />
          <Column field="numeroFactura" header="Factura" />
          <Column
            field="fechaCompra"
            header="Fecha"
            body={(r) =>
              r.fechaCompra
                ? new Date(r.fechaCompra).toLocaleDateString("es-NI")
                : "-"
            }
          />
          <Column
            field="total"
            header="Total"
            body={(r) => (r.total ? `C$ ${r.total.toFixed(2)}` : "C$ 0.00")}
          />
          <Column
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
                  icon="pi pi-eye"
                  rounded
                  text
                  severity="info"
                  tooltip="Ver detalle"
                  onClick={() => verDetalleCompra(r.idCompra)}
                />
                <Button
                  icon="pi pi-trash"
                  rounded
                  text
                  severity="danger"
                  tooltip="Eliminar"
                  onClick={() => eliminarCompra(r.idCompra)}
                />
              </div>
            )}
          />
        </DataTable>
      </Card>

      {/* === DIALOGO === */}
      <Dialog
        header={
          <div className="flex items-center gap-2 text-indigo-900 font-semibold">
            <i className="pi pi-shopping-cart text-indigo-600"></i>
            <span>Nueva Compra</span>
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
              <label className="font-medium text-slate-700">Proveedor *</label>
              <Dropdown
                value={form.idProveedor}
                options={proveedores}
                onChange={(e) => setForm({ ...form, idProveedor: e.value })}
                optionLabel="nombreProveedor"
                optionValue="idProveedor"
                placeholder="Seleccione proveedor"
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
              <label className="font-medium text-slate-700">Fecha</label>
              <Calendar
                value={new Date(form.fechaCompra)}
                onChange={(e) => setForm({ ...form, fechaCompra: e.value })}
                showIcon
                dateFormat="dd/mm/yy"
                className="w-full"
              />
            </div>
          </div>

          {/* === DETALLES === */}
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
              label="Guardar Compra"
              icon="pi pi-check"
              className="bg-indigo-600 hover:bg-indigo-700 border-none text-white px-4 py-2 rounded-lg transition-all"
              onClick={guardarCompra}
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        header={
          <div className="flex items-center gap-2 text-indigo-900 font-semibold">
            <i className="pi pi-eye text-indigo-600"></i>
            <span>Detalle de Compra</span>
          </div>
        }
        visible={detalleVisible}
        style={{ width: "60rem" }}
        modal
        className="rounded-xl backdrop-blur-xl bg-white/90"
        onHide={() => setDetalleVisible(false)}
      >
        {detalleCompra ? (
          <div className="space-y-4 mt-1">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-slate-700">Proveedor:</p>
                <p className="text-slate-800">
                  {detalleCompra.nombreProveedor || "-"}
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-700">Factura:</p>
                <p className="text-slate-800">
                  {detalleCompra.numeroFactura || "-"}
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-700">Fecha:</p>
                <p className="text-slate-800">
                  {new Date(detalleCompra.fechaCompra).toLocaleDateString(
                    "es-NI"
                  )}
                </p>
              </div>
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
                  </tr>
                </thead>
                <tbody>
                  {detalleCompra.detalles?.map((d, i) => (
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
                  ))}
                  {!detalleCompra.detalles?.length && (
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

            <div className="grid grid-cols-2 mt-2 text-right pr-6">
              <div></div>
              <div className="space-y-1 text-slate-700">
                <p>
                  <span className="font-medium">Subtotal:</span>{" "}
                  <span className="font-semibold">
                    C$ {detalleCompra.subTotal?.toFixed(2)}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Descuento:</span>{" "}
                  <span className="font-semibold">
                    C$ {detalleCompra.descuento?.toFixed(2)}
                  </span>
                </p>
                <p className="text-lg font-bold text-indigo-700">
                  Total: C$ {detalleCompra.total?.toFixed(2)}
                </p>
              </div>
            </div>

            {detalleCompra.observacion && (
              <div className="mt-4">
                <p className="font-medium text-slate-700">Observaciones:</p>
                <p className="text-slate-600">{detalleCompra.observacion}</p>
              </div>
            )}

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
