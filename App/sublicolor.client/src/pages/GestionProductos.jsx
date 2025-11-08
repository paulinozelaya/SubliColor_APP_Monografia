import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { useToast } from "../context/ToastContext";
import productoApi from "../api/productos";
import catalogosApi from "../api/catalogos";
import { InputTextarea } from "primereact/inputtextarea";

export default function GestionProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    idProducto: null,
    codigo: "",
    nombre: "",
    descripcion: "",
    precioVenta: null,
    idCategoria: null,
    idUnidadMedida: null,
  });
  const toast = useToast();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const [prods, cats, ums] = await Promise.all([
      productoApi.getAll(),
      catalogosApi.getValores("CP"),
      catalogosApi.getValores("UM"),
    ]);
    setProductos(prods);
    setCategorias(cats);
    setUnidadesMedida(ums);
  };

  const abrirNuevo = () => {
    setForm({
      idProducto: null,
      codigo: "",
      nombre: "",
      descripcion: "",
      precioVenta: null,
      idCategoria: null,
      idUnidadMedida: null,
    });
    setEditing(false);
    setVisible(true);
  };

  const abrirEditar = (p) => {
    setForm(p);
    setEditing(true);
    setVisible(true);
  };

  const guardarProducto = async () => {
    try {
      if (!form.nombre.trim()) {
        toast.current.show({
          severity: "warn",
          summary: "Campo requerido",
          detail: "El nombre es obligatorio",
        });
        return;
      }

      if (editing) {
        await productoApi.update(form.idProducto, form);
        toast.current.show({
          severity: "success",
          summary: "Actualizado",
          detail: "Producto actualizado correctamente",
        });
      } else {
        await productoApi.create(form);
        toast.current.show({
          severity: "success",
          summary: "Creado",
          detail: "Producto creado correctamente",
        });
      }

      setVisible(false);
      cargarDatos();
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar el producto",
      });
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await productoApi.remove(id);
      toast.current.show({
        severity: "warn",
        summary: "Eliminado",
        detail: "Producto eliminado correctamente",
      });
      cargarDatos();
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el producto",
      });
    }
  };

  return (
    <div className="p-0 animate-fadeIn">
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
        <DataTable
          value={productos}
          paginator
          rows={10}
          className="text-sm"
          stripedRows
          emptyMessage="No hay productos registrados"
          responsiveLayout="scroll"
        >
          <Column field="codigo" header="Código" sortable />
          <Column field="nombre" header="Nombre" sortable />
          <Column field="nombreCategoria" header="Categoría" />
          <Column
            field="precioVenta"
            header="Precio Venta"
            body={(r) => `C$ ${r.precioVenta?.toFixed(2)}`}
            sortable
          />
          <Column
            field="cantidadActual"
            header="Stock"
            body={(r) => r.cantidadActual ?? 0}
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
                  icon="pi pi-pencil"
                  rounded
                  text
                  severity="info"
                  tooltip="Editar"
                  onClick={() => abrirEditar(r)}
                />
                <Button
                  icon="pi pi-trash"
                  rounded
                  text
                  severity="danger"
                  tooltip="Eliminar"
                  onClick={() => eliminarProducto(r.idProducto)}
                />
              </div>
            )}
          />
        </DataTable>
      </Card>

      <Dialog
        header={
          <div className="flex items-center gap-2 text-indigo-900 font-semibold">
            <i className="pi pi-box text-indigo-600"></i>
            <span>{editing ? "Editar Producto" : "Nuevo Producto"}</span>
          </div>
        }
        visible={visible}
        style={{ width: "45rem" }}
        modal
        className="rounded-xl backdrop-blur-xl bg-white/90"
        onHide={() => setVisible(false)}
      >
        <div className="p-fluid space-y-3">
          {/* === FILA 1 === */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-slate-700">Código *</label>
              <InputText
                value={form.codigo}
                onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                autoComplete="off"
                disabled={editing}
              />
            </div>
            <div>
              <label className="font-medium text-slate-700">Nombre *</label>
              <InputText
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                autoComplete="off"
              />
            </div>
          </div>

          {/* === FILA 2 === */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-slate-700">Categoría</label>
              <Dropdown
                value={form.idCategoria}
                options={categorias}
                onChange={(e) => setForm({ ...form, idCategoria: e.value })}
                optionLabel="nombre"
                optionValue="idValor"
                placeholder="Seleccione una categoría"
                className="w-full"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700">
                Unidad de Medida
              </label>
              <Dropdown
                value={form.idUnidadMedida}
                options={unidadesMedida}
                onChange={(e) => setForm({ ...form, idUnidadMedida: e.value })}
                optionLabel="nombre"
                optionValue="idValor"
                placeholder="Seleccione una unidad"
                className="w-full"
              />
            </div>
          </div>

          {/* === FILA 3 === */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-slate-700">
                Precio Venta *
              </label>
              <InputNumber
                value={form.precioVenta}
                onValueChange={(e) =>
                  setForm({ ...form, precioVenta: e.value || 0 })
                }
                mode="currency"
                currency="NIO"
                locale="es-NI"
                className="w-full"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700">
                Precio Compra
              </label>
              <InputNumber
                value={form.precioCompra}
                onValueChange={(e) =>
                  setForm({ ...form, precioCompra: e.value || 0 })
                }
                mode="currency"
                currency="NIO"
                locale="es-NI"
                className="w-full"
              />
            </div>
          </div>

          {/* === FILA 4 === */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-slate-700">Último Costo</label>
              <InputNumber
                value={form.ultimoCosto}
                onValueChange={(e) =>
                  setForm({ ...form, ultimoCosto: e.value || 0 })
                }
                mode="currency"
                currency="NIO"
                locale="es-NI"
                className="w-full"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700">
                Cantidad Inicial
              </label>
              <InputNumber
                value={form.cantidadInicial}
                onValueChange={(e) =>
                  setForm({ ...form, cantidadInicial: e.value || 0 })
                }
                min={0}
                className="w-full"
              />
            </div>
          </div>

          {/* === FILA 5 === */}
          <div>
            <label className="font-medium text-slate-700">Descripción</label>
            <InputTextarea
              rows={3}
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
              autoResize
              className="w-full"
            />
          </div>

          {/* === BOTONES === */}
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
              onClick={guardarProducto}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
