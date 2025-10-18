namespace SubliColor.Server.Models.DTOs
{
    public class RolMenuDto
    {
        public int IdRolMenu { get; set; }
        public int IdRol { get; set; }
        public string NombreRol { get; set; }
        public int IdMenu { get; set; }
        public string NombreMenu { get; set; }
        public bool EstaActivo { get; set; }
    }

    public class CrearRolMenuDto
    {
        public int IdRol { get; set; }
        public int IdMenu { get; set; }
    }
}
