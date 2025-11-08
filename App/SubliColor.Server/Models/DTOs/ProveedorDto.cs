namespace SubliColor.Server.Models.DTOs
{
    public class ProveedorDto
    {
        public int? IdProveedor { get; set; }
        public string NombreProveedor { get; set; } = "";
        public string? RUC { get; set; }
        public string? Telefono { get; set; }
        public string? Correo { get; set; }
        public string? Direccion { get; set; }
        public bool? EstaActivo { get; set; }
    }
}