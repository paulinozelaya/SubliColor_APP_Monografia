using SubliColor.Server.Models;
using SubliColor.Server.Repositories.Interfaces;
using SubliColor.Server.Services.Interfaces;

namespace SubliColor.Server.Services
{
    public class MenuService : IMenuService
    {
        private readonly IMenuRepository _menuRepo;
        private readonly IUserRepository _userRepo;

        public MenuService(IMenuRepository menuRepo, IUserRepository userRepo)
        {
            _menuRepo = menuRepo;
            _userRepo = userRepo;
        }

        public List<MenuModel> ObtenerMenuPorUsuario(int usuarioId)
        {
            int rolId = _userRepo.ObtenerRolIdPorUsuario(usuarioId);
            return _menuRepo.ObtenerMenusPorRol(rolId);
        }
    }
}
