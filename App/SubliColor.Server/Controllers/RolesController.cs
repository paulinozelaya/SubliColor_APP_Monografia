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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RolDto>>> GetRoles()
        {
            var roles = await _context.Rols
                .Select(r => new RolDto
                {
                    IdRol = r.IdRol,
                    CodigoInterno = r.CodigoInterno,
                    Nombre = r.Nombre ?? "",
                    Descripcion = r.Descripcion,
                    EstaActivo = r.EstaActivo ?? true
                })
                .ToListAsync();

            return Ok(roles);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RolDto>> GetRol(int id)
        {
            var rol = await _context.Rols.FindAsync(id);
            if (rol == null) return NotFound();

            return new RolDto
            {
                IdRol = rol.IdRol,
                CodigoInterno = rol.CodigoInterno,
                Nombre = rol.Nombre ?? "",
                Descripcion = rol.Descripcion,
                EstaActivo = rol.EstaActivo ?? true
            };
        }

        [HttpPost]
        public async Task<ActionResult<RolDto>> CrearRol([FromBody] RolDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.CodigoInterno))
                return BadRequest("El código interno es obligatorio.");
            if (string.IsNullOrWhiteSpace(dto.Nombre))
                return BadRequest("El nombre del rol es obligatorio.");

            var rol = new Rol
            {
                CodigoInterno = dto.CodigoInterno,
                Nombre = dto.Nombre,
                Descripcion = dto.Descripcion,
                EstaActivo = true,
                FechaCreacion = DateTime.Now,
                IdUsuarioCreacion = 1
            };

            _context.Rols.Add(rol);
            await _context.SaveChangesAsync();

            dto.IdRol = rol.IdRol;
            return CreatedAtAction(nameof(GetRol), new { id = rol.IdRol }, dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarRol(int id, [FromBody] RolDto dto)
        {
            var rol = await _context.Rols.FindAsync(id);
            if (rol == null) return NotFound();

            rol.CodigoInterno = dto.CodigoInterno;
            rol.Nombre = dto.Nombre;
            rol.Descripcion = dto.Descripcion;
            rol.EstaActivo = dto.EstaActivo ?? rol.EstaActivo;
            rol.FechaModificacion = DateTime.Now;
            rol.IdUsuarioModificacion = 1;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarRol(int id)
        {
            var rol = await _context.Rols.FindAsync(id);
            if (rol == null) return NotFound();

            rol.EstaActivo = false;
            rol.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
