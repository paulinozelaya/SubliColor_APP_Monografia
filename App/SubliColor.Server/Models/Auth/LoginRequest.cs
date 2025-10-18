namespace SubliColor.Server.Models.Auth
{
    public class LoginRequest
    {
        public string Usuario { get; set; } = null!;
        public string Clave { get; set; } = null!;
    }
}
