namespace SubliColor.Server.Repositories.Interfaces
{
    public interface IAuditoriaHelper
    {
        string? ObtenerIP();
        string? ObtenerDispositivo();
        string ObtenerUbicacion();
    }
}
