namespace SubliColor.Server.Models.DTOs
{
    public class RolAccionDto
    {
        public int IdRolAccion { get; set; }
        public int IdRol { get; set; }
        public string NombreRol { get; set; }
        public int IdAccion { get; set; }
        public string NombreAccion { get; set; }
        public bool EstaActivo { get; set; }
    }

    public class CrearRolAccionDto
    {
        public int IdRol { get; set; }
        public int IdAccion { get; set; }
    }
}
