using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SubliColor.Server.Data;
using SubliColor.Server.Models;
using SubliColor.Server.Models.DTOs;

namespace SubliColor.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccionesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AccionesController(AppDbContext context)
        {
            _context = context;
        }

        // ================== GET TODOS ==================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AccionDto>>> GetAcciones()
        {
            var acciones = await _context.Accions.ToListAsync();
            return acciones.Select(MapToDto).ToList();
        }

        // ================== GET UNO ==================
        [HttpGet("{id}")]
        public async Task<ActionResult<AccionDto>> GetAccion(int id)
        {
            var accion = await _context.Accions.FindAsync(id);
            if (accion == null) return NotFound();

            return MapToDto(accion);
        }

        // ================== POST ==================
        [HttpPost]
        public async Task<ActionResult<AccionDto>> CrearAccion([FromBody] CrearAccionDto dto)
        {
            var accion = new Accion
            {
                CodigoInterno = dto.CodigoInterno,
                Nombre = dto.Nombre,
                Descripcion = dto.Descripcion,
                EstaActivo = true,
                FechaCreacion = DateTime.UtcNow
            };

            _context.Accions.Add(accion);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAccion), new { id = accion.IdAccion }, MapToDto(accion));
        }

        // ================== PUT ==================
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarAccion(int id, [FromBody] ActualizarAccionDto dto)
        {
            if (id != dto.IdAccion) return BadRequest();

            var accion = await _context.Accions.FindAsync(id);
            if (accion == null) return NotFound();

            accion.CodigoInterno = dto.CodigoInterno;
            accion.Nombre = dto.Nombre;
            accion.Descripcion = dto.Descripcion;
            accion.FechaModificacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ================== DELETE ==================
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarAccion(int id)
        {
            var accion = await _context.Accions.FindAsync(id);
            if (accion == null) return NotFound();

            // 🔹 Borrado lógico
            accion.EstaActivo = false;
            accion.FechaModificacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ================== MAPPER ==================
        private AccionDto MapToDto(Accion a) =>
            new AccionDto
            {
                IdAccion = a.IdAccion,
                CodigoInterno = a.CodigoInterno,
                Nombre = a.Nombre,
                Descripcion = a.Descripcion,
                EstaActivo = a.EstaActivo ?? false
            };
    }
}
