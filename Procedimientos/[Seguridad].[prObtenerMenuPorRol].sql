USE SubliColorBD1
go

CREATE OR ALTER  PROCEDURE [Seguridad].[prObtenerMenuPorRol]
    @RolId INT
AS
BEGIN
    SELECT DISTINCT M.MenuId, M.Nombre, M.Ruta, M.PadreMenuId
    FROM Seguridad.Menu M
    INNER JOIN Seguridad.PermisoRol PR ON M.MenuId = PR.MenuId
    WHERE PR.RolId = @RolId AND PR.EstaActivo = 1
      --AND EXISTS (
      --    SELECT 1 FROM Seguridad.Permiso P
      --    WHERE P.PermisoId = PR.PermisoId AND P.Nombre = 'Ver'
      --)
    ORDER BY M.PadreMenuId, M.MenuId;
END