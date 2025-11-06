namespace SubliColor.Server.Models.DTOs
{
    public class RolDto
    {
        public int IdRol { get; set; }
        public string CodigoInterno { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public bool? EstaActivo { get; set; }
    }

    public class CrearRolDto
    {
        public string CodigoInterno { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
    }

    public class ActualizarRolDto : CrearRolDto
    {
        public int IdRol { get; set; }
    }
}
