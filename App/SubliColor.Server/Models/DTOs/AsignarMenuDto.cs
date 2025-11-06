namespace SubliColor.Server.Models.DTOs
{
    public class AsignarMenuDto
    {
        public int IdRol { get; set; }
        public List<int> IdsMenus { get; set; } = new();
    }
}