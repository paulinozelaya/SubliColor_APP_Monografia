namespace SubliColor.Server.Models.Auth
{
    public class SmtpSettings
    {
        public string Host { get; set; } = null!;
        public int Port { get; set; }
        public string User { get; set; } = null!;
        public string Pass { get; set; } = null!;
        public string From { get; set; } = null!;

        public string ApiKey { get; set; } = null!;

        public string Remitente { get; set; } = null!;
    }
}
