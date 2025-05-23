USE SubliColorBD1
GO

-- Procedimiento 3: Actualizar contraseña
CREATE OR ALTER PROCEDURE [Seguridad].[prActualizarContrasena]
    @UsuarioId INT,
    @NuevaContrasena NVARCHAR(255),
    @PinTemporal NVARCHAR(10),
    @Resultado INT OUTPUT -- 0 = ok, 1 = token inválido o expirado
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @FechaGeneracion DATETIME;

    SELECT TOP 1 @FechaGeneracion = FechaGeneracion
    FROM Seguridad.RecuperacionContrasena
    WHERE UsuarioId = @UsuarioId AND PinTemporal = @PinTemporal AND Usado = 0
    ORDER BY FechaGeneracion DESC;

    IF @FechaGeneracion IS NULL OR DATEDIFF(MINUTE, @FechaGeneracion, GETDATE()) > 30
    BEGIN
        SET @Resultado = 0;
        RETURN;
    END

    UPDATE Seguridad.Usuario
    SET ContrasenaHash = @NuevaContrasena,
        FechaModificacion = GETDATE(),
        IntentosFallidos = 0,
        EstaBloqueado = 0,
        FechaBloqueo = NULL
    WHERE UsuarioId = @UsuarioId;

    -- Marcar token como usado
    UPDATE Seguridad.RecuperacionContrasena
    SET Usado = 1,
        FechaExpiracion = GETDATE()
    WHERE UsuarioId = @UsuarioId AND PinTemporal = @PinTemporal;

    -- Guardar en historial
    INSERT INTO Seguridad.HistorialContrasena (UsuarioId, ContrasenaHash, FechaCambio)
    VALUES (@UsuarioId, @NuevaContrasena, GETDATE());

    SET @Resultado = 1;
END