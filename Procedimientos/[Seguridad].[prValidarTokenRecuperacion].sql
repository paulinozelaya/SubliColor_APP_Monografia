USE SubliColorBD2;
GO

-- Procedimiento 2: Validar token de recuperación
CREATE OR ALTER PROCEDURE [Seguridad].[prValidarTokenRecuperacion]
    @PinTemporal NVARCHAR(10),
    @EsValido BIT OUTPUT,
    @UsuarioId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @FechaGeneracion DATETIME;

    SELECT TOP 1
           @UsuarioId = IdUsuario,
           @FechaGeneracion = FechaCreacion
    FROM Seguridad.Token
    WHERE Token = @PinTemporal
          AND Usado = 0
    ORDER BY FechaCreacion DESC;

    IF @UsuarioId IS NULL
       OR DATEDIFF(MINUTE, @FechaGeneracion, GETDATE()) > 30
    BEGIN
        SET @EsValido = 0;
        RETURN;
    END;

    SET @EsValido = 1;
END;
GO