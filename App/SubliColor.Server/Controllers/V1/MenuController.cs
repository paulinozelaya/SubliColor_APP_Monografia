using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SubliColor.Server.Services.Interfaces;

namespace SubliColor.Server.Controllers.V1
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenuController : ControllerBase
    {
        private readonly IMenuService _menuService;

        public MenuController(IMenuService menuService)
        {
            _menuService = menuService;
        }

        [HttpGet("{usuarioId}")]
        public IActionResult ObtenerMenu(int usuarioId)
        {
            var menu = _menuService.ObtenerMenuPorUsuario(usuarioId);
            return Ok(menu);
        }
    }
}
