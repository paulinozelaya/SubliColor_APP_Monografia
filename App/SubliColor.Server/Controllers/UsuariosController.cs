using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SubliColor.Server.Data;
using SubliColor.Server.Models;
using SubliColor.Server.Models.DTOs;

namespace SubliColor.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Usuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioDto>>> GetUsuarios()
        {
            var usuarios = await _context.Usuarios
                .Include(u => u.IdPersonaNavigation)
                .Include(u => u.UsuarioRols).ThenInclude(ur => ur.IdRolNavigation)
                .ToListAsync();

            return usuarios.Select(u => new UsuarioDto
            {
                IdUsuario = u.IdUsuario,
                Usuario = u.Usuario1,
                Email = u.Email,
                IdPersona = u.IdPersona,
                NombrePersona = $"{u.IdPersonaNavigation?.PrimerNombre} {u.IdPersonaNavigation?.PrimerApellido}",
                Roles = u.UsuarioRols.Select(r => r.IdRolNavigation?.Nombre ?? "").ToList(),
                RolesIds = u.UsuarioRols.Select(r => r.IdRolNavigation.IdRol).ToList(),
                EstaActivo = u.EstaActivo ?? true
            }).ToList();
        }

        // GET: api/Usuarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UsuarioDto>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.IdPersonaNavigation)
                .Include(u => u.UsuarioRols).ThenInclude(ur => ur.IdRolNavigation)
                .FirstOrDefaultAsync(u => u.IdUsuario == id);

            if (usuario == null) return NotFound();

            return new UsuarioDto
            {
                IdUsuario = usuario.IdUsuario,
                Usuario = usuario.Usuario1,
                Email = usuario.Email,
                IdPersona = usuario.IdPersona,
                NombrePersona = $"{usuario.IdPersonaNavigation?.PrimerNombre} {usuario.IdPersonaNavigation?.PrimerApellido}",
                Roles = usuario.UsuarioRols.Select(r => r.IdRolNavigation?.Nombre ?? "").ToList(),
                RolesIds = usuario.UsuarioRols.Select(r => r.IdRolNavigation.IdRol).ToList(),
                EstaActivo = usuario.EstaActivo ?? true
            };
        }

        // POST: api/Usuarios
        [HttpPost]
        public async Task<ActionResult<UsuarioDto>> CrearUsuario([FromBody] CrearUsuarioDto dto)
        {
            var usuario = new Usuario
            {
                Usuario1 = dto.Usuario,
                Email = dto.Email,
                Clave = BCrypt.Net.BCrypt.HashPassword(dto.Clave),
                IdPersona = dto.IdPersona,
                EstaActivo = true,
                FechaCreacion = DateTime.UtcNow
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            foreach (var rolId in dto.Roles)
            {
                _context.UsuarioRols.Add(new UsuarioRol
                {
                    IdUsuario = usuario.IdUsuario,
                    IdRol = rolId,
                    EstaActivo = true,
                    FechaCreacion = DateTime.UtcNow
                });
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUsuario), new { id = usuario.IdUsuario }, new UsuarioDto
            {
                IdUsuario = usuario.IdUsuario,
                Usuario = usuario.Usuario1,
                Email = usuario.Email,
                NombrePersona = _context.Personas.Find(dto.IdPersona)?.PrimerNombre,
                Roles = dto.Roles.Select(r => _context.Rols.Find(r)?.Nombre ?? "").ToList(),
                EstaActivo = true
            });
        }

        // PUT: api/Usuarios/5
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarUsuario(int id, [FromBody] CrearUsuarioDto dto)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.UsuarioRols)
                .FirstOrDefaultAsync(u => u.IdUsuario == id);

            if (usuario == null) return NotFound();

            usuario.Usuario1 = dto.Usuario;
            usuario.Email = dto.Email;
            usuario.IdPersona = dto.IdPersona;
            usuario.FechaModificacion = DateTime.UtcNow;
            usuario.Clave = dto.Clave;

            // Actualizar roles
            usuario.UsuarioRols.Clear();
            foreach (var rolId in dto.Roles)
            {
                usuario.UsuarioRols.Add(new UsuarioRol
                {
                    IdUsuario = usuario.IdUsuario,
                    IdRol = rolId,
                    EstaActivo = true,
                    FechaCreacion = DateTime.UtcNow
                });
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE lógico
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null) return NotFound();

            usuario.EstaActivo = false;
            usuario.FechaModificacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}