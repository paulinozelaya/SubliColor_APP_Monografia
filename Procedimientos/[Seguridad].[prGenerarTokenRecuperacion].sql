USE SubliColorBD2;
GO

-- Procedimiento 1: Generar token de recuperación de contraseña
CREATE OR ALTER PROCEDURE [Seguridad].[prGenerarTokenRecuperacion]
    @NombreUsuario NVARCHAR(50),
    @PinTemporal NVARCHAR(10) OUTPUT,
    @Correo NVARCHAR(40) OUTPUT,
    @Resultado INT OUTPUT -- 0 = ok, 1 = usuario no existe o inactivo
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @UsuarioId INT;

    SELECT @UsuarioId = IdUsuario
    FROM Seguridad.Usuario
    WHERE Usuario = @NombreUsuario
          AND EstaActivo = 1;

    IF @UsuarioId IS NULL
    BEGIN
        SET @Resultado = 1;
        RETURN;
    END;

    SET @PinTemporal = RIGHT(CONVERT(NVARCHAR(10), CAST(ABS(CHECKSUM(NEWID())) % 1000000 AS INT)), 6);
    SET @Correo =
    (
        SELECT TOP 1
               U.Email
        FROM Seguridad.Usuario AS U
        WHERE U.IdUsuario = @UsuarioId
    );

    IF EXISTS
    (
        SELECT *
        FROM Seguridad.Token AS RC
        WHERE RC.IdUsuario = @UsuarioId
              AND RC.Usado = 0
    )
    BEGIN
        UPDATE Seguridad.Token
        SET Usado = 1
        WHERE IdUsuario = @UsuarioId
              AND Usado = 0;
    END;

    INSERT INTO Seguridad.Token
    (
        IdUsuario,
        Token,
        Usado,
        FechaCreacion
    )
    VALUES
    (@UsuarioId, @PinTemporal, 0, GETDATE());

    SET @Resultado = 0;
END;
GO