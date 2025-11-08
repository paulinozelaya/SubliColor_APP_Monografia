using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SubliColor.Server.Data;
using SubliColor.Server.Models;
using SubliColor.Server.Models.DTOs;

namespace SubliColor.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ComprasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ComprasController(AppDbContext context)
        {
            _context = context;
        }

        // === GET ALL ===
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CompraDto>>> GetAll()
        {
            var compras = await _context.Compras
                .Include(c => c.IdProveedorNavigation)
                .Include(c => c.DetalleCompras)
                .ToListAsync();

            return Ok(compras.Select(c => new CompraDto
            {
                IdCompra = c.IdCompra,
                IdProveedor = c.IdProveedor,
                NombreProveedor = c.IdProveedorNavigation?.NombreProveedor,
                NumeroFactura = c.NumeroFactura,
                FechaCompra = c.FechaCompra,
                SubTotal = c.SubTotal,
                Descuento = c.Descuento,
                Total = c.Total,
                Observacion = c.Observacion,
                EstaActivo = c.EstaActivo
            }));
        }

        // === GET BY ID ===
        [HttpGet("{id}")]
        public async Task<ActionResult<CompraDto>> GetById(int id)
        {
            var compra = await _context.Compras
                .Include(c => c.IdProveedorNavigation)
                .Include(c => c.DetalleCompras)
                    .ThenInclude(dc => dc.IdProductoNavigation)
                .FirstOrDefaultAsync(c => c.IdCompra == id);

            if (compra == null)
                return NotFound();

            return new CompraDto
            {
                IdCompra = compra.IdCompra,
                IdProveedor = compra.IdProveedor,
                NombreProveedor = compra.IdProveedorNavigation?.NombreProveedor,
                NumeroFactura = compra.NumeroFactura,
                FechaCompra = compra.FechaCompra,
                SubTotal = compra.SubTotal,
                Descuento = compra.Descuento,
                Total = compra.Total,
                Observacion = compra.Observacion,
                EstaActivo = compra.EstaActivo,
                Detalles = compra.DetalleCompras.Select(dc => new DetalleCompraDto
                {
                    IdProducto = dc.IdProducto ?? 0,
                    NombreProducto = dc.IdProductoNavigation?.Nombre,
                    Cantidad = dc.CantidadProducto ?? 0,
                    PrecioUnitario = dc.PrecioUnitario ?? 0,
                    Descuento = dc.Descuento ?? 0
                }).ToList()
            };
        }

        // === CREATE ===
        [HttpPost]
        public async Task<IActionResult> CrearCompra([FromBody] CrearCompraDto dto)
        {
            if (dto.Detalles == null || !dto.Detalles.Any())
                return BadRequest("Debe incluir al menos un producto en la compra.");

            var compra = new Compra
            {
                IdProveedor = dto.IdProveedor,
                NumeroFactura = dto.NumeroFactura,
                FechaCompra = dto.FechaCompra ?? DateTime.Now,
                Descuento = dto.Descuento ?? 0,
                Observacion = dto.Observacion,
                EstaActivo = true,
                FechaCreacion = DateTime.Now
            };

            _context.Compras.Add(compra);
            await _context.SaveChangesAsync();

            decimal subTotal = 0;

            foreach (var d in dto.Detalles)
            {
                var detalle = new DetalleCompra
                {
                    IdCompra = compra.IdCompra,
                    IdProducto = d.IdProducto,
                    CantidadProducto = d.Cantidad,
                    PrecioUnitario = d.PrecioUnitario,
                    Descuento = d.Descuento,
                    Total = (d.PrecioUnitario - (d.Descuento ?? 0)) * d.Cantidad,
                    FechaCreacion = DateTime.Now
                };

                subTotal += detalle.Total ?? 0;
                _context.DetalleCompras.Add(detalle);

                // Actualizar existencia
                var existencia = await _context.ProductoExistencia
                    .FirstOrDefaultAsync(e => e.IdProducto == d.IdProducto);

                if (existencia != null)
                {
                    var stockAnterior = existencia.CantidadActual ?? 0;
                    var costoAnterior = existencia.CostoPromedio ?? 0;

                    var cantidadNueva = d.Cantidad;
                    var nuevoCosto = d.PrecioUnitario;

                    var nuevoPromedio = ((stockAnterior * costoAnterior) + (cantidadNueva * nuevoCosto)) /
                                        (stockAnterior + cantidadNueva);

                    existencia.CantidadActual = stockAnterior + cantidadNueva;
                    existencia.UltimoCosto = nuevoCosto;
                    existencia.CostoPromedio = nuevoPromedio;
                    existencia.FechaModificacion = DateTime.Now;
                }
            }

            compra.SubTotal = subTotal;
            compra.Total = subTotal - (dto.Descuento ?? 0);

            await _context.SaveChangesAsync();
            return Ok(new { message = "Compra registrada correctamente." });
        }

        // === DELETE ===
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var compra = await _context.Compras.FindAsync(id);
            if (compra == null)
                return NotFound();

            compra.EstaActivo = false;
            compra.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
