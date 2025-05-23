USE SubliColorBD1;
GO

CREATE OR ALTER PROCEDURE Seguridad.prIniciarSesion
    @NombreUsuario NVARCHAR(50),
    @Contrasena NVARCHAR(255),
    @DireccionIP NVARCHAR(50) = NULL,
    @Dispositivo NVARCHAR(100) = NULL,
    @Ubicacion NVARCHAR(100) = NULL,
    @Resultado INT OUTPUT -- 0=OK, 1=Usuario no existe, 2=Bloqueado, 3=Contraseña incorrecta, 4=Inactivo
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @UsuarioId INT,
            @EstaActivo BIT,
            @EstaBloqueado BIT,
            @IntentosFallidos INT,
            @ContrasenaReal NVARCHAR(255);

    -- Buscar usuario
    SELECT @UsuarioId = UsuarioId,
           @EstaActivo = EstaActivo,
           @EstaBloqueado = EstaBloqueado,
           @IntentosFallidos = IntentosFallidos,
           @ContrasenaReal = ContrasenaHash
    FROM Seguridad.Usuario
    WHERE NombreUsuario = @NombreUsuario;

    IF @UsuarioId IS NULL
    BEGIN
        SET @Resultado = 1; -- Usuario no existe

        INSERT INTO Seguridad.AuditoriaInicioSesion
        (
            UsuarioId,
            DireccionIP,
            Dispositivo,
            Ubicacion,
            Exitoso,
            FechaInicio
        )
        VALUES
        (NULL, @DireccionIP, @Dispositivo, @Ubicacion, 0, GETDATE());

        RETURN;
    END;

    IF @EstaActivo = 0
    BEGIN
        SET @Resultado = 4; -- Usuario inactivo

        INSERT INTO Seguridad.AuditoriaInicioSesion
        (
            UsuarioId,
            DireccionIP,
            Dispositivo,
            Ubicacion,
            Exitoso,
            FechaInicio
        )
        VALUES
        (@UsuarioId, @DireccionIP, @Dispositivo, @Ubicacion, 0, GETDATE());

        RETURN;
    END;

    IF @EstaBloqueado = 1
    BEGIN
        SET @Resultado = 2; -- Usuario bloqueado

        INSERT INTO Seguridad.AuditoriaInicioSesion
        (
            UsuarioId,
            DireccionIP,
            Dispositivo,
            Ubicacion,
            Exitoso,
            FechaInicio
        )
        VALUES
        (@UsuarioId, @DireccionIP, @Dispositivo, @Ubicacion, 0, GETDATE());

        RETURN;
    END;

    -- Verificación de contraseña
    IF @Contrasena = @ContrasenaReal
    BEGIN
        -- Reiniciar intentos
        UPDATE Seguridad.Usuario
        SET IntentosFallidos = 0,
            EstaBloqueado = 0,
            FechaBloqueo = NULL,
            FechaModificacion = GETDATE()
        WHERE UsuarioId = @UsuarioId;

        SET @Resultado = 0;

        INSERT INTO Seguridad.AuditoriaInicioSesion
        (
            UsuarioId,
            DireccionIP,
            Dispositivo,
            Ubicacion,
            Exitoso,
            FechaInicio
        )
        VALUES
        (@UsuarioId, @DireccionIP, @Dispositivo, @Ubicacion, 1, GETDATE());
    END;
    ELSE
    BEGIN
        -- Incrementar intentos fallidos
        SET @IntentosFallidos += 1;

        IF @IntentosFallidos >= 5
        BEGIN
            UPDATE Seguridad.Usuario
            SET IntentosFallidos = @IntentosFallidos,
                EstaBloqueado = 1,
                FechaBloqueo = GETDATE(),
                FechaModificacion = GETDATE()
            WHERE UsuarioId = @UsuarioId;
        END;
        ELSE
        BEGIN
            UPDATE Seguridad.Usuario
            SET IntentosFallidos = @IntentosFallidos,
                FechaModificacion = GETDATE()
            WHERE UsuarioId = @UsuarioId;
        END;

        SET @Resultado = 3;

        INSERT INTO Seguridad.AuditoriaInicioSesion
        (
            UsuarioId,
            DireccionIP,
            Dispositivo,
            Ubicacion,
            Exitoso,
            FechaInicio
        )
        VALUES
        (@UsuarioId, @DireccionIP, @Dispositivo, @Ubicacion, 0, GETDATE());
    END;
END;
