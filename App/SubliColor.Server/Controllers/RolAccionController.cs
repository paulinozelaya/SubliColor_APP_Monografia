using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SubliColor.Server.Data;
using SubliColor.Server.Models;
using SubliColor.Server.Models.DTOs;

namespace SubliColor.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolAccionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RolAccionController(AppDbContext context)
        {
            _context = context;
        }

        // ================== GET TODOS ==================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RolAccionDto>>> GetRolAcciones()
        {
            var rolAcciones = await _context.RolAccions
                .Include(ra => ra.IdRolNavigation)
                .Include(ra => ra.IdAccionNavigation)
                .ToListAsync();

            return rolAcciones.Select(MapToDto).ToList();
        }

        // ================== GET UNO ==================
        [HttpGet("{id}")]
        public async Task<ActionResult<RolAccionDto>> GetRolAccion(int id)
        {
            var rolAccion = await _context.RolAccions
                .Include(ra => ra.IdRolNavigation)
                .Include(ra => ra.IdAccionNavigation)
                .FirstOrDefaultAsync(ra => ra.IdRolAccion == id);

            if (rolAccion == null) return NotFound();

            return MapToDto(rolAccion);
        }

        // ================== POST ==================
        [HttpPost]
        public async Task<ActionResult<RolAccionDto>> CrearRolAccion([FromBody] CrearRolAccionDto dto)
        {
            var rolAccion = new RolAccion
            {
                IdRol = dto.IdRol,
                IdAccion = dto.IdAccion,
                EstaActivo = true,
                FechaCreacion = DateTime.UtcNow
            };

            _context.RolAccions.Add(rolAccion);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRolAccion), new { id = rolAccion.IdRolAccion }, MapToDto(rolAccion));
        }

        // ================== DELETE ==================
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarRolAccion(int id)
        {
            var rolAccion = await _context.RolAccions.FindAsync(id);
            if (rolAccion == null) return NotFound();

            rolAccion.EstaActivo = false;
            rolAccion.FechaModificacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ================== MAPPER ==================
        private RolAccionDto MapToDto(RolAccion ra) =>
            new RolAccionDto
            {
                IdRolAccion = ra.IdRolAccion,
                IdRol = (int)ra.IdRol,
                NombreRol = ra.IdRolNavigation?.Nombre,
                IdAccion = (int)ra.IdAccion,
                NombreAccion = ra.IdAccionNavigation?.Nombre,
                EstaActivo = ra.EstaActivo ?? false
            };
    }
}
