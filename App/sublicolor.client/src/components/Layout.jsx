import { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import api from "../api/menu";

export default function Layout() {
  const [menuItems, setMenuItems] = useState([]);
  const [fechaHora, setFechaHora] = useState(new Date());
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);
  const [openMenus, setOpenMenus] = useState({});
 
  const toggleMenu = (nombre) => {
    setOpenMenus((prev) => ({
      ...prev,
      [nombre]: !prev[nombre],
    }));
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        const idUsuario = usuario?.idUsuario;
        if (!idUsuario) return;

        const data = await api.getMenuJerarquico(idUsuario);
        setMenuItems([
          { nombre: "Dashboard", icono: "pi pi-home", url: "/dashboard" },
          ...data,
        ]);
      } catch (error) {
        console.error("Error cargando menú", error);
      }
    };

    fetchMenu();
    const timer = setInterval(() => setFechaHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const usuario = JSON.parse(localStorage.getItem("usuario")) || {
    nombre: "Invitado",
  };

  const userMenu = [
    { label: "Perfil", icon: "pi pi-user", command: () => navigate("/perfil") },
    { separator: true },
    {
      label: "Cerrar sesión",
      icon: "pi pi-sign-out",
      command: () => {
        localStorage.clear();
        navigate("/login");
      },
    },
  ];

  const renderMenuItems = (items, nivel = 0) => {
    return items.map((item) => {
      const active = location.pathname === item.url;
      const tieneHijos = item.subMenus && item.subMenus.length > 0;
      const isOpen = openMenus[item.nombre] || false;

      return (
        <div key={item.nombre} className="mb-1">
          {/* Item principal */}
          <div
            onClick={() => {
              if (tieneHijos) {
                toggleMenu(item.nombre);
              } else {
                navigate(item.url);
              }
            }}
            className={classNames(
              "group flex items-center justify-between px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 relative overflow-hidden",
              active
                ? "bg-indigo-500 text-white shadow-md ring-1 ring-indigo-300/50"
                : "text-white hover:bg-indigo-700/50 hover:text-white"
            )}
            style={{ paddingLeft: `${1.5 + nivel * 1.2}rem` }}
          >
            {/* Izquierda: icono + texto */}
            <div className="flex items-center gap-3">
              <i
                className={classNames(
                  item.icono || "pi pi-folder",
                  "text-lg opacity-80 group-hover:opacity-100 transition-transform duration-200",
                  active && "scale-110"
                )}
              />
              {!collapsed && (
                <span className="font-medium tracking-wide truncate transition-all">
                  {item.nombre}
                </span>
              )}
            </div>

            {/* Derecha: flecha si tiene hijos */}
            {tieneHijos && !collapsed && (
              <i
                className={classNames(
                  "pi transition-transform duration-200 text-sm",
                  isOpen ? "pi-chevron-down" : "pi-chevron-right"
                )}
              />
            )}
          </div>

          {/* Submenús (si está abierto) */}
          {tieneHijos && isOpen && (
            <div className="ml-2 border-l border-indigo-700/30 pl-2 mt-1">
              {renderMenuItems(item.subMenus, nivel + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-200 text-slate-800">
      {/* Sidebar */}
      <aside
        className={classNames(
          "flex flex-col backdrop-blur-md bg-gradient-to-b from-indigo-950 via-indigo-900 to-slate-900 text-gray-200 transition-all duration-500 ease-in-out shadow-xl border-r border-indigo-700/50",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* User info / Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-indigo-700/60">
          <div
            className={classNames(
              "flex items-center gap-3 transition-all duration-500",
              collapsed ? "justify-center w-full" : "justify-start"
            )}
          >
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-semibold text-white leading-tight">
                  {usuario?.nombre ?? "Paulino Zelaya"}
                </span>
                <span className="text-xs text-white">
                  {usuario?.rol || "Administrador"}
                </span>
              </div>
            )}
          </div>

          <Button
            icon={
              collapsed ? "pi pi-angle-double-right" : "pi pi-angle-double-left"
            }
            className="p-button-text text-gray-400 hover:text-indigo-300 transition-all"
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>

        {/* Sidebar menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {renderMenuItems(menuItems)}
        </nav>

        {/* Sidebar footer */}
        <div className="p-3 border-t border-indigo-800/40 text-center text-xs text-gray-400 select-none">
          {!collapsed ? "© 2025 SubliColor" : "©"}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-3 bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900/90 text-white backdrop-blur-md border-b border-indigo-800/40 shadow-lg sticky top-0 z-20">
          {/* Empresa a la izquierda */}
          <div className="flex items-center gap-3 select-none">
            <img
              src="https://subir-imagen.com/images/2025/10/15/IMG_9439.jpeg"
              alt="logo"
              className="h-12 w-12 rounded-md object-cover shadow-sm"
            />
            <span className="text-xl font-bold tracking-wide">SubliColor</span>
          </div>

          {/* Menú usuario a la derecha */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/30 rounded-full cursor-pointer hover:bg-indigo-600/50 transition-all shadow-sm select-none border border-indigo-500/30"
              onClick={(e) => userMenuRef.current.toggle(e)}
            >
              <Avatar
                label={usuario?.nombre?.[0]?.toUpperCase() || "U"}
                shape="circle"
                size="small"
                image={`https://api.dicebear.com/8.x/thumbs/svg?seed=${
                  usuario?.nombre ?? "User"
                }`}
                style={{
                  backgroundColor: "#4f46e5",
                  color: "white",
                }}
              />
              <span className="font-medium text-white hidden sm:block">
                {usuario?.nombre ?? "Paulino Zelaya"}
              </span>
            </div>
            <Menu
              model={userMenu}
              popup
              ref={userMenuRef}
              className="p-menu-sm surface-overlay bg-slate-800/90 text-white backdrop-blur-md shadow-lg rounded-xl border border-indigo-600/30"
            />
          </div>
        </header>

        {/* Main view */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50/80 to-indigo-50/50 p-4">
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-xl min-h-full border border-white/20 p-4">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="py-2 text-center text-xs text-white border-t bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900/90 backdrop-blur-md shadow-inner select-none">
          📅 {fechaHora.toLocaleDateString()} ⏰{" "}
          {fechaHora.toLocaleTimeString()}
        </footer>
      </div>
    </div>
  );
}
