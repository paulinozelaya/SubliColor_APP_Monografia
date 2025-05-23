namespace SubliColor.Server.Models
{
    public class LoginRequest
    {
        public string Usuario { get; set; }
        public string Contrasena { get; set; }
    }

    public class RecuperacionRequest
    {
        public string Usuario { get; set; }
    }

    public class RecuperacionCambioRequest
    {
        public string Usuario { get; set; }
        public string Pin { get; set; }
        public string NuevaContrasena { get; set; }
    }


}
