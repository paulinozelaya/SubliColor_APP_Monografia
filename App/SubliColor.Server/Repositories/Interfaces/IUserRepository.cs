namespace SubliColor.Server.Repositories.Interfaces
{
    public interface IUserRepository
    {
        /// <summary>
        /// Ejecuta el SP para validar usuario y devuelve código resultado.
        /// 0 = éxito, 1 = usuario no existe, 2 = bloqueado, 3 = pass incorrecta, 4 = inactivo.
        /// </summary>
        int ValidarCredenciales(string usuario, string contrasena, string ip, string dispostivo, string ubicacion);

        int GenerarPinRecuperacion(string usuario, out string pin, out string correo);

        void ValidarPinRecuperacion(string usuario, string pin, out bool esValido, out int idusuario);

        bool ActualizarContrasena(int idUsuario, string nuevaContrasena, string pin);

        int ObtenerRolIdPorUsuario(int usuarioId);
    }
}
