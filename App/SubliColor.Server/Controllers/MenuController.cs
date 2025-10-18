using Microsoft.AspNetCore.Mvc;
using SubliColor.Server.Data;
using SubliColor.Server.Models;
using SubliColor.Server.Models.DTOs;

[ApiController]
[Route("api/[controller]")]
public class MenuController : ControllerBase
{
    private readonly AppDbContext _context;

    public MenuController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("usuario/{idUsuario}")]
    public IActionResult ObtenerMenuPorUsuario(int idUsuario)
    {
        var menus = _context.UsuarioRols
            .Where(ur => ur.IdUsuario == idUsuario && ur.EstaActivo == true)
            .SelectMany(ur => ur.IdRolNavigation.RolMenus)
            .Where(rm => rm.EstaActivo == true)
            .Select(rm => rm.IdMenuNavigation)
            .Distinct()
            .ToList();

        return Ok(menus);
    }

    [HttpGet("usuario/{idUsuario}/jerarquia")]
    public IActionResult ObtenerMenuJerarquico(int idUsuario)
    {
        var menus = _context.UsuarioRols
            .Where(ur => ur.IdUsuario == idUsuario && ur.EstaActivo == true)
            .SelectMany(ur => ur.IdRolNavigation.RolMenus)
            .Where(rm => rm.EstaActivo == true)
            .Select(rm => rm.IdMenuNavigation)
            .Distinct()
            .ToList();

        var rootMenus = menus
            .Where(m => m.IdMenuPadre == null)
            .Select(m => MapToDto(m, menus))
            .ToList();

        return Ok(rootMenus);
    }

    private MenuDto MapToDto(Menu menu, List<Menu> allMenus)
    {
        return new MenuDto
        {
            IdMenu = menu.IdMenu,
            Nombre = menu.Nombre ?? "",
            CodigoInterno = menu.CodigoInterno ?? "",
            Url = "/" + (menu.CodigoInterno ?? "").ToLower(),
            Icono = menu?.Icono ?? "pi pi-fw pi-folder",
            SubMenus = allMenus
                .Where(sm => sm.IdMenuPadre == menu.IdMenu)
                .Select(sm => MapToDto(sm, allMenus))
                .ToList()
        };
    }
}