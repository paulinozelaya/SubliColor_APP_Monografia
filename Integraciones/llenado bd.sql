USE SubliColorBD4;
GO

INSERT INTO Administracion.Persona
(
    PrimerNombre,
    SegundoNombre,
    PrimerApellido,
    SegundoApellido
)
VALUES
('Juan', 'Carlos', 'P�rez', 'G�mez'),
('Mar�a', 'Elena', 'Ram�rez', 'Torres'),
('Pedro', 'Antonio', 'L�pez', 'Mart�nez'),
('Ana', 'Luc�a', 'Castro', 'S�nchez'),
('Luis', 'Fernando', 'Morales', 'Vargas'),
('Sof�a', 'Isabel', 'Garc�a', 'Hern�ndez'),
('Jos�', 'Manuel', 'Mendoza', 'Rojas'),
('Carmen', 'Patricia', 'Guzm�n', 'Cort�s'),
('Andr�s', 'Felipe', 'Silva', 'Navarro'),
('Valeria', 'Paola', 'Cruz', 'Jim�nez');

INSERT INTO Administracion.PersonaContacto
(
    IdPersona,
    IdTipoContacto,
    Contacto
)
VALUES
(1, 1, '505-8888-1111'), -- Juan Carlos P�rez G�mez
(1, 2, 'juan.perez@example.com'),
(2, 1, '505-7777-2222'), -- Mar�a Elena Ram�rez Torres
(2, 2, 'maria.ramirez@example.com'),
(3, 1, '505-8888-3333'), -- Pedro Antonio L�pez Mart�nez
(3, 3, '505-8888-4444'), -- WhatsApp

(4, 2, 'ana.castro@example.com'),
(5, 1, '505-7777-5555'),
(6, 2, 'sofia.garcia@example.com'),
(7, 1, '505-8888-7777');


INSERT INTO Administracion.PersonaIdentificacion
(
    IdPersona,
    IdTipoContacto,
    Contacto
)
VALUES
(1, 1, '001-250895-0001A'), -- Juan P�rez - C�dula
(2, 1, '001-250895-0002B'), -- Mar�a Ram�rez - C�dula
(3, 1, '001-250895-0003C'), -- Pedro L�pez - C�dula
(4, 2, 'PA-5678901'),       -- Ana Castro - Pasaporte
(5, 1, '001-250895-0005E'), -- Luis Morales - C�dula
(6, 1, '001-250895-0006F'), -- Sof�a Garc�a - C�dula
(7, 2, 'PA-1122334'),       -- Jos� Mendoza - Pasaporte
(8, 1, '001-250895-0008H'), -- Carmen Guzm�n - C�dula
(9, 1, '001-250895-0009I'), -- Andr�s Silva - C�dula
(10, 2, 'PA-9988776');      -- Valeria Cruz - Pasaporte

INSERT INTO Administracion.PersonaDireccion
(
    IdPersona,
    IdTipoContacto,
    Contacto
)
VALUES
(1, 1, 'Residencial Las Colinas, Casa #24, Managua'),
(2, 1, 'Reparto San Juan, Calle Central, Le�n'),
(3, 2, 'Edificio Plaza Espa�a, Oficina 305, Managua'),
(4, 1, 'Barrio San Luis, Frente al Parque, Masaya'),
(5, 3, 'Apartado Postal 1245, Granada'),
(6, 1, 'Colonia Centroam�rica, Calle Principal, Managua'),
(7, 2, 'Zona Franca Las Mercedes, Bodega 7, Managua'),
(8, 1, 'Urbanizaci�n Los Robles, Casa 18, Estel�'),
(9, 1, 'Residencial Monserrat, Bloque B, Chinandega'),
(10, 3, 'Apartado Postal 2089, Rivas');

INSERT INTO Seguridad.Usuario
(
    Usuario,
    Clave,
    Email,
    IdPersona,
    EstaBloqueado,
    IntentosFallidos,
    FechaExpiracion
)
VALUES
('jperez', 'Password123!', 'juan.perez@example.com', 1, 0, 0, DATEADD(YEAR, 1, GETDATE())),
('meramirez', 'Password123!', 'maria.ramirez@example.com', 2, 0, 0, DATEADD(YEAR, 1, GETDATE())),
('plopez', 'Password123!', 'pedro.lopez@example.com', 3, 0, 0, DATEADD(YEAR, 1, GETDATE())),
('acastro', 'Password123!', 'ana.castro@example.com', 4, 0, 0, DATEADD(YEAR, 1, GETDATE())),
('lmorales', 'Password123!', 'luis.morales@example.com', 5, 0, 0, DATEADD(YEAR, 1, GETDATE())),
('sgarcia', 'Password123!', 'sofia.garcia@example.com', 6, 0, 0, DATEADD(YEAR, 1, GETDATE())),
('jmendoza', 'Password123!', 'jose.mendoza@example.com', 7, 0, 0, DATEADD(YEAR, 1, GETDATE())),
('cguzman', 'Password123!', 'carmen.guzman@example.com', 8, 0, 0, DATEADD(YEAR, 1, GETDATE())),
('asilva', 'Password123!', 'andres.silva@example.com', 9, 0, 0, DATEADD(YEAR, 1, GETDATE())),
('vcruz', 'Password123!', 'valeria.cruz@example.com', 10, 0, 0, DATEADD(YEAR, 1, GETDATE()));


INSERT INTO Seguridad.HistorialClave
(
    IdUsuario,
    Clave
)
VALUES
(1, 'Password123!'),
(2, 'Password123!'),
(3, 'Password123!'),
(4, 'Password123!'),
(5, 'Password123!'),
(6, 'Password123!'),
(7, 'Password123!'),
(8, 'Password123!'),
(9, 'Password123!'),
(10, 'Password123!');

INSERT INTO Administracion.Rol
(
    CodigoInterno,
    Nombre,
    Descripcion
)
VALUES
('ROL_ADMIN', 'Administrador', 'Acceso completo al sistema y configuraci�n general'),
('ROL_USUARIO', 'Usuario', 'Acceso limitado a funcionalidades de usuario est�ndar'),
('ROL_CONTADOR', 'Contador', 'Acceso a m�dulos de finanzas y reportes contables'),
('ROL_VENTAS', 'Ventas', 'Acceso a m�dulos de ventas, clientes y facturaci�n'),
('ROL_COMPRAS', 'Compras', 'Acceso a m�dulos de compras y proveedores'),
('ROL_CAJA', 'Caja', 'Acceso a movimientos de caja y conciliaciones'),
('ROL_FIDELIZACION', 'Fidelizaci�n', 'Acceso a m�dulos de clientes frecuentes y promociones'),
('ROL_REPORTES', 'Reportes', 'Acceso solo a reportes y consultas del sistema'),
('ROL_CONFIG', 'Configuraci�n', 'Acceso a parametrizaci�n y ajustes del sistema'),
('ROL_FINANZAS', 'Finanzas', 'Acceso a m�dulos financieros y balances contables');


INSERT INTO Administracion.Accion
(
    CodigoInterno,
    Nombre,
    Descripcion
)
VALUES
('ACC_USUARIO_CREAR', 'Crear Usuario', 'Permite crear nuevos usuarios en el sistema'),
('ACC_USUARIO_EDITAR', 'Editar Usuario', 'Permite modificar la informaci�n de los usuarios'),
('ACC_USUARIO_ELIMINAR', 'Eliminar Usuario', 'Permite eliminar usuarios del sistema'),
('ACC_ROL_CREAR', 'Crear Rol', 'Permite crear nuevos roles de sistema'),
('ACC_ROL_EDITAR', 'Editar Rol', 'Permite modificar roles existentes'),
('ACC_ROL_ELIMINAR', 'Eliminar Rol', 'Permite eliminar roles del sistema'),
('ACC_REPORTE_VER', 'Ver Reportes', 'Permite acceder y visualizar reportes'),
('ACC_VENTAS_CREAR', 'Crear Venta', 'Permite registrar nuevas ventas'),
('ACC_COMPRAS_CREAR', 'Crear Compra', 'Permite registrar nuevas compras'),
('ACC_CAJA_MOVIMIENTO', 'Registrar Movimiento de Caja', 'Permite registrar ingresos y egresos de caja');


-- Administrador (todas las acciones)
INSERT INTO Administracion.RolAccion
(
    IdRol,
    IdAccion
)
VALUES
(1, 1);
INSERT INTO Administracion.RolAccion
(
    IdRol,
    IdAccion
)
VALUES
(1, 2);
INSERT INTO Administracion.RolAccion
(
    IdRol,
    IdAccion
)
VALUES
(1, 3);
INSERT INTO Administracion.RolAccion
(
    IdRol,
    IdAccion
)
VALUES
(1, 4);
INSERT INTO Administracion.RolAccion
(
    IdRol,
    IdAccion
)
VALUES
(1, 5);
INSERT INTO Administracion.RolAccion
(
    IdRol,
    IdAccion
)
VALUES
(1, 6);
INSERT INTO Administracion.RolAccion
(
    IdRol,
    IdAccion
)
VALUES
(1, 7);
INSERT INTO Administracion.RolAccion
(
    IdRol,
    IdAccion
)
VALUES
(1, 8);
INSERT INTO Administracion.RolAccion
(
    IdRol,
    IdAccion
)
VALUES
(1, 9);
INSERT INTO Administracion.RolAccion
(
    IdRol,
    IdAccion
)
VALUES
(1, 10);

-- Usuario (acciones limitadas)
INSERT INTO Administracion.RolAccion
(
    IdRol,
    IdAccion
)
VALUES
(2, 7);
INSERT INTO Administracion.RolAccion
(
    IdRol,
    IdAccion
)
VALUES
(2, 8);
INSERT INTO Administracion.RolAccion
(
    IdRol,
    IdAccion
)
VALUES
(2, 9);

-- Contador
INSERT INTO Administracion.RolAccion
(
    IdRol,
    IdAccion
)
VALUES
(3, 7);
INSERT INTO Administracion.RolAccion
(
    IdRol,
    IdAccion
)
VALUES
(3, 10);

-- Ventas
INSERT INTO Administracion.RolAccion
(
    IdRol,
    IdAccion
)
VALUES
(4, 8);

-- Compras
INSERT INTO Administracion.RolAccion
(
    IdRol,
    IdAccion
)
VALUES
(5, 9);

-- Caja
INSERT INTO Administracion.RolAccion
(
    IdRol,
    IdAccion
)
VALUES
(6, 10);

-- Reportes
INSERT INTO Administracion.RolAccion
(
    IdRol,
    IdAccion
)
VALUES
(8, 7);

-- Configuraci�n
INSERT INTO Administracion.RolAccion
(
    IdRol,
    IdAccion
)
VALUES
(9, 4);
INSERT INTO Administracion.RolAccion
(
    IdRol,
    IdAccion
)
VALUES
(9, 5);
INSERT INTO Administracion.RolAccion
(
    IdRol,
    IdAccion
)
VALUES
(9, 6);


INSERT INTO Administracion.UsuarioRol
(
    IdUsuario,
    IdRol
)
VALUES
(1, 1);
INSERT INTO Administracion.UsuarioRol
(
    IdUsuario,
    IdRol
)
VALUES
(2, 2);
INSERT INTO Administracion.UsuarioRol
(
    IdUsuario,
    IdRol
)
VALUES
(3, 2);
INSERT INTO Administracion.UsuarioRol
(
    IdUsuario,
    IdRol
)
VALUES
(4, 4);
INSERT INTO Administracion.UsuarioRol
(
    IdUsuario,
    IdRol
)
VALUES
(5, 5);
INSERT INTO Administracion.UsuarioRol
(
    IdUsuario,
    IdRol
)
VALUES
(6, 3);
INSERT INTO Administracion.UsuarioRol
(
    IdUsuario,
    IdRol
)
VALUES
(7, 6);
INSERT INTO Administracion.UsuarioRol
(
    IdUsuario,
    IdRol
)
VALUES
(8, 7);
INSERT INTO Administracion.UsuarioRol
(
    IdUsuario,
    IdRol
)
VALUES
(9, 8);
INSERT INTO Administracion.UsuarioRol
(
    IdUsuario,
    IdRol
)
VALUES
(10, 9);


-- Men�s principales
INSERT INTO Administracion.Menu
(
    IdMenuPadre,
    CodigoInterno,
    Nombre,
	Icono
)
VALUES
(
	NULL,
	'Menu_GestionUsuario',
	'Gestion Usuario',
	'pi pi-user'
),
(
	NULL,
	'Menu_GestionCliente',
	'Gestion Cliente',
	'pi pi-users'
),
(
	NULL,
	'Menu_GestionConfiguracion',
	'Gestion Configuracion',
	'pi pi-cog'
),
(
	NULL,
	'Menu_GestionProducto',
	'Gestion Producto',
	'pi pi-bars'
	
),
(
	NULL,
	'Menu_GestionVenta',
	'Gestion Venta',
	'pi pi-wallet'
),
(
	NULL,
	'Menu_GestionPersona',
	'Gestion Personas',
	'pi pi-id-card'
)


-- Administrador: todos los men�s
INSERT INTO Administracion.RolMenu
(
    IdRol,
    IdMenu
)
VALUES
(1, 1);
INSERT INTO Administracion.RolMenu
(
    IdRol,
    IdMenu
)
VALUES
(1, 2);
INSERT INTO Administracion.RolMenu
(
    IdRol,
    IdMenu
)
VALUES
(1, 3);
INSERT INTO Administracion.RolMenu
(
    IdRol,
    IdMenu
)
VALUES
(1, 4);
INSERT INTO Administracion.RolMenu
(
    IdRol,
    IdMenu
)
VALUES
(1, 5);

INSERT INTO Administracion.RolMenu
(
    IdRol,
    IdMenu
)
VALUES
(1, 9);

UPDATE [Administracion].[Menu]
SET EstaActivo = 0
WHERE CodigoInterno = 'Menu_GestionConfiguracion'


INSERT INTO [Administracion].[Categoria]
VALUES
('TIPO_CONTACTO', 'Tipo de Contacto', 'Tipo de Contacto', 1, 1, GETDATE(), NULL, NULL),
('TIPO_DIRECCION', 'Tipo de Direccion', 'Tipo de Direccion', 1, 1, GETDATE(), NULL, NULL),
('TIPO_IDENTIFICACION', 'Tipo de Identificacion', 'Tipo de Identificacion', 1, 1, GETDATE(), NULL, NULL)

INSERT INTO [Administracion].[Valor]
VALUES
(1, 'celular', 'Celular', 'Tipo contacto para celular', 1, 1, GETDATE(), NULL, NULL)