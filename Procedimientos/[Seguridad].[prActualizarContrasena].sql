USE SubliColorBD2;
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

    SELECT TOP 1
           @FechaGeneracion = FechaCreacion
    FROM Seguridad.Token
    WHERE IdUsuario = @UsuarioId
          AND Token = @PinTemporal
          AND Usado = 0
    ORDER BY FechaCreacion DESC;

    IF @FechaGeneracion IS NULL
       OR DATEDIFF(MINUTE, @FechaGeneracion, GETDATE()) > 30
    BEGIN
        SET @Resultado = 0;
        RETURN;
    END;

    UPDATE Seguridad.Usuario
    SET Clave = @NuevaContrasena,
        FechaModificacion = GETDATE(),
        IntentosFallidos = 0,
        EstaBloqueado = 0,
        FechaBloqueo = NULL
    WHERE IdUsuario = @UsuarioId;

    -- Marcar token como usado
    UPDATE Seguridad.Token
    SET Usado = 1,
        FechaExpiracion = GETDATE()
    WHERE IdUsuario = @UsuarioId
          AND Token = @PinTemporal;

    -- Guardar en historial
    INSERT INTO Seguridad.HistorialClave
    (
        IdUsuario,
        Clave,
        FechaCreacion
    )
    VALUES
    (@UsuarioId, @NuevaContrasena, GETDATE());

    SET @Resultado = 1;
END;