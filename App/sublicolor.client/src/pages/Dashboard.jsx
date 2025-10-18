import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("/api/Dashboard/full").then((res) => setData(res.data));
  }, []);

  if (!data)
    return (
      <div className="flex justify-center items-center h-96">
        <ProgressSpinner />
      </div>
    );

  const { resumen, ventasMensuales, topProductos } = data;
  console.log(data)

  const chartData = {
    labels: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ],
    datasets: [
      {
        label: "Ventas Mensuales",
        data: ventasMensuales,
        fill: true,
        backgroundColor: "rgba(59,130,246,0.1)",
        borderColor: "#3b82f6",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false, // ✅ asegura que se adapte al contenedor
    plugins: {
      legend: {
        labels: { color: "#475569", font: { size: 12 } },
      },
    },
    scales: {
      x: {
        ticks: { color: "#6b7280" },
        grid: { color: "rgba(107,114,128,0.1)" },
      },
      y: {
        ticks: { color: "#6b7280" },
        grid: { color: "rgba(107,114,128,0.1)" },
      },
    },
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* --- Tarjetas resumen --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Usuarios",
            value: resumen?.usuarios,
            icon: "pi pi-users",
            color: "from-indigo-500 to-indigo-700",
          },
          {
            title: "Clientes",
            value: resumen?.clientes,
            icon: "pi pi-briefcase",
            color: "from-blue-500 to-blue-700",
          },
          {
            title: "Productos",
            value: resumen?.productos,
            icon: "pi pi-box",
            color: "from-teal-500 to-teal-700",
          },
          {
            title: "Ventas Hoy",
            value: resumen?.ventasHoy,
            icon: "pi pi-shopping-cart",
            color: "from-emerald-500 to-emerald-700",
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`p-5 rounded-xl shadow-md bg-gradient-to-br ${card.color} text-white transform hover:scale-[1.02] transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">{card.title}</p>
                <p className="text-3xl font-semibold mt-1">{card.value ?? 0}</p>
              </div>
              <i className={`${card.icon} text-4xl opacity-80`} />
            </div>
          </div>
        ))}
      </div>

      {/* --- Gráfico y Top productos en 2 columnas --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* --- Gráfico --- */}
        <Card
          title={
            <div className="flex items-center gap-2 text-indigo-900 font-semibold">
              <i className="pi pi-chart-line text-indigo-600 text-lg"></i>
              <span>Ventas Mensuales</span>
            </div>
          }
          className="rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-md bg-white/90"
        >
          <div className="h-64 sm:h-72 md:h-80 px-2 py-2">
            <Chart
              type="line"
              data={{
                labels: [
                  "Ene",
                  "Feb",
                  "Mar",
                  "Abr",
                  "May",
                  "Jun",
                  "Jul",
                  "Ago",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dic",
                ],
                datasets: [
                  {
                    label: "Ventas",
                    data: ventasMensuales,
                    fill: true,
                    backgroundColor: "rgba(99,102,241,0.08)", // fondo suave indigo
                    borderColor: "#6366f1",
                    pointBackgroundColor: "#6366f1",
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    tension: 0.35,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false, // 🔹 oculta la leyenda superior
                  },
                  tooltip: {
                    backgroundColor: "rgba(30,41,59,0.9)",
                    titleColor: "#fff",
                    bodyColor: "#e2e8f0",
                    borderColor: "#6366f1",
                    borderWidth: 1,
                    cornerRadius: 8,
                  },
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: {
                      color: "#475569",
                      font: { size: 12 },
                    },
                  },
                  y: {
                    grid: {
                      color: "rgba(148,163,184,0.15)",
                      drawBorder: false,
                    },
                    ticks: {
                      color: "#475569",
                      font: { size: 11 },
                      stepSize: 1,
                    },
                  },
                },
                elements: {
                  line: { borderWidth: 2 },
                },
              }}
            />
          </div>
        </Card>

        {/* --- Top Productos --- */}
        <Card
          title="🏆 Top 5 Productos Más Vendidos"
          className="rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-md bg-white/80"
        >
          <div className="h-72 sm:h-80 md:h-96 overflow-y-auto">
            <DataTable
              value={topProductos}
              stripedRows
              className="mt-3"
              emptyMessage="No hay datos disponibles"
            >
              <Column field="producto" header="Producto" sortable></Column>
              <Column
                field="cantidad"
                header="Cantidad Vendida"
                sortable
                body={(rowData) => (
                  <span className="font-semibold text-indigo-600">
                    {rowData.cantidad}
                  </span>
                )}
              ></Column>
            </DataTable>
          </div>
        </Card>
      </div>
    </div>
  );
}
