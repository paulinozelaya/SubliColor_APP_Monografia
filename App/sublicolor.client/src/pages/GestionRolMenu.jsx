import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Tree } from "primereact/tree";
import rolApi from "../api/rol";
import rolMenuApi from "../api/rolMenu";
import { useToast } from "../context/ToastContext";

export default function GestionRolMenu() {
  const [roles, setRoles] = useState([]);
  const [selectedRol, setSelectedRol] = useState(null);
  const [menus, setMenus] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const toast = useToast();

  useEffect(() => {
    cargarRoles();
    cargarMenus();
  }, []);

  const cargarRoles = async () => {
    const data = await rolApi.getAll();
    setRoles(data.map((r) => ({ label: r.nombre, value: r.idRol })));
  };

  const cargarMenus = async () => {
    const data = await rolMenuApi.getAllMenus();
    setMenus(transformarMenus(data));
  };

  const transformarMenus = (items) =>
    items.map((i) => ({
      key: i.idMenu,
      label: i.nombre,
      icon: i.icono || "pi pi-folder",
      children: i.subMenus?.length ? transformarMenus(i.subMenus) : [],
    }));

  const cargarMenusRol = async (idRol) => {
    const data = await rolMenuApi.getMenusPorRol(idRol);

    // Convertir el array [1,2,3] en el formato que PrimeReact espera
    const seleccionados = {};
    data.forEach((id) => {
      seleccionados[id.toString()] = { checked: true };
    });

    setCheckedKeys(seleccionados);
  };

  const guardarAsignacion = async () => {
    if (!selectedRol) {
      toast.current.show({
        severity: "warn",
        summary: "Rol requerido",
        detail: "Debes seleccionar un rol antes de guardar.",
      });
      return;
    }

    // Convertir el objeto a array [1,2,3]
    const idsSeleccionados = Object.keys(checkedKeys).map((id) => parseInt(id));

    await rolMenuApi.asignar({
      idRol: selectedRol,
      idsMenus: idsSeleccionados,
    });

    toast.current.show({
      severity: "success",
      summary: "Guardado",
      detail: "Asignaciones actualizadas correctamente.",
    });
  };

  return (
    <div className="p-0 animate-fadeIn">
      <Card
        title={
          <div className="flex justify-between items-center pr-2">
            <div className="flex items-center gap-2 text-indigo-900 font-semibold">
              <i className="pi pi-sitemap text-indigo-600 text-lg"></i>
              <span className="text-xl">Asignación de Menús a Roles</span>
            </div>
          </div>
        }
        className="rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-md bg-white/80"
      >
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center gap-3">
            <label className="text-slate-700 font-medium w-40">
              Seleccionar Rol:
            </label>
            <Dropdown
              value={selectedRol}
              options={roles}
              onChange={(e) => {
                setSelectedRol(e.value);
                cargarMenusRol(e.value);
              }}
              placeholder="Selecciona un rol"
              className="w-64"
            />
          </div>

          <div className="border border-gray-200 rounded-xl p-3 bg-white/70 shadow-inner">
            <Tree
              value={menus}
              selectionMode="checkbox"
              selectionKeys={checkedKeys}
              onSelectionChange={(e) => setCheckedKeys(e.value)}
              className="w-full text-slate-800"
            />
          </div>

          <div className="flex justify-end">
            <Button
              label="Guardar Asignaciones"
              icon="pi pi-save"
              className="bg-indigo-600 hover:bg-indigo-700 border-none text-white shadow-md px-4 py-2 rounded-lg"
              onClick={guardarAsignacion}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
