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

        // GET: api/RolMenu/menus
        //[HttpGet("menus")]
        [HttpGet]
        public async Task<IActionResult> GetMenus()
        {
            var menus = await _context.Menus
                .Where(m => m.EstaActivo == true)
                .Select(m => new MenuDto
                {
                    IdMenu = m.IdMenu,
                    Nombre = m.Nombre ?? "",
                    IdMenuPadre = m.IdMenuPadre,
                    Icono = m.Icono ?? "pi pi-folder"
                })
                .ToListAsync();

            var menuJerarquico = menus
                .Where(m => m.IdMenuPadre == null)
                .Select(m => MapToDto(m, menus))
                .ToList();

            return Ok(menuJerarquico);
        }

        private MenuDto MapToDto(MenuDto menu, List<MenuDto> allMenus)
        {
            return new MenuDto
            {
                IdMenu = menu.IdMenu,
                Nombre = menu.Nombre,
                IdMenuPadre = menu.IdMenuPadre,
                Icono = menu.Icono,
                SubMenus = allMenus
                    .Where(sm => sm.IdMenuPadre == menu.IdMenu)
                    .Select(sm => MapToDto(sm, allMenus))
                    .ToList()
            };
        }

        // GET: api/RolMenu/{idRol}
        [HttpGet("{idRol}")]
        public async Task<IActionResult> GetMenusPorRol(int idRol)
        {
            var ids = await _context.RolMenus
                .Where(rm => rm.IdRol == idRol && rm.EstaActivo == true)
                .Select(rm => rm.IdMenu)
                .ToListAsync();

            return Ok(ids);
        }

        // POST: api/RolMenu/asignar
        //[HttpPost("asignar")]
        [HttpPost]
        public async Task<IActionResult> AsignarMenus([FromBody] AsignarMenuDto dto)
        {
            if (dto == null)
                return BadRequest("El cuerpo de la solicitud es requerido.");

            var existentes = await _context.RolMenus
                .Where(rm => rm.IdRol == dto.IdRol)
                .ToListAsync();

            _context.RolMenus.RemoveRange(existentes);

            foreach (var idMenu in dto.IdsMenus)
            {
                _context.RolMenus.Add(new RolMenu
                {
                    IdRol = dto.IdRol,
                    IdMenu = idMenu,
                    EstaActivo = true,
                    FechaCreacion = DateTime.Now
                });
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Menús asignados correctamente" });
        }

    }
}
