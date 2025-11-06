namespace SubliColor.Server.Models.DTOs
{
    public class MenuDto
    {
        public int IdMenu { get; set; }
        public int? IdMenuPadre { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string CodigoInterno { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string Icono { get; set; } = "pi pi-fw pi-folder"; // default icono
        public List<MenuDto> SubMenus { get; set; } = new();
    }
}
