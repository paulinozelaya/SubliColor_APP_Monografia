using SubliColor.Server.Repositories.Interfaces;
using UAParser;

namespace SubliColor.Server.Helpers
{
    public class AuditoriaHelper : IAuditoriaHelper
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuditoriaHelper(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string? ObtenerIP()
        {
            var context = _httpContextAccessor.HttpContext;

            var ip = context?.Request?.Headers["X-Forwarded-For"].FirstOrDefault();

            if (string.IsNullOrEmpty(ip))
                ip = context?.Connection?.RemoteIpAddress?.ToString();

            return ip;
        }

        public string ObtenerDispositivo()
        {
            var ua = _httpContextAccessor.HttpContext?.Request?.Headers["User-Agent"].ToString();
            if (ua == null) return "Desconocido";

            var parser = Parser.GetDefault();
            var clientInfo = parser.Parse(ua);

            return $"{clientInfo.OS} - {clientInfo.UA}";
        }

        public string ObtenerUbicacion()
        {
            // Implementar geolocalización más adelante (API externa por IP)
            return "Desconocida";
        }
    }
}
