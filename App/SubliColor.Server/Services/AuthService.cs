using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SubliColor.Server.Data;
using SubliColor.Server.Models;
using SubliColor.Server.Models.Auth;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;

namespace SubliColor.Server.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly JwtSettings _jwtSettings;
        private readonly EmailService _emailService;

        public AuthService(AppDbContext context, IOptions<JwtSettings> jwtSettings, EmailService emailService)
        {
            _context = context;
            _jwtSettings = jwtSettings.Value;
            _emailService = emailService;
        }

        // ================= LOGIN =================
        public Usuario? ValidarUsuario(string usuario, string clave)
        {
            var user = _context.Usuarios
                .FirstOrDefault(u =>
                    u.Usuario1 == usuario &&
                    u.EstaActivo == true &&
                    (u.EstaBloqueado == false || u.EstaBloqueado == null));

            if (user == null)
                return null;

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(clave, user.Clave);

            if (!isPasswordValid)
                return null;

            return user;
        }

        public List<string> ObtenerRoles(int idUsuario)
        {
            return _context.UsuarioRols
                .Where(ur => ur.IdUsuario == idUsuario && ur.EstaActivo == true)
                .Select(ur => ur.IdRolNavigation.Nombre)
                .ToList();
        }


        public string GenerarToken(Usuario user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Usuario1),
                new Claim("IdUsuario", user.IdUsuario.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _jwtSettings.Issuer,
                _jwtSettings.Audience,
                claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.DurationInMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // ================= RECUPERACIÓN =================
        public async Task<bool> SolicitarRecuperacionClave(string email)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == email && u.EstaActivo == true);

            if (usuario == null) return false;

            string tokenValue;
            bool exists;

            // Generar token único de 6 dígitos
            do
            {
                tokenValue = new Random().Next(100000, 999999).ToString(); // 6 dígitos
                exists = await _context.Tokens.AnyAsync(t =>
                    t.Token1 == tokenValue &&
                    t.EstaActivo == true &&
                    t.Usado == false &&
                    t.FechaExpiracion > DateTime.UtcNow
                );
            }
            while (exists);

            DateTime expiration = DateTime.UtcNow.AddMinutes(30);

            var token = new Token
            {
                IdUsuario = usuario.IdUsuario,
                Token1 = tokenValue,
                FechaExpiracion = expiration,
                Usado = false,
                EstaActivo = true,
                FechaCreacion = DateTime.UtcNow,
                IdUsuarioCreacion = usuario.IdUsuario
            };

            _context.Tokens.Add(token);
            await _context.SaveChangesAsync();

            string body = $"Tu token de recuperación es: {tokenValue}";

            await _emailService.EnviarCorreoAsync(usuario.Email, "Recuperación de contraseña", body);
            return true;
        }

        public async Task<bool> ResetearClaveAsync(string token, string nuevaClave)
        {
            var tokenBD = await _context.Tokens
                .FirstOrDefaultAsync(t => t.Token1 == token && t.Usado == false && t.FechaExpiracion > DateTime.UtcNow);

            if (tokenBD == null)
                return false;

            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.IdUsuario == tokenBD.IdUsuario);
            if (usuario == null)
                return false;

            usuario.Clave = BCrypt.Net.BCrypt.HashPassword(nuevaClave);

            tokenBD.Usado = true;
            tokenBD.FechaModificacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
