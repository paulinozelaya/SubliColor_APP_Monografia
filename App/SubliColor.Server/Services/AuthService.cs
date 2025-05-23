using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using SubliColor.Server.Services.Interfaces;
using SubliColor.Server.Repositories.Interfaces;
using SubliColor.Server.Helpers;
using Microsoft.Extensions.Configuration.UserSecrets;

namespace Sublicolor.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _usuarioRepository;
        private readonly IAuditoriaHelper _auditoriaHelper;
        private readonly string _jwtSecret;

        public AuthService(IUserRepository usuarioRepository, IConfiguration configuration, IAuditoriaHelper auditoriaHelper)
        {
            _usuarioRepository = usuarioRepository;
            _jwtSecret = configuration["Jwt:Secret"] ?? throw new Exception("JWT Secret no configurado");
            _auditoriaHelper = auditoriaHelper;
        }

        public string Login(string usuario, string contrasena, out string mensajeError)
        {
            mensajeError = null;
            var ip = _auditoriaHelper.ObtenerIP();
            var dispositivo = _auditoriaHelper.ObtenerDispositivo();
            var ubicacion = _auditoriaHelper.ObtenerUbicacion();
            var resultado = _usuarioRepository.ValidarCredenciales(usuario, contrasena, ip, dispositivo, ubicacion);

            switch (resultado)
            {
                case 0: // éxito
                    return GenerarToken(usuario);
                case 1:
                    mensajeError = "Usuario no encontrado.";
                    break;
                case 2:
                    mensajeError = "Usuario bloqueado.";
                    break;
                case 3:
                    mensajeError = "Contraseña incorrecta.";
                    break;
                case 4:
                    mensajeError = "Usuario inactivo.";
                    break;
                default:
                    mensajeError = "Error desconocido.";
                    break;
            }

            return null;
        }

        private string GenerarToken(string usuario)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSecret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] {
                    new Claim(ClaimTypes.Name, usuario)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public int GenerarPinRecuperacion(string usuario, out string? pin, out string correo)
        {
            pin = null;
            return _usuarioRepository.GenerarPinRecuperacion(usuario, out pin, out correo);
        }

        public void ValidarPinYActualizarContrasena(string usuario, string pin, string nuevaContrasena, out string mensajeError)
        {
            mensajeError = "Cambio correcto de contraseña.";
            int idUsuario = 0;
            bool esValido = false;

            _usuarioRepository.ValidarPinRecuperacion(usuario, pin, out esValido, out idUsuario);

            if (!esValido)
            {
                mensajeError = "El PIN es inválido o ha expirado.";
                return;
            }

            bool actualizado = _usuarioRepository.ActualizarContrasena(idUsuario, nuevaContrasena, pin);

            if (!actualizado)
            {
                mensajeError = "Ocurrió un error al actualizar la contraseña.";
            }
        }
    }
}