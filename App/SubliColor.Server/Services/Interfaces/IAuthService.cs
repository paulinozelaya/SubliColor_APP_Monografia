namespace SubliColor.Server.Services.Interfaces
{
    public interface IAuthService
    {
        string Login(string usuario, string contrasena, out string mensajeError);

        int GenerarPinRecuperacion(string usuario, out string pin, out string correo);

        void ValidarPinYActualizarContrasena(string usuario, string pin, string nuevaContrasena, out string mensajeError);
    }
}
