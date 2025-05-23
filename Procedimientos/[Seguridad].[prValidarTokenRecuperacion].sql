USE SubliColorBD1
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

    SELECT TOP 1 @UsuarioId = UsuarioId, @FechaGeneracion = FechaGeneracion
    FROM Seguridad.RecuperacionContrasena
    WHERE PinTemporal = @PinTemporal AND Usado = 0
    ORDER BY FechaGeneracion DESC;

    IF @UsuarioId IS NULL OR DATEDIFF(MINUTE, @FechaGeneracion, GETDATE()) > 30
    BEGIN
        SET @EsValido = 0;
        RETURN;
    END

    SET @EsValido = 1;
END
GO