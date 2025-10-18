using Microsoft.Extensions.Options;
using Resend;
using SubliColor.Server.Models.Auth;

namespace SubliColor.Server.Services
{
    public class EmailService
    {
        private readonly SmtpSettings _smtpSettings;

        public EmailService(IOptions<SmtpSettings> smtpSettings)
        {
            _smtpSettings = smtpSettings.Value;
        }

        public async Task EnviarCorreoAsync(string destino, string asunto, string cuerpo)
        {
            var apiKey = _smtpSettings.ApiKey;
            var remitente = _smtpSettings.Remitente;
            var resend = ResendClient.Create(apiKey);

            var email = new EmailMessage()
            {
                From = remitente,
                To = destino,
                Subject = asunto,
                HtmlBody = cuerpo
            };

            var response = await resend.EmailSendAsync(email);
        }
    }
}