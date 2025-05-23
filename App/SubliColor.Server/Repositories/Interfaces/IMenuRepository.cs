using SubliColor.Server.Models;

namespace SubliColor.Server.Repositories.Interfaces
{
    public interface IMenuRepository
    {
        List<MenuModel> ObtenerMenusPorRol(int rolId);
    }
}
