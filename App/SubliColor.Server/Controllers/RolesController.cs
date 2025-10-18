using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SubliColor.Server.Data;
using SubliColor.Server.Models;
using SubliColor.Server.Models.DTOs;

namespace SubliColor.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RolesController(AppDbContext context)
        {
            _context = context;
        }

        // ================== GET TODOS ==================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RolDto>>> GetRoles()
        {
            var roles = await _context.Rols.ToListAsync();
            return roles.Select(MapToDto).ToList();
        }

        // ================== GET UNO ==================
        [HttpGet("{id}")]
        public async Task<ActionResult<RolDto>> GetRol(int id)
        {
            var rol = await _context.Rols.FindAsync(id);
            if (rol == null) return NotFound();

            return MapToDto(rol);
        }

        // ================== POST ==================
        [HttpPost]
        public async Task<ActionResult<RolDto>> CrearRol([FromBody] CrearRolDto dto)
        {
            var rol = new Rol
            {
                CodigoInterno = dto.CodigoInterno,
                Nombre = dto.Nombre,
                Descripcion = dto.Descripcion,
                EstaActivo = true,
                FechaCreacion = DateTime.UtcNow
            };

            _context.Rols.Add(rol);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRol), new { id = rol.IdRol }, MapToDto(rol));
        }

        // ================== PUT ==================
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarRol(int id, [FromBody] ActualizarRolDto dto)
        {
            if (id != dto.IdRol) return BadRequest();

            var rol = await _context.Rols.FindAsync(id);
            if (rol == null) return NotFound();

            rol.CodigoInterno = dto.CodigoInterno;
            rol.Nombre = dto.Nombre;
            rol.Descripcion = dto.Descripcion;
            rol.FechaModificacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ================== DELETE ==================
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarRol(int id)
        {
            var rol = await _context.Rols.FindAsync(id);
            if (rol == null) return NotFound();

            // 🔹 Borrado lógico
            rol.EstaActivo = false;
            rol.FechaModificacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ================== MAPPER ==================
        private RolDto MapToDto(Rol r) =>
            new RolDto
            {
                IdRol = r.IdRol,
                CodigoInterno = r.CodigoInterno,
                Nombre = r.Nombre,
                Descripcion = r.Descripcion,
                EstaActivo = r.EstaActivo ?? false
            };
    }
}
