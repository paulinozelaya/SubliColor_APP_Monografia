using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SubliColor.Server.Data;
using SubliColor.Server.Models;
using SubliColor.Server.Models.DTOs;

namespace SubliColor.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VentasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VentasController(AppDbContext context)
        {
            _context = context;
        }

        // ===================== GET =====================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VentaDto>>> GetVentas()
        {
            var ventas = await _context.Venta
                .Include(v => v.IdClienteNavigation)
                    .ThenInclude(c => c.IdPersonaNavigation)
                .ToListAsync();

            // Catálogo de métodos de pago
            var metodosPago = await _context.Valors
                .Include(v => v.IdCategoriaNavigation)
                .Where(v => v.IdCategoriaNavigation.CodigoInterno == "MP")
                .ToListAsync();

            var result = ventas.Select(v =>
            {
                var metodo = metodosPago.FirstOrDefault(m => m.IdValor == v.IdMetodoPago);

                return new VentaDto
                {
                    IdVenta = v.IdVenta,
                    IdCliente = v.IdCliente,
                    NombreCliente = v.IdClienteNavigation?.IdPersonaNavigation != null
                        ? $"{v.IdClienteNavigation.IdPersonaNavigation.PrimerNombre} " +
                          $"{v.IdClienteNavigation.IdPersonaNavigation.SegundoNombre} " +
                          $"{v.IdClienteNavigation.IdPersonaNavigation.PrimerApellido} " +
                          $"{v.IdClienteNavigation.IdPersonaNavigation.SegundoApellido}".Trim()
                        : "Mostrador",
                    NumeroFactura = v.NumeroFactura,
                    FechaCreacion = v.FechaCreacion,
                    SubTotal = v.SubTotal,
                    Descuento = v.Descuento,
                    Total = v.Total,
                    MetodoPago = metodo?.Nombre ?? "No definido",
                    EstaActivo = v.EstaActivo
                };
            }).ToList();

            return Ok(result);
        }

        // ===================== GET {id} =====================
        [HttpGet("{id}")]
        public async Task<ActionResult<VentaDetalleDto>> GetVenta(int id)
        {
            var venta = await _context.Venta
                .Include(v => v.DetalleVenta)
                    .ThenInclude(dv => dv.IdProductoNavigation)
                .Include(v => v.IdClienteNavigation)
                    .ThenInclude(c => c.IdPersonaNavigation)
                .FirstOrDefaultAsync(v => v.IdVenta == id);

            if (venta == null)
                return NotFound();

            // Traer el nombre del método de pago
            var metodoPago = await _context.Valors
                .Where(v => v.IdValor == venta.IdMetodoPago)
                .Select(v => v.Nombre)
                .FirstOrDefaultAsync();

            // Armar DTO principal
            var dto = new VentaDetalleDto
            {
                IdVenta = venta.IdVenta,
                NumeroFactura = venta.NumeroFactura,
                FechaCreacion = venta.FechaCreacion,
                SubTotal = venta.SubTotal,
                Descuento = venta.Descuento,
                Total = venta.Total,
                MetodoPago = metodoPago ?? "No definido",
                NombreCliente = venta.IdClienteNavigation?.IdPersonaNavigation != null
                    ? $"{venta.IdClienteNavigation.IdPersonaNavigation.PrimerNombre} " +
                      $"{venta.IdClienteNavigation.IdPersonaNavigation.SegundoNombre} " +
                      $"{venta.IdClienteNavigation.IdPersonaNavigation.PrimerApellido} " +
                      $"{venta.IdClienteNavigation.IdPersonaNavigation.SegundoApellido}".Trim()
                    : "Mostrador",
                Observacion = venta.Observacion,
                EstaActivo = venta.EstaActivo,
                Detalles = venta.DetalleVenta.Select(d => new DetalleVentaDto
                {
                    IdProducto = d.IdProducto,
                    NombreProducto = d.IdProductoNavigation?.Nombre ?? "Sin nombre",
                    Cantidad = d.CantidadProducto,
                    PrecioUnitario = d.PrecioUnitario,
                    Descuento = d.Descuento
                }).ToList()
            };

            return Ok(dto);
        }


        // ===================== POST =====================
        [HttpPost]
        public async Task<IActionResult> CrearVenta([FromBody] CrearVentaDto dto)
        {
            if (dto == null || dto.Detalles == null || dto.Detalles.Count == 0)
                return BadRequest("La venta debe tener al menos un producto.");

            // Generar número de factura si no se envía
            if (string.IsNullOrWhiteSpace(dto.NumeroFactura))
            {
                var ultimoId = await _context.Venta.MaxAsync(v => (int?)v.IdVenta) ?? 0;
                dto.NumeroFactura = $"V-{(ultimoId + 1).ToString("D6")}";
            }

            // Calcular subtotal y total
            decimal? subtotal = dto.Detalles.Sum(d => (d.PrecioUnitario - d.Descuento) * d.Cantidad);
            decimal? total = subtotal - dto.Descuento;

            var venta = new Venta
            {
                IdCliente = dto.IdCliente,
                NumeroFactura = dto.NumeroFactura,
                IdMetodoPago = dto.IdMetodoPago,
                SubTotal = subtotal,
                Descuento = dto.Descuento,
                Total = total,
                Observacion = dto.Observacion,
                EstaPagado = true,
                EstaActivo = true,
                FechaCreacion = DateTime.Now
            };

            _context.Venta.Add(venta);
            await _context.SaveChangesAsync();

            // ===================== Detalle + Inventario + Movimiento =====================
            foreach (var item in dto.Detalles)
            {
                // Crear detalle de la venta
                var detalle = new DetalleVentum
                {
                    IdVenta = venta.IdVenta,
                    IdProducto = item.IdProducto,
                    CantidadProducto = item.Cantidad,
                    PrecioUnitario = item.PrecioUnitario,
                    Descuento = item.Descuento,
                    PrecioTotal = (item.PrecioUnitario - item.Descuento) * item.Cantidad,
                    EstaActivo = true,
                    FechaCreacion = DateTime.Now
                };
                _context.DetalleVenta.Add(detalle);

                // Actualizar inventario
                var existencia = await _context.ProductoExistencia
                    .FirstOrDefaultAsync(pe => pe.IdProducto == item.IdProducto);

                if (existencia != null)
                {
                    existencia.CantidadActual -= item.Cantidad;
                    existencia.FechaModificacion = DateTime.Now;
                }

                // Registrar movimiento
                var movimiento = new ProductoMovimiento
                {
                    IdMovimientoProducto = Guid.NewGuid().GetHashCode(),
                    IdTipoMovimiento = 2, // 2 = Venta
                    Referencia = $"VENTA-{venta.IdVenta}",
                    Comentario = "Salida por venta",
                    FechaCreacion = DateTime.Now,
                    EstaActivo = true
                };

                _context.ProductoMovimientos.Add(movimiento);
                await _context.SaveChangesAsync(); // obtener IdMovimiento generado

                var detalleMovimiento = new ProductoMovimientoDetalle
                {
                    IdMovimientoProducto = movimiento.IdMovimientoProducto,
                    IdProducto = item.IdProducto,
                    Cantidad = item.Cantidad,
                    PrecioUnitario = item.PrecioUnitario,
                    FechaCreacion = DateTime.Now,
                    EstaActivo = true
                };

                _context.ProductoMovimientoDetalles.Add(detalleMovimiento);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Venta registrada correctamente" });
        }

        // ===================== DELETE =====================
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarVenta(int id)
        {
            var venta = await _context.Venta.FindAsync(id);
            if (venta == null)
                return NotFound();

            venta.EstaActivo = false;
            venta.FechaModificacion = DateTime.Now;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
