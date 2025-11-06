using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SubliColor.Server.Data;
using SubliColor.Server.Models;
using SubliColor.Server.Models.DTOs;

namespace SubliColor.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoriaDto>>> GetCategorias()
        {
            var categorias = await _context.Categoria
                .Select(c => new CategoriaDto
                {
                    IdCategoria = c.IdCategoria,
                    CodigoInterno = c.CodigoInterno,
                    Nombre = c.Nombre,
                    Descripcion = c.Descripcion,
                    EstaActivo = c.EstaActivo ?? true
                })
                .ToListAsync();

            return Ok(categorias);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoriaDto>> GetCategoria(int id)
        {
            var c = await _context.Categoria.FindAsync(id);
            if (c == null) return NotFound();

            return new CategoriaDto
            {
                IdCategoria = c.IdCategoria,
                CodigoInterno = c.CodigoInterno,
                Nombre = c.Nombre,
                Descripcion = c.Descripcion,
                EstaActivo = c.EstaActivo ?? true
            };
        }

        [HttpPost]
        public async Task<ActionResult<CategoriaDto>> CrearCategoria([FromBody] CategoriaDto dto)
        {
            var categoria = new Categoria
            {
                CodigoInterno = dto.CodigoInterno,
                Nombre = dto.Nombre,
                Descripcion = dto.Descripcion,
                EstaActivo = true,
                FechaCreacion = DateTime.UtcNow
            };

            _context.Categoria.Add(categoria);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategoria), new { id = categoria.IdCategoria }, dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarCategoria(int id, [FromBody] CategoriaDto dto)
        {
            var categoria = await _context.Categoria.FindAsync(id);
            if (categoria == null) return NotFound();

            categoria.CodigoInterno = dto.CodigoInterno;
            categoria.Nombre = dto.Nombre;
            categoria.Descripcion = dto.Descripcion;
            categoria.FechaModificacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarCategoria(int id)
        {
            var categoria = await _context.Categoria.FindAsync(id);
            if (categoria == null) return NotFound();

            categoria.EstaActivo = false;
            categoria.FechaModificacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
