using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SubliColor.Server.Data;
using SubliColor.Server.Models;
using SubliColor.Server.Models.DTOs;

namespace SubliColor.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductosController(AppDbContext context)
        {
            _context = context;
        }

        // ========================= GET TODOS =========================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductoDto>>> GetProductos()
        {
            var productos = await _context.Productos
                .Include(p => p.ProductoExistencia)
                .Include(p => p.IdCategoriaNavigation)
                .ToListAsync();

            return Ok(productos.Select(MapToDto));
        }

        // ========================= GET SOLO ACTIVOS Y CON STOCK =========================
        [HttpGet("ActivosConStock")]
        public async Task<ActionResult<IEnumerable<ProductoDto>>> GetProductosActivosConStock()
        {
            var productos = await _context.Productos
                .Include(p => p.ProductoExistencia)
                .Include(p => p.IdCategoriaNavigation)
                .Where(p => p.EstaActivo == true &&
                            p.ProductoExistencia.Any(e => e.CantidadActual > 0))
                .ToListAsync();

            return Ok(productos.Select(MapToDto));
        }


        // ========================= GET UNO =========================
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductoDto>> GetProducto(int id)
        {
            var producto = await _context.Productos
                .Include(p => p.ProductoExistencia)
                .Include(p => p.IdCategoriaNavigation)
                .FirstOrDefaultAsync(p => p.IdProducto == id);

            if (producto == null)
                return NotFound("Producto no encontrado.");

            return Ok(MapToDto(producto));
        }

        // ========================= POST =========================
        [HttpPost]
        public async Task<ActionResult<ProductoDto>> CrearProducto([FromBody] CrearProductoDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nombre))
                return BadRequest("El nombre del producto es obligatorio.");

            var producto = new Producto
            {
                Codigo = dto.Codigo,
                Nombre = dto.Nombre,
                Descripcion = dto.Descripcion,
                PrecioVenta = dto.PrecioVenta ?? 0,
                IdCategoria = dto.IdCategoria,
                IdUnidadMedida = dto.IdUnidadMedida,
                IdEstado = 1,
                EstaActivo = true,
                IdUsuarioCreacion = 1,
                FechaCreacion = DateTime.Now
            };

            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();

            // === 1️⃣ Crear existencia inicial ===
            var existencia = new ProductoExistencia
            {
                IdProducto = producto.IdProducto,
                CantidadActual = dto.CantidadInicial ?? 0,
                UltimoCosto = dto.UltimoCosto ?? dto.PrecioCompra ?? 0,
                CostoPromedio = dto.PrecioCompra ?? 0,
                EstaActivo = true,
                IdUsuarioCreacion = 1,
                FechaCreacion = DateTime.Now
            };

            _context.ProductoExistencia.Add(existencia);
            await _context.SaveChangesAsync();

            // === 2️⃣ Registrar movimiento inicial ===
            var movimiento = new ProductoMovimiento
            {
                IdMovimientoProducto = Guid.NewGuid().GetHashCode(),
                IdTipoMovimiento = 1, // Entrada inicial
                Referencia = $"CREACIÓN-{producto.Codigo}",
                Comentario = "Creación de producto con existencia inicial",
                EstaActivo = true,
                IdUsuarioCreacion = 1,
                FechaCreacion = DateTime.Now
            };
            _context.ProductoMovimientos.Add(movimiento);
            await _context.SaveChangesAsync();

            // === 3️⃣ Registrar detalle del movimiento ===
            var detalle = new ProductoMovimientoDetalle
            {
                IdMovimientoProducto = movimiento.IdMovimientoProducto,
                IdProducto = producto.IdProducto,
                Cantidad = dto.CantidadInicial ?? 0,
                PrecioUnitario = dto.PrecioCompra ?? 0,
                EstaActivo = true,
                IdUsuarioCreacion = 1,
                FechaCreacion = DateTime.Now
            };
            _context.ProductoMovimientoDetalles.Add(detalle);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProducto), new { id = producto.IdProducto }, MapToDto(producto));
        }


        // ========================= PUT =========================
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarProducto(int id, [FromBody] ActualizarProductoDto dto)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
                return NotFound("Producto no encontrado.");

            producto.Codigo = dto.Codigo;
            producto.Nombre = dto.Nombre;
            producto.Descripcion = dto.Descripcion;
            producto.PrecioVenta = dto.PrecioVenta;
            producto.IdCategoria = dto.IdCategoria;
            producto.IdUnidadMedida = dto.IdUnidadMedida;
            producto.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ========================= DELETE =========================
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
                return NotFound("Producto no encontrado.");

            producto.EstaActivo = false;
            producto.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ========================= MAPPER =========================
        private ProductoDto MapToDto(Producto p)
        {
            var existencia = p.ProductoExistencia.FirstOrDefault();

            return new ProductoDto
            {
                IdProducto = p.IdProducto,
                Codigo = p.Codigo,
                Nombre = p.Nombre,
                Descripcion = p.Descripcion,
                PrecioVenta = p.PrecioVenta,
                IdCategoria = p.IdCategoria,
                IdUnidadMedida = p.IdUnidadMedida,
                IdEstado = p.IdEstado,
                EstaActivo = p.EstaActivo ?? false,
                CantidadActual = existencia?.CantidadActual ?? 0,
                UltimoCosto = existencia?.UltimoCosto ?? 0,
                CostoPromedio = existencia?.CostoPromedio ?? 0,
                NombreCategoria = p.IdCategoriaNavigation?.Nombre
            };
        }
    }
}
