namespace SubliColor.Server.Models.DTOs
{
    public class ClienteDto
    {
        public int IdCliente { get; set; }
        public int? IdPersona { get; set; }
        public string? NombrePersona { get; set; }
        public bool EstaActivo { get; set; }
    }

    public class CrearClienteDto
    {
        public int IdPersona { get; set; }
    }
}
