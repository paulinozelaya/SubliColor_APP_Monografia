using Microsoft.Data.SqlClient;
using SubliColor.Server.Models;
using SubliColor.Server.Repositories.Interfaces;
using System.Data;

namespace SubliColor.Server.Repositories
{
    public class MenuRepository : IMenuRepository
    {
        private readonly string _connectionString;

        public MenuRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public List<MenuModel> ObtenerMenusPorRol(int rolId)
        {
            var menuFlat = new List<MenuModel>();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("Seguridad.prObtenerMenuPorRol", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@RolId", rolId);

            conn.Open();
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                menuFlat.Add(new MenuModel
                {
                    MenuId = (int)reader["MenuId"],
                    Nombre = reader["Nombre"].ToString(),
                    Ruta = reader["Ruta"] as string,
                    SubMenus = new List<MenuModel>(),
                    PadreMenuId = reader["PadreMenuId"] == DBNull.Value ? null : (int?)reader["PadreMenuId"]
                });
            }   

            var menuDict = menuFlat.ToDictionary(m => m.MenuId);
            var menuFinal = new List<MenuModel>();

            foreach (var menu in menuFlat)
            {
                if (menu.PadreMenuId.HasValue && menuDict.ContainsKey(menu.PadreMenuId.Value))
                    menuDict[menu.PadreMenuId.Value].SubMenus.Add(menu);
                else
                    menuFinal.Add(menu);
            }

            return menuFinal;
        }
    }

}
