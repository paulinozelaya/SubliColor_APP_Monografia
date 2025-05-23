namespace SubliColor.Server.Models
{
    public class MenuModel
    {
        public int MenuId { get; set; }
        public string Nombre { get; set; }
        public string Ruta { get; set; }

        public int? PadreMenuId { get; set; }
        public List<MenuModel> SubMenus { get; set; } = new();
    }

}
