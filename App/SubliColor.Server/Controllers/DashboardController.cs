using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SubliColor.Server.Data;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("full")]
    public IActionResult GetFullDashboard()
    {
        // === Resumen ===
        var hoy = DateTime.Now.Date;
        var mañana = hoy.AddDays(1);

        var resumen = new
        {
            Usuarios = _context.Usuarios.Count(u => u.EstaActivo == true),
            Clientes = _context.Clientes.Count(c => c.EstaActivo == true),
            Productos = _context.Productos.Count(p => p.EstaActivo == true),
            VentasHoy = _context.Venta.Count(v => v.FechaCreacion.HasValue &&
                                                  v.FechaCreacion.Value >= hoy &&
                                                  v.FechaCreacion.Value < mañana
                                                  && v.EstaActivo == true)
        };


        // === Ventas mensuales ===
        var ventas = _context.Venta
                        .Where(v => v.FechaCreacion.HasValue && v.FechaCreacion.Value.Year == DateTime.Now.Year)
                        .GroupBy(v => v.FechaCreacion.Value.Month)
                        .Select(g => new
                        {
                            Mes = g.Key,
                            Total = g.Sum(v => v.Total)
                        })
                        .ToList();



        var ventasMensuales = Enumerable.Range(1, 12)
            .Select(m => ventas.FirstOrDefault(x => x.Mes == m)?.Total ?? 0)
            .ToList();

        // === Top productos ===
        var topProductos = _context.DetalleVenta
            .Include(d => d.IdProductoNavigation)
            .GroupBy(d => d.IdProductoNavigation.Nombre)
            .Select(g => new
            {
                Producto = g.Key,
                Cantidad = g.Sum(d => d.CantidadProducto)
            })
            .OrderByDescending(x => x.Cantidad)
            .Take(5)
            .ToList();

        return Ok(new
        {
            Resumen = resumen,
            VentasMensuales = ventasMensuales,
            TopProductos = topProductos
        });
    }
}