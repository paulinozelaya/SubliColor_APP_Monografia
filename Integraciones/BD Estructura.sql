--USE master;
--GO

---- Cerrar conexiones y poner en modo de un solo usuario
--ALTER DATABASE SubliColorBD2 SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
--GO

--DROP DATABASE IF EXISTS SubliColorBD2;
--GO

--CREATE DATABASE SubliColorBD2;
--GO

USE SubliColorBD2;
GO
;

-- ==========================================
-- Script Unificado para SubliColorBD2 Mejorado
-- ==========================================
CREATE SCHEMA Administracion;
GO
;
CREATE SCHEMA Seguridad;
GO
;
CREATE SCHEMA Proceso;
GO
;


CREATE TABLE Administracion.Categoria
(
    IdCategoria INT IDENTITY(1, 1),
    CodigoInterno NVARCHAR(100),
    Nombre NVARCHAR(200),
    Descripcion NVARCHAR(300),
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT PK_IdCategoria
        PRIMARY KEY (IdCategoria)
);

CREATE TABLE Administracion.Valor
(
    IdValor INT IDENTITY(1, 1),
    IdCategoria INT,
    CodigoInterno NVARCHAR(100),
    Nombre NVARCHAR(200),
    Descripcion NVARCHAR(300),
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT PK_IdValor
        PRIMARY KEY (IdValor),
    CONSTRAINT FK_IdCategoria_Valor
        FOREIGN KEY (IdCategoria)
        REFERENCES Administracion.Categoria (IdCategoria)
);

CREATE TABLE Administracion.Persona
(
    IdPersona INT IDENTITY(1, 1),
    PrimerNombre NVARCHAR(100),
    SegundoNombre NVARCHAR(100),
    PrimerApellido NVARCHAR(100),
    SegundoApellido NVARCHAR(100),
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT PK_IdPersona
        PRIMARY KEY (IdPersona),
);

CREATE TABLE Administracion.PersonaContacto
(
    IdPersonaContacto INT IDENTITY(1, 1),
    IdPersona INT,
    IdTipoContacto INT,
    Contacto NVARCHAR(255),
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT PK_IdPersonaContacto
        PRIMARY KEY (IdPersonaContacto),
    CONSTRAINT FK_IdPersona_PersonaContacto
        FOREIGN KEY (IdPersona)
        REFERENCES Administracion.Persona (IdPersona)
);

CREATE TABLE Administracion.PersonaIdentificacion
(
    IdPersonaIdentificacion INT IDENTITY(1, 1),
    IdPersona INT,
    IdTipoContacto INT,
    Contacto NVARCHAR(255),
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT PK_IdPersonaIdentificacion
        PRIMARY KEY (IdPersonaIdentificacion),
    CONSTRAINT FK_IdPersona_PersonaIdentificacion
        FOREIGN KEY (IdPersona)
        REFERENCES Administracion.Persona (IdPersona)
);

CREATE TABLE Administracion.PersonaDireccion
(
    IdPersonaDireccion INT IDENTITY(1, 1),
    IdPersona INT,
    IdTipoContacto INT,
    Contacto NVARCHAR(255),
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT PK_IdPersonaDireccion
        PRIMARY KEY (IdPersonaDireccion),
    CONSTRAINT FK_IdPersona_PersonaDireccion
        FOREIGN KEY (IdPersona)
        REFERENCES Administracion.Persona (IdPersona)
);

CREATE TABLE Seguridad.Usuario
(
    IdUsuario INT IDENTITY(1, 1),
    Usuario NVARCHAR(100),
    Clave NVARCHAR(255),
    Email NVARCHAR(255),
    IdPersona INT,
    EstaBloqueado BIT,
    FechaBloqueo DATETIME,
    IntentosFallidos TINYINT,
    FechaExpiracion DATETIME,
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT PK_IdUsuario
        PRIMARY KEY (IdUsuario),
    CONSTRAINT FK_IdPersona_Notificacion
        FOREIGN KEY (IdPersona)
        REFERENCES Administracion.Persona (IdPersona)
);

CREATE TABLE Seguridad.HistorialClave
(
    IdHistorialClave INT IDENTITY(1, 1),
    IdUsuario INT,
    Clave NVARCHAR(255),
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT PK_IdHistorialClave
        PRIMARY KEY (IdHistorialClave),
    CONSTRAINT FK_IdUsuario_HistorialClave
        FOREIGN KEY (IdUsuario)
        REFERENCES Seguridad.Usuario (IdUsuario)
);

CREATE TABLE Seguridad.Token
(
    IdToken INT IDENTITY(1, 1),
    IdUsuario INT,
    Token NVARCHAR(255),
    FechaExpiracion DATETIME,
    Usado BIT,
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT PK_IdToken
        PRIMARY KEY (IdToken),
    CONSTRAINT FK_IdUsuario_Token
        FOREIGN KEY (IdUsuario)
        REFERENCES Seguridad.Usuario (IdUsuario)
);

CREATE TABLE Seguridad.AuditoriaInicioSesion
(
    IdAuditoriaInicioSesion INT IDENTITY(1, 1),
    IdUsuario INT NULL,
    FechaInicio DATETIME NOT NULL
        DEFAULT GETDATE(),
    FechaFin DATETIME NULL,
    DireccionIP NVARCHAR(50) NULL,
    Dispositivo NVARCHAR(255) NULL,
    Ubicacion NVARCHAR(255) NULL,
    Exitoso BIT NOT NULL,
    CONSTRAINT PK_IdAuditoriaInicioSession
        PRIMARY KEY (IdAuditoriaInicioSesion),
    CONSTRAINT FK_IdAuditoriaInicioSesion_Usuario
        FOREIGN KEY (IdUsuario)
        REFERENCES Seguridad.Usuario (IdUsuario)
);
GO

CREATE TABLE Administracion.PlantillaNotificacion
(
    IdPlantillaNotificacion INT IDENTITY(1, 1),
    IdTipoPlantilla INT,
    Plantilla VARCHAR(8000),
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT PK_IdPlantillaNotificacion
        PRIMARY KEY (IdPlantillaNotificacion)
);

CREATE TABLE Seguridad.Notificacion
(
    IdNotificacion INT IDENTITY(1, 1),
    IdUsuario INT,
    IdPlantillaNotificacion INT,
    Notificacion VARCHAR(8000),
    Enviado BIT,
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT PK_IdNotificacion
        PRIMARY KEY (IdNotificacion),
    CONSTRAINT FK_IdUsuario_Notificacion
        FOREIGN KEY (IdUsuario)
        REFERENCES Seguridad.Usuario (IdUsuario),
    CONSTRAINT FK_IdPlantillaNotificacion_Notificacion
        FOREIGN KEY (IdPlantillaNotificacion)
        REFERENCES Administracion.PlantillaNotificacion (IdPlantillaNotificacion)
);

CREATE TABLE Administracion.Rol
(
    IdRol INT IDENTITY(1, 1),
    CodigoInterno NVARCHAR(100),
    Nombre NVARCHAR(255),
    Descripcion NVARCHAR(4000),
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT PK_IdRol
        PRIMARY KEY (IdRol)
);

CREATE TABLE Administracion.Accion
(
    IdAccion INT IDENTITY(1, 1),
    CodigoInterno NVARCHAR(100),
    Nombre NVARCHAR(255),
    Descripcion NVARCHAR(4000),
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT PK_IdAccion
        PRIMARY KEY (IdAccion)
);

CREATE TABLE Administracion.RolAccion
(
    IdRolAccion INT IDENTITY(1, 1),
    IdRol INT,
    IdAccion INT,
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT PK_IdRolAccion
        PRIMARY KEY (IdRolAccion),
    CONSTRAINT FK_IdRol_RolAccion
        FOREIGN KEY (IdRol)
        REFERENCES Administracion.Rol (IdRol),
    CONSTRAINT FK_IdAccion_RolAccion
        FOREIGN KEY (IdAccion)
        REFERENCES Administracion.Accion (IdAccion)
);

CREATE TABLE Administracion.UsuarioRol
(
    IdUsuarioRol INT IDENTITY(1, 1),
    IdUsuario INT,
    IdRol INT,
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT PK_IdUsuarioRol
        PRIMARY KEY (IdUsuarioRol),
    CONSTRAINT FK_IdRol_UsuarioRol
        FOREIGN KEY (IdRol)
        REFERENCES Administracion.Rol (IdRol),
    CONSTRAINT FK_IdUsuario_RolAccion
        FOREIGN KEY (IdUsuario)
        REFERENCES Seguridad.Usuario (IdUsuario)
);

CREATE TABLE Administracion.Menu
(
    IdMenu INT IDENTITY(1, 1),
    IdMenuPadre INT,
    CodigoInterno NVARCHAR(255),
    Nombre NVARCHAR(255),
	Icono NVARCHAR(1000),
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT PK_IdMenu
        PRIMARY KEY (IdMenu)
);

CREATE TABLE Administracion.RolMenu
(
    IdRolMenu INT IDENTITY(1, 1),
    IdRol INT,
    IdMenu INT,
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME,
    CONSTRAINT PK_IdRolMenu
        PRIMARY KEY (IdRolMenu),
    CONSTRAINT FK_RolMenu_Rol
        FOREIGN KEY (IdRol)
        REFERENCES Administracion.Rol (IdRol),
    CONSTRAINT FK_RolMenu_Menu
        FOREIGN KEY (IdMenu)
        REFERENCES Administracion.Menu (IdMenu)
);

CREATE TABLE Proceso.Cliente
(
    IdCliente INT IDENTITY(1, 1),
    IdPersona INT,
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT PK_IdCliente
        PRIMARY KEY (IdCliente),
    CONSTRAINT FK_IdPersona_Cliente
        FOREIGN KEY (IdPersona)
        REFERENCES Administracion.Persona (IdPersona)
);

CREATE TABLE Proceso.Producto
(
    IdProducto INT IDENTITY(1, 1),
    IdCategoria INT,
    Codigo NVARCHAR(255),
    Nombre NVARCHAR(1000),
    Descripcion NVARCHAR(4000),
    PrecioVenta MONEY,
    IdUnidadMedida INT,
    IdEstado INT,
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME,
    CONSTRAINT PK_IdProducto
        PRIMARY KEY (IdProducto)
);

CREATE TABLE Proceso.ProductoExistencia
(
    IdProductoExistencia INT IDENTITY(1, 1),
    IdProducto INT,
    CantidadActual INT,
    UltimoCosto MONEY,
    CostoPromedio MONEY,
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME,
    CONSTRAINT PK_IdProductoExistencia
        PRIMARY KEY (IdProductoExistencia),
    CONSTRAINT FK_IdProducto_ProductoExistencia
        FOREIGN KEY (IdProducto)
        REFERENCES Proceso.Producto (IdProducto)
);

CREATE TABLE Proceso.ProductoMovimiento
(
    IdMovimientoProducto INT,
    IdTipoMovimiento INT,
    Referencia NVARCHAR(255),
    Comentario NVARCHAR(4000),
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME,
    CONSTRAINT PK_IdMovimientoProducto
        PRIMARY KEY (IdMovimientoProducto)
);

CREATE TABLE Proceso.ProductoMovimientoDetalle
(
    IdProductoMovimientoDetalle INT IDENTITY(1, 1),
    IdProducto INT,
    IdMovimientoProducto INT,
    Cantidad INT,
    PrecioUnitario MONEY,
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME,
    CONSTRAINT PK_IdProductoMovimientoDetalle
        PRIMARY KEY (IdProductoMovimientoDetalle),
    CONSTRAINT FK_IdProducto_ProductoMovimientoDetalle
        FOREIGN KEY (IdProducto)
        REFERENCES Proceso.Producto (IdProducto),
    CONSTRAINT FK_IdMovimientoProducto_ProductoMovimientoDetalle
        FOREIGN KEY (IdMovimientoProducto)
        REFERENCES Proceso.ProductoMovimiento (IdMovimientoProducto)
);

CREATE TABLE Proceso.Venta
(
    IdVenta INT IDENTITY(1, 1),
    IdCliente INT,
    NumeroFactura NVARCHAR(255),
    SubTotal MONEY,
    Descuento MONEY,
    Total MONEY,
    IdMetodoPago NVARCHAR(255),
    Observacion NVARCHAR(4000),
    IdEstado INT,
    IdUsuarioPedido INT,
    IdUsuarioCaja INT,
    EstaPagado BIT,
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT PK_IdVenta
        PRIMARY KEY (IdVenta),
    CONSTRAINT FK_IdCliente_Notificacion
        FOREIGN KEY (IdCliente)
        REFERENCES Proceso.Cliente (IdCliente)
);

CREATE TABLE Proceso.DetalleVenta
(
    IdDetalleVenta INT IDENTITY(1, 1),
    IdVenta INT,
    IdProducto INT,
    CantidadProducto INT,
    PrecioUnitario MONEY,
    Descuento MONEY,
    PrecioTotal MONEY,
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT PK_IdDetalleVenta
        PRIMARY KEY (IdDetalleVenta),
    CONSTRAINT FK_IdVenta_DetalleVenta
        FOREIGN KEY (IdVenta)
        REFERENCES Proceso.Venta (IdVenta),
    CONSTRAINT FK_IdProducto_DetalleVenta
        FOREIGN KEY (IdProducto)
        REFERENCES Proceso.Producto (IdProducto)
);

CREATE TABLE Proceso.Proveedor
(
    IdProveedor INT PRIMARY KEY IDENTITY(1, 1),
    NombreProveedor NVARCHAR(200),
    RUC NVARCHAR(50),
    Telefono NVARCHAR(50),
    Correo NVARCHAR(100),
    Direccion NVARCHAR(300),
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
);


CREATE TABLE Proceso.Compra
(
    IdCompra INT PRIMARY KEY IDENTITY(1, 1),
    IdProveedor INT,
    NumeroFactura NVARCHAR(255),
    FechaCompra DATETIME,
    SubTotal MONEY,
    Descuento MONEY,
    Total MONEY,
    Observacion NVARCHAR(4000),
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT FK_Compra_Proveedor
        FOREIGN KEY (IdProveedor) REFERENCES Proceso.Proveedor (IdProveedor)
);

CREATE TABLE Proceso.DetalleCompra
(
    IdDetalleCompra INT PRIMARY KEY IDENTITY(1, 1),
    IdCompra INT,
    IdProducto INT,
    CantidadProducto INT,
    PrecioUnitario MONEY,
    Descuento MONEY,
    Total MONEY,
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT FK_DetalleCompra_Compra
        FOREIGN KEY (IdCompra) REFERENCES Proceso.Compra (IdCompra),
    CONSTRAINT FK_DetalleCompra_Producto
        FOREIGN KEY (IdProducto)
        REFERENCES Proceso.Producto (IdProducto)
);

CREATE TABLE Proceso.DevolucionCompra
(
    IdDevolucionCompra INT PRIMARY KEY IDENTITY(1, 1),
    IdCompra INT,
    FechaDevolucion DATETIME,
    Motivo NVARCHAR(4000),
    TotalDevuelto MONEY,
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT FK_DevolucionCompra_Compra
        FOREIGN KEY (IdCompra) REFERENCES Proceso.Compra (IdCompra)
);

CREATE TABLE Proceso.DetalleDevolucionCompra
(
    IdDetalleDevolucionCompra INT PRIMARY KEY IDENTITY(1, 1),
    IdDevolucionCompra INT,
    IdProducto INT,
    CantidadDevuelta INT,
    PrecioUnitario MONEY,
    SubTotalDevuelto MONEY,
    TotalDevuelto MONEY,
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT FK_DetalleDevolucionCompra_Devolucion
        FOREIGN KEY (IdDevolucionCompra) REFERENCES Proceso.DevolucionCompra (IdDevolucionCompra),
    CONSTRAINT FK_DetalleDevolucionCompra_Producto
        FOREIGN KEY (IdProducto)
        REFERENCES Proceso.Producto (IdProducto)
);

CREATE TABLE Proceso.DevolucionVenta
(
    IdDevolucionVenta INT PRIMARY KEY IDENTITY(1, 1),
    IdVenta INT,
    FechaDevolucion DATETIME,
    Motivo NVARCHAR(4000),
    TotalDevuelto MONEY,
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT FK_DevolucionVenta_Venta
        FOREIGN KEY (IdVenta) REFERENCES Proceso.Venta (IdVenta)
);

CREATE TABLE Proceso.DetalleDevolucionVenta
(
    IdDetalleDevolucionVenta INT PRIMARY KEY IDENTITY(1, 1),
    IdDevolucionVenta INT,
    IdProducto INT,
    CantidadDevuelta INT,
    PrecioUnitario MONEY,
    SubTotalDevuelto MONEY,
    TotalDevuelto MONEY,
    EstaActivo BIT
        DEFAULT 1,
    IdUsuarioCreacion INT
        DEFAULT 1,
    FechaCreacion DATETIME
        DEFAULT GETDATE(),
    IdUsuarioModificacion INT,
    FechaModificacion DATETIME
        CONSTRAINT FK_DetalleDevolucionVenta_Devolucion
        FOREIGN KEY (IdDevolucionVenta) REFERENCES Proceso.DevolucionVenta (IdDevolucionVenta),
    CONSTRAINT FK_DetalleDevolucionVenta_Producto
        FOREIGN KEY (IdProducto)
        REFERENCES Proceso.Producto (IdProducto)
);
