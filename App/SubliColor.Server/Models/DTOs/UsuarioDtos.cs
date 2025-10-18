namespace SubliColor.Server.Models.DTOs
{
    public class UsuarioDto
    {
        public int IdUsuario { get; set; }
        public string Usuario { get; set; } = "";
        public string Email { get; set; } = "";
        public int? IdPersona { get; set; }
        public string NombrePersona { get; set; } = "";
        public List<string> Roles { get; set; } = new();
        public List<int> RolesIds { get; set; } = new();
        public bool EstaActivo { get; set; }
    }

    public class CrearUsuarioDto
    {
        public string Usuario { get; set; } = "";
        public string Email { get; set; } = "";
        public string Clave { get; set; } = "";
        public int IdPersona { get; set; }
        public List<int> Roles { get; set; } = new();
    }
}
