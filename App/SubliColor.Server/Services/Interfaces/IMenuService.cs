using SubliColor.Server.Models;

namespace SubliColor.Server.Services.Interfaces
{
    public interface IMenuService
    {
        List<MenuModel> ObtenerMenuPorUsuario(int usuarioId);
    }
}
