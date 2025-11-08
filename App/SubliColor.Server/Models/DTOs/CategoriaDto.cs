namespace SubliColor.Server.Models.DTOs
{
    public class CategoriaDto
    {
        public int? IdCategoria { get; set; }
        public string CodigoInterno { get; set; } = "";
        public string Nombre { get; set; } = "";
        public string? Descripcion { get; set; }
        public bool? EstaActivo { get; set; }
    }
}