USE SubliColorBD2;
GO

INSERT INTO Administracion.Menu
(
    IdMenuPadre,
    CodigoInterno,
    Nombre,
    EstaActivo,
    IdUsuarioCreacion,
    FechaCreacion
)
VALUES
(0, N'PP', N'Pantalla Principal', 1, 1, GETDATE()),
(0, N'S', N'Seguridad', 1, 1, GETDATE()),
(2, N'C', N'Cuentas', 1, 1, GETDATE());

SELECT *
FROM Administracion.Menu AS M;