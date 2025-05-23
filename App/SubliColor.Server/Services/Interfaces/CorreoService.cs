using RestSharp;
using RestSharp.Authenticators;
using SubliColor.Server.Services.Interfaces;

namespace SubliColor.Server.Services
{
    public class CorreoService : ICorreoService
    {
        private readonly IConfiguration _configuration;

        public CorreoService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public bool EnviarCorreo(string destinatario, string asunto, string cuerpoHtml, out string error)
        {
            error = null;

            try
            {
                var apiKey = _configuration["Mailgun:ApiKey"];
                var domain = _configuration["Mailgun:Domain"];
                var remitente = _configuration["Mailgun:Remitente"];

                var options = new RestClientOptions("https://api.mailgun.net")
                {
                    Authenticator = new HttpBasicAuthenticator("api", apiKey)
                };

                var client = new RestClient(options);
                var request = new RestRequest($"/v3/{domain}/messages", Method.Post);
                request.AlwaysMultipartFormData = true;

                request.AddParameter("from", remitente);      // Debe coincidir con el remitente del sandbox
                request.AddParameter("to", destinatario);      // Debe ser un correo verificado en el sandbox
                request.AddParameter("subject", asunto);
                request.AddParameter("html", cuerpoHtml);

                var response = client.Execute(request);
                if (!response.IsSuccessful)
                {
                    error = $"Mailgun error: {response.StatusCode} - {response.Content}";
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                error = ex.Message;
                return false;
            }
        }


        public bool EnviarCodigoRecuperacion(string correo, string pin)
        {
            var error = String.Empty;
            return EnviarCorreo(correo, "Notificacion de PIN", $"Pin temporal: {pin}", out error);
        }
    }
}
