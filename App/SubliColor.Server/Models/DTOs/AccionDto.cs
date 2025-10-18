namespace SubliColor.Server.Models.DTOs
{
    public class AccionDto
    {
        public int IdAccion { get; set; }
        public string CodigoInterno { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public bool EstaActivo { get; set; }
    }

    public class CrearAccionDto
    {
        public string CodigoInterno { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
    }

    public class ActualizarAccionDto : CrearAccionDto
    {
        public int IdAccion { get; set; }
    }
}
