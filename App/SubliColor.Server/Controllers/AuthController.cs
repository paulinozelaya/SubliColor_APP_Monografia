using Microsoft.AspNetCore.Mvc;
using SubliColor.Server.Models;
using SubliColor.Server.Services;
using SubliColor.Server.Data;
using SubliColor.Server.Models.Auth;

namespace SubliColor.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly AppDbContext _context;

        public AuthController(AuthService authService, AppDbContext context)
        {
            _authService = authService;
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var usuario = _authService.ValidarUsuario(request.Usuario, request.Clave);
            if (usuario == null)
            {
                // Registrar intento fallido
                _context.AuditoriaInicioSesions.Add(new AuditoriaInicioSesion
                {
                    IdUsuario = null,
                    Exitoso = false,
                    FechaInicio = DateTime.Now,
                    DireccionIP = HttpContext.Connection.RemoteIpAddress?.ToString(),
                    Dispositivo = "Web",
                    Ubicacion = "Desconocido"
                });
                _context.SaveChanges();

                return Unauthorized("Credenciales inválidas.");
            }

            // Generar token
            var token = _authService.GenerarToken(usuario);

            // Registrar inicio de sesión exitoso
            _context.AuditoriaInicioSesions.Add(new AuditoriaInicioSesion
            {
                IdUsuario = usuario.IdUsuario,
                Exitoso = true,
                FechaInicio = DateTime.Now,
                DireccionIP = HttpContext.Connection.RemoteIpAddress?.ToString(),
                Dispositivo = "Web",
                Ubicacion = "Desconocido"
            });
            _context.SaveChanges();

            return Ok(new
            {
                token,
                usuario = new
                {
                    usuario.IdUsuario,
                    usuario.Usuario1,
                    usuario.Email,
                    Roles = _authService.ObtenerRoles(usuario.IdUsuario)
                }
            });
        }

        [HttpPost("recuperar")]
        public async Task<IActionResult> RecuperarClave([FromBody] RecuperarPasswordRequest request)
        {
            bool enviado = await _authService.SolicitarRecuperacionClave(request.Email);
            if (!enviado)
                return NotFound("Usuario no encontrado o no activo.");

            return Ok("Correo de recuperación enviado.");
        }

        [HttpPost("resetear")]
        public async Task<IActionResult> ResetearClave([FromBody] ResetPasswordRequest request)
        {
            bool resultado = await _authService.ResetearClaveAsync(request.Token, request.NuevaClave);

            if (!resultado)
                return BadRequest("Token inválido, expirado o usuario no encontrado.");

            return Ok("Contraseña actualizada correctamente.");
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Si usas JWT puro (stateless), el "logout" es solo a nivel frontend:
            // eliminar token del localStorage/sessionStorage en React.
            // Opcionalmente puedes registrar el evento en AuditoriaInicioSesion.

            _context.AuditoriaInicioSesions.Add(new AuditoriaInicioSesion
            {
                IdUsuario = null, // O el IdUsuario si quieres ligarlo
                Exitoso = true,
                FechaInicio = DateTime.Now,
                FechaFin = DateTime.Now,
                DireccionIP = HttpContext.Connection.RemoteIpAddress?.ToString(),
                Dispositivo = "Web",
                Ubicacion = "Logout manual"
            });
            _context.SaveChanges();

            return Ok("Sesión cerrada correctamente.");
        }
    }
}
