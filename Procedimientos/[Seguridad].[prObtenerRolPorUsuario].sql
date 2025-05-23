CREATE PROCEDURE [Seguridad].[prObtenerRolPorUsuario]
    @UsuarioId INT
AS
BEGIN
    SELECT TOP 1 RolId
    FROM Seguridad.UsuarioRol
    WHERE UsuarioId = @UsuarioId AND EstaActivo = 1
END
