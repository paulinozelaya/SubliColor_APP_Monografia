namespace SubliColor.Server.Services.Interfaces
{
    public interface ICorreoService
    {
        bool EnviarCorreo(string destinatario, string asunto, string cuerpoHtml, out string error);

        bool EnviarCodigoRecuperacion(string correo, string pin);
    }
}
