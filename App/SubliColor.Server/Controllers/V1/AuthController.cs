using Microsoft.AspNetCore.Mvc;
using SubliColor.Server.Models;
using SubliColor.Server.Services.Interfaces;

namespace SubliColor.Server.Controllers.V1
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ICorreoService _correoService;

        public AuthController(IAuthService authService, ICorreoService correoService)
        {
            _authService = authService;
            _correoService = correoService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            if (loginRequest == null || string.IsNullOrWhiteSpace(loginRequest.Usuario) || string.IsNullOrWhiteSpace(loginRequest.Contrasena))
                return BadRequest(new { mensaje = "Usuario y contraseña son requeridos." });

            var token = _authService.Login(loginRequest.Usuario, loginRequest.Contrasena, out string mensajeError);

            if (token == null)
                return Unauthorized(new { mensaje = mensajeError });

            return Ok(new { token });
        }

        [HttpPost("recuperar")]
        public IActionResult GenerarPinRecuperacion([FromBody] RecuperacionRequest model)
        {
            var resultado = _authService.GenerarPinRecuperacion(model.Usuario, out string pin, out string correo);

            if (resultado != 0)
                return BadRequest(new { mensaje = "Error" });

            var envioExitoso = _correoService.EnviarCodigoRecuperacion(correo, pin);

            if (envioExitoso)
                return Ok(new { mensaje = "Se ha enviado un código de recuperación a tu correo." });
            else
                return BadRequest(new { mensaje = "Ha ocurrido un error al enviar el correo" });
        }

        [HttpPost("cambiarcontrasena")]
        public IActionResult ValidarPinYActualizar([FromBody] RecuperacionCambioRequest model)
        {
            _authService.ValidarPinYActualizarContrasena(model.Usuario, model.Pin, model.NuevaContrasena, out string error);

            return Ok(new { mensaje = error });
        }

    }
}