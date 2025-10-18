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

        // ================= GET TODOS =================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VentaDto>>> GetVentas()
        {
            var ventas = await _context.Venta
                .Include(v => v.IdClienteNavigation).ThenInclude(c => c.IdPersonaNavigation)
                .Include(v => v.DetalleVenta).ThenInclude(d => d.IdProductoNavigation)
                .Where(v => v.EstaActivo == true)
                .ToListAsync();

            return ventas.Select(MapToDto).ToList();
        }

        // ================= GET UNO =================
        [HttpGet("{id}")]
        public async Task<ActionResult<VentaDto>> GetVenta(int id)
        {
            var venta = await _context.Venta
                .Include(v => v.IdClienteNavigation).ThenInclude(c => c.IdPersonaNavigation)
                .Include(v => v.DetalleVenta).ThenInclude(d => d.IdProductoNavigation)
                .FirstOrDefaultAsync(v => v.IdVenta == id && v.EstaActivo == true);

            if (venta == null) return NotFound();

            return MapToDto(venta);
        }

        // ================= POST =================
        [HttpPost]
        public async Task<ActionResult<VentaDto>> CrearVenta([FromBody] CrearVentaDto dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var venta = new Venta
                {
                    IdCliente = dto.IdCliente,
                    NumeroFactura = dto.NumeroFactura,
                    SubTotal = dto.Detalles.Sum(d => d.CantidadProducto * d.PrecioUnitario),
                    Descuento = dto.Detalles.Sum(d => d.Descuento),
                    Total = dto.Detalles.Sum(d => (d.CantidadProducto * d.PrecioUnitario) - d.Descuento),
                    IdMetodoPago = dto.IdMetodoPago,
                    Observacion = dto.Observacion,
                    EstaPagado = true,
                    EstaActivo = true,
                    FechaCreacion = DateTime.UtcNow
                };

                _context.Venta.Add(venta);
                await _context.SaveChangesAsync();

                foreach (var d in dto.Detalles)
                {
                    var detalle = new DetalleVentum
                    {
                        IdVenta = venta.IdVenta,
                        IdProducto = d.IdProducto,
                        CantidadProducto = d.CantidadProducto,
                        PrecioUnitario = d.PrecioUnitario,
                        Descuento = d.Descuento,
                        PrecioTotal = (d.CantidadProducto * d.PrecioUnitario) - d.Descuento,
                        FechaCreacion = DateTime.UtcNow,
                        EstaActivo = true
                    };

                    _context.DetalleVenta.Add(detalle);

                    // ================= Ajustar inventario =================
                    var existencia = await _context.ProductoExistencia
                        .FirstOrDefaultAsync(pe => pe.IdProducto == d.IdProducto);

                    if (existencia == null)
                    {
                        existencia = new ProductoExistencia
                        {
                            IdProducto = d.IdProducto,
                            CantidadActual = 0,
                            UltimoCosto = 0,
                            CostoPromedio = 0,
                            EstaActivo = true,
                            FechaCreacion = DateTime.UtcNow
                        };
                        _context.ProductoExistencia.Add(existencia);
                    }

                    existencia.CantidadActual = (existencia.CantidadActual ?? 0) - d.CantidadProducto;
                    existencia.FechaModificacion = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return CreatedAtAction(nameof(GetVenta), new { id = venta.IdVenta }, MapToDto(venta));
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest($"Error al crear la venta: {ex.Message}");
            }
        }

        // ================= DELETE (Anular Venta) =================
        [HttpDelete("{id}")]
        public async Task<IActionResult> AnularVenta(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var venta = await _context.Venta
                    .Include(v => v.DetalleVenta)
                    .FirstOrDefaultAsync(v => v.IdVenta == id);

                if (venta == null) return NotFound();

                venta.EstaActivo = false;
                venta.FechaModificacion = DateTime.UtcNow;

                // ================= Devolver stock =================
                foreach (var d in venta.DetalleVenta)
                {
                    var existencia = await _context.ProductoExistencia
                        .FirstOrDefaultAsync(pe => pe.IdProducto == d.IdProducto);

                    if (existencia != null)
                    {
                        existencia.CantidadActual = (existencia.CantidadActual ?? 0) + d.CantidadProducto;
                        existencia.FechaModificacion = DateTime.UtcNow;
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest($"Error al anular la venta: {ex.Message}");
            }
        }

        // ================== MAPPER ==================
        private VentaDto MapToDto(Venta v) =>
            new VentaDto
            {
                IdVenta = v.IdVenta,
                IdCliente = (int)v.IdCliente,
                NombreCliente = $"{v.IdClienteNavigation?.IdPersonaNavigation?.PrimerNombre} {v.IdClienteNavigation?.IdPersonaNavigation?.PrimerApellido}",
                NumeroFactura = v.NumeroFactura,
                SubTotal = v.SubTotal,
                Descuento = v.Descuento,
                Total = v.Total,
                IdMetodoPago = v.IdMetodoPago,
                Observacion = v.Observacion,
                EstaPagado = v.EstaPagado,
                EstaActivo = v.EstaActivo,
                FechaCreacion = v.FechaCreacion,
                Detalles = v.DetalleVenta.Select(d => new DetalleVentaDto
                {
                    IdProducto = (int)d.IdProducto,
                    NombreProducto = d.IdProductoNavigation?.Nombre,
                    CantidadProducto = (int)d.CantidadProducto,
                    PrecioUnitario = (decimal)d.PrecioUnitario,
                    Descuento = (decimal)d.Descuento,
                    PrecioTotal = (decimal)d.PrecioTotal
                }).ToList()
            };
    }
}
