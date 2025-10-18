namespace SubliColor.Server.Models.Auth
{
    public class ResetPasswordRequest
    {
        public string Token { get; set; } = null!;
        public string NuevaClave { get; set; } = null!;
    }
}
