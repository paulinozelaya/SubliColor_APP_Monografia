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
                //.Include(p => p.IdCategoria)
                .Include(p => p.ProductoExistencia)
                .ToListAsync();

            return productos.Select(MapToDto).ToList();
        }

        // ========================= GET UNO =========================
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductoDto>> GetProducto(int id)
        {
            var producto = await _context.Productos
                .Include(p => p.IdCategoria)
                .Include(p => p.ProductoExistencia)
                .FirstOrDefaultAsync(p => p.IdProducto == id);

            if (producto == null) return NotFound();

            return MapToDto(producto);
        }

        // ========================= POST =========================
        [HttpPost]
        public async Task<ActionResult<ProductoDto>> CrearProducto([FromBody] CrearProductoDto dto)
        {
            var producto = new Producto
            {
                Codigo = dto.Codigo,
                Nombre = dto.Nombre,
                Descripcion = dto.Descripcion,
                PrecioVenta = dto.PrecioVenta,
                IdCategoria = dto.IdCategoria,
                IdUnidadMedida = dto.IdUnidadMedida,
                IdEstado = dto.IdEstado,
                EstaActivo = true,
                FechaCreacion = DateTime.UtcNow
            };

            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();

            // Crear existencia inicial
            var existencia = new ProductoExistencia
            {
                IdProducto = producto.IdProducto,
                CantidadActual = 0,
                UltimoCosto = 0,
                CostoPromedio = 0,
                EstaActivo = true,
                FechaCreacion = DateTime.UtcNow
            };

            _context.ProductoExistencia.Add(existencia);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProducto), new { id = producto.IdProducto }, MapToDto(producto));
        }

        // ========================= PUT =========================
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarProducto(int id, [FromBody] ActualizarProductoDto dto)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null) return NotFound();

            producto.Codigo = dto.Codigo;
            producto.Nombre = dto.Nombre;
            producto.Descripcion = dto.Descripcion;
            producto.PrecioVenta = dto.PrecioVenta;
            producto.IdCategoria = dto.IdCategoria;
            producto.IdUnidadMedida = dto.IdUnidadMedida;
            producto.IdEstado = dto.IdEstado;
            producto.FechaModificacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ========================= DELETE =========================
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null) return NotFound();

            producto.EstaActivo = false; // borrado lógico
            producto.FechaModificacion = DateTime.UtcNow;

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
                CantidadActual = existencia?.CantidadActual,
                UltimoCosto = existencia?.UltimoCosto,
                CostoPromedio = existencia?.CostoPromedio
            };
        }
    }
}