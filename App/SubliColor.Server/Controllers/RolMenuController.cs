using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SubliColor.Server.Data;
using SubliColor.Server.Models;
using SubliColor.Server.Models.DTOs;

namespace SubliColor.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolMenuController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RolMenuController(AppDbContext context)
        {
            _context = context;
        }

        // ================== GET TODOS ==================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RolMenuDto>>> GetRolMenus()
        {
            var rolMenus = await _context.RolMenus
                .Include(rm => rm.IdRolNavigation)
                .Include(rm => rm.IdMenuNavigation)
                .ToListAsync();

            return rolMenus.Select(MapToDto).ToList();
        }

        // ================== GET UNO ==================
        [HttpGet("{id}")]
        public async Task<ActionResult<RolMenuDto>> GetRolMenu(int id)
        {
            var rolMenu = await _context.RolMenus
                .Include(rm => rm.IdRolNavigation)
                .Include(rm => rm.IdMenuNavigation)
                .FirstOrDefaultAsync(rm => rm.IdRolMenu == id);

            if (rolMenu == null) return NotFound();

            return MapToDto(rolMenu);
        }

        // ================== POST ==================
        [HttpPost]
        public async Task<ActionResult<RolMenuDto>> CrearRolMenu([FromBody] CrearRolMenuDto dto)
        {
            var rolMenu = new RolMenu
            {
                IdRol = dto.IdRol,
                IdMenu = dto.IdMenu,
                EstaActivo = true,
                FechaCreacion = DateTime.UtcNow
            };

            _context.RolMenus.Add(rolMenu);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRolMenu), new { id = rolMenu.IdRolMenu }, MapToDto(rolMenu));
        }

        // ================== DELETE ==================
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarRolMenu(int id)
        {
            var rolMenu = await _context.RolMenus.FindAsync(id);
            if (rolMenu == null) return NotFound();

            rolMenu.EstaActivo = false;
            rolMenu.FechaModificacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ================== MAPPER ==================
        private RolMenuDto MapToDto(RolMenu rm) =>
            new RolMenuDto
            {
                IdRolMenu = rm.IdRolMenu,
                IdRol = (int)rm.IdRol,
                NombreRol = rm.IdRolNavigation?.Nombre,
                IdMenu = (int)rm.IdMenu,
                NombreMenu = rm.IdMenuNavigation?.Nombre,
                EstaActivo = rm.EstaActivo ?? false
            };
    }
}
