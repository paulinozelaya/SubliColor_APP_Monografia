using Microsoft.Data.SqlClient;
using SubliColor.Server.Repositories.Interfaces;
using System.Data;
using System.Net.NetworkInformation;

namespace SubliColor.Server.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly string _connectionString;

        public UserRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public int ValidarCredenciales(string usuario, string contrasena, string ip, string dispositivo, string ubicacion)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("Seguridad.prIniciarSesion", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@NombreUsuario", usuario);
            cmd.Parameters.AddWithValue("@Contrasena", contrasena);
            cmd.Parameters.AddWithValue("@DireccionIP", (object)ip ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Dispositivo", (object)dispositivo ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Ubicacion", (object)ubicacion ?? DBNull.Value);
            var resultadoParam = new SqlParameter("@Resultado", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            cmd.Parameters.Add(resultadoParam);

            conn.Open();
            cmd.ExecuteNonQuery();

            return (Int32)resultadoParam.Value;
        }

        public int GenerarPinRecuperacion(string usuario, out string pin, out string correo)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("[Seguridad].[prGenerarTokenRecuperacion]", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            // Parámetro de entrada
            cmd.Parameters.AddWithValue("@NombreUsuario", usuario);

            var resultadoPin = new SqlParameter("@PinTemporal", SqlDbType.NVarChar, 32)
            {
                Direction = ParameterDirection.Output
            };
            cmd.Parameters.Add(resultadoPin);

            var resultadoCorreo = new SqlParameter("@Correo", SqlDbType.NVarChar, 32)
            {
                Direction = ParameterDirection.Output
            };
            cmd.Parameters.Add(resultadoCorreo);

            var resultadoParam = new SqlParameter("@Resultado", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            cmd.Parameters.Add(resultadoParam);

            conn.Open();
            cmd.ExecuteNonQuery();

            pin = resultadoPin.Value?.ToString() ?? string.Empty;
            correo = resultadoCorreo.Value?.ToString() ?? string.Empty;
            return (int)resultadoParam.Value;
        }

        public void ValidarPinRecuperacion(string usuario, string pin, out bool esValido, out int idusuario)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("[Seguridad].[prValidarTokenRecuperacion]", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@PinTemporal", pin);

            var resultadoPin = new SqlParameter("@EsValido", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            cmd.Parameters.Add(resultadoPin);

            var resultadoUsuario = new SqlParameter("@UsuarioId", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            cmd.Parameters.Add(resultadoUsuario);

            conn.Open();
            cmd.ExecuteNonQuery();

            esValido = resultadoPin.Value != DBNull.Value && Convert.ToInt32(resultadoPin.Value) == 1;
            idusuario = resultadoUsuario.Value != DBNull.Value ? Convert.ToInt32(resultadoUsuario.Value) : 0;
        }


        public bool ActualizarContrasena(int idUsuario, string nuevaContrasena, string pin)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("[Seguridad].[prActualizarContrasena]", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@UsuarioId", idUsuario);
            cmd.Parameters.AddWithValue("@NuevaContrasena", nuevaContrasena);
            cmd.Parameters.AddWithValue("@PinTemporal", pin);

            var resultadoParam = new SqlParameter("@Resultado", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            cmd.Parameters.Add(resultadoParam);

            conn.Open();
            cmd.ExecuteNonQuery();

            return Convert.ToInt32(resultadoParam.Value) == 1;
        }
        public int ObtenerRolIdPorUsuario(int usuarioId)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("Seguridad.prObtenerRolPorUsuario", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UsuarioId", usuarioId);

            conn.Open();
            var result = cmd.ExecuteScalar();

            if (result != null && result != DBNull.Value)
                return Convert.ToInt32(result);

            throw new Exception("No se encontró un rol activo para el usuario especificado.");
        }

    }
}
