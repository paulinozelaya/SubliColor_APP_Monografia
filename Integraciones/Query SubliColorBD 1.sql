CREATE DATABASE SubliColorBD1
GO

USE SubliColorBD1
gO

-- ==========================================
-- Script Unificado para SubliColorBD1 Mejorado
-- ==========================================

CREATE SCHEMA Personas;
GO

CREATE TABLE Personas.Persona
(
    PersonaId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Apellido NVARCHAR(100),
    Telefono NVARCHAR(50),
    Email NVARCHAR(150),
    TipoIdentificacion NVARCHAR(50),
    NumeroIdentificacion NVARCHAR(50),
    FechaNacimiento DATE NULL,
    Sexo NVARCHAR(10) NULL,
    Facebook NVARCHAR(100) NULL,
    Instagram NVARCHAR(100) NULL,
    Twitter NVARCHAR(100) NULL
);
GO

-- ------------------------------
-- Esquema: Seguridad
-- ------------------------------
CREATE SCHEMA Seguridad;
GO

-- Tabla Usuario
CREATE TABLE Seguridad.Usuario
(
    UsuarioId INT PRIMARY KEY IDENTITY(1,1),
    PersonaId INT NOT NULL,
    Email NVARCHAR(150) UNIQUE NOT NULL,
    NombreUsuario NVARCHAR(50) UNIQUE NOT NULL, -- Para iniciar sesión
    ContrasenaHash NVARCHAR(255) NOT NULL,       -- Para validar login
    EstaActivo BIT NOT NULL DEFAULT 1,
    EstaBloqueado BIT NOT NULL DEFAULT 0,
    IntentosFallidos INT NOT NULL DEFAULT 0,
    FechaBloqueo DATETIME NULL,
    FechaModificacion DATETIME NULL,
    CONSTRAINT FK_Usuario_Persona FOREIGN KEY (PersonaId) REFERENCES Personas.Persona(PersonaId)
);
GO



-- Tabla Rol
CREATE TABLE Seguridad.Rol
(
    RolId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(255)
);
GO

CREATE TABLE Seguridad.UsuarioRol
(
    UsuarioRolId INT PRIMARY KEY IDENTITY(1,1),
    UsuarioId INT NOT NULL,
    RolId INT NOT NULL,
    EstaActivo BIT DEFAULT 1,
    FOREIGN KEY (UsuarioId) REFERENCES Seguridad.Usuario(UsuarioId),
    FOREIGN KEY (RolId) REFERENCES Seguridad.Rol(RolId)
);
GO


-- Tabla Menu
CREATE TABLE Seguridad.Menu
(
    MenuId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Ruta NVARCHAR(255),
    PadreMenuId INT NULL,
    FOREIGN KEY (PadreMenuId) REFERENCES Seguridad.Menu(MenuId)
);
GO

CREATE TABLE Seguridad.AuditoriaInicioSesion
(
    AuditoriaInicioSesionId INT PRIMARY KEY IDENTITY(1,1),
    UsuarioId INT NULL, -- Puede ser NULL si no existe el usuario
    FechaInicio DATETIME NOT NULL DEFAULT GETDATE(),
    FechaFin DATETIME NULL,
    DireccionIP NVARCHAR(50) NULL,
    Dispositivo NVARCHAR(100) NULL,
    Ubicacion NVARCHAR(100) NULL,
    Exitoso BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_AuditoriaInicioSesion_Usuario FOREIGN KEY (UsuarioId) REFERENCES Seguridad.Usuario(UsuarioId)
);
GO


-- Auditoría general CRUD
CREATE TABLE Seguridad.AuditoriaGeneral
(
    AuditoriaGeneralId INT PRIMARY KEY IDENTITY(1,1),
    NombreTabla NVARCHAR(128) NOT NULL,
    TipoOperacion NVARCHAR(10) NOT NULL,
    LlaveRegistro NVARCHAR(255),
    UsuarioId INT NOT NULL,
    FechaOperacion DATETIME DEFAULT GETDATE(),
    DatosAntes NVARCHAR(MAX),
    DatosDespues NVARCHAR(MAX),
    Observacion NVARCHAR(255),
    FOREIGN KEY (UsuarioId) REFERENCES Seguridad.Usuario(UsuarioId)
);
GO

-- Tabla Permiso
CREATE TABLE Seguridad.Permiso
(
    PermisoId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL
);
GO

-- Tabla PermisoRol
CREATE TABLE Seguridad.PermisoRol
(
    PermisoRolId INT PRIMARY KEY IDENTITY(1,1),
    RolId INT NOT NULL,
    PermisoId INT NOT NULL,
    MenuId INT NOT NULL,
    EstaActivo BIT DEFAULT 1,
    FOREIGN KEY (RolId) REFERENCES Seguridad.Rol(RolId),
    FOREIGN KEY (PermisoId) REFERENCES Seguridad.Permiso(PermisoId),
    FOREIGN KEY (MenuId) REFERENCES Seguridad.Menu(MenuId)
);
GO

-- Recuperación de contraseña con token y expiración
CREATE TABLE Seguridad.RecuperacionContrasena
(
    RecuperacionId INT PRIMARY KEY IDENTITY(1,1),
    UsuarioId INT NOT NULL,
    PinTemporal NVARCHAR(100),
	FechaGeneracion DATETIME,
    FechaExpiracion DATETIME,
	Usado BIT,
    FOREIGN KEY (UsuarioId) REFERENCES Seguridad.Usuario(UsuarioId)
);
GO

-- Bitácora Actividad
CREATE TABLE Seguridad.BitacoraActividad
(
    BitacoraActividadId INT PRIMARY KEY IDENTITY(1,1),
    UsuarioId INT NOT NULL,
    FechaHora DATETIME DEFAULT GETDATE(),
    Accion NVARCHAR(255),
    TablaAfectada NVARCHAR(128),
    LlaveRegistro NVARCHAR(255),
    Descripcion NVARCHAR(500),
    FOREIGN KEY (UsuarioId) REFERENCES Seguridad.Usuario(UsuarioId)
);
GO

-- Bitácora Errores
CREATE TABLE Seguridad.BitacoraErrores
(
    BitacoraErrorId INT PRIMARY KEY IDENTITY(1,1),
    FechaHora DATETIME DEFAULT GETDATE(),
    Nivel NVARCHAR(50),
    Mensaje NVARCHAR(MAX),
    StackTrace NVARCHAR(MAX),
    UsuarioId INT NULL,
    FOREIGN KEY (UsuarioId) REFERENCES Seguridad.Usuario(UsuarioId)
);
GO


-- ------------------------------
-- Esquema: Personas
-- ------------------------------


CREATE TABLE Personas.Cliente
(
    ClienteId INT PRIMARY KEY IDENTITY(1,1),
    PersonaId INT NOT NULL,
    FechaRegistro DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (PersonaId) REFERENCES Personas.Persona(PersonaId)
);
GO

CREATE TABLE Personas.Proveedor
(
    ProveedorId INT PRIMARY KEY IDENTITY(1,1),
    PersonaId INT NOT NULL,
    Empresa NVARCHAR(150),
    FOREIGN KEY (PersonaId) REFERENCES Personas.Persona(PersonaId)
);
GO


-- ------------------------------
-- Esquema: Productos
-- ------------------------------
CREATE SCHEMA Productos;
GO

CREATE TABLE Productos.Categoria
(
    CategoriaId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    CategoriaPadreId INT NULL,
    EstaActivo BIT DEFAULT 1,
    FOREIGN KEY (CategoriaPadreId) REFERENCES Productos.Categoria(CategoriaId)
);
GO

CREATE TABLE Productos.UnidadMedida
(
    UnidadMedidaId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(50) NOT NULL
);
GO

CREATE TABLE Productos.Producto
(
    ProductoId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(150) NOT NULL,
    Descripcion NVARCHAR(255),
    Precio DECIMAL(18,2) NOT NULL,
    Stock INT DEFAULT 0,
    Costo DECIMAL(18,2) DEFAULT 0,
    MargenGanancia DECIMAL(5,2) DEFAULT 0,
    StockMinimo INT DEFAULT 0,
    Imagen NVARCHAR(255),
    CategoriaId INT NULL,
    UnidadMedidaId INT NULL,
    EstaActivo BIT DEFAULT 1,
    FOREIGN KEY (CategoriaId) REFERENCES Productos.Categoria(CategoriaId),
    FOREIGN KEY (UnidadMedidaId) REFERENCES Productos.UnidadMedida(UnidadMedidaId)
);
GO

CREATE TABLE Productos.Variantes
(
    VarianteId INT PRIMARY KEY IDENTITY(1,1),
    ProductoId INT NOT NULL,
    Nombre NVARCHAR(100) NOT NULL,
    Valor NVARCHAR(100) NOT NULL,
    EstaActivo BIT DEFAULT 1,
    FOREIGN KEY (ProductoId) REFERENCES Productos.Producto(ProductoId)
);
GO

CREATE TABLE Productos.Combo
(
    ComboId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(150) NOT NULL,
    Precio DECIMAL(18,2) NOT NULL,
    EstaActivo BIT DEFAULT 1
);
GO

CREATE TABLE Productos.ComboDetalle
(
    ComboDetalleId INT PRIMARY KEY IDENTITY(1,1),
    ComboId INT NOT NULL,
    ProductoId INT NOT NULL,
    Cantidad INT NOT NULL,
    FOREIGN KEY (ComboId) REFERENCES Productos.Combo(ComboId),
    FOREIGN KEY (ProductoId) REFERENCES Productos.Producto(ProductoId)
);
GO


-- ------------------------------
-- Esquema: Ventas
-- ------------------------------
CREATE SCHEMA Ventas;
GO

CREATE TABLE Ventas.Venta
(
    VentaId INT PRIMARY KEY IDENTITY(1,1),
    ClienteId INT NOT NULL,
    FechaVenta DATETIME DEFAULT GETDATE(),
    Total DECIMAL(18,2) NOT NULL,
    DescuentoTotal DECIMAL(18,2) DEFAULT 0,
    Observacion NVARCHAR(255),
    MonedaId INT DEFAULT 1,
    FOREIGN KEY (ClienteId) REFERENCES Personas.Cliente(ClienteId)
);
GO

CREATE TABLE Ventas.DetalleVenta
(
    DetalleVentaId INT PRIMARY KEY IDENTITY(1,1),
    VentaId INT NOT NULL,
    ProductoId INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(18,2) NOT NULL,
    Descuento DECIMAL(18,2) DEFAULT 0,
    FOREIGN KEY (VentaId) REFERENCES Ventas.Venta(VentaId),
    FOREIGN KEY (ProductoId) REFERENCES Productos.Producto(ProductoId)
);
GO

CREATE TABLE Ventas.DetalleVentaCombo
(
    DetalleVentaComboId INT PRIMARY KEY IDENTITY(1,1),
    VentaId INT NOT NULL,
    ComboId INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (VentaId) REFERENCES Ventas.Venta(VentaId),
    FOREIGN KEY (ComboId) REFERENCES Productos.Combo(ComboId)
);
GO

CREATE TABLE Ventas.MetodoPago
(
    MetodoPagoId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL
);
GO

CREATE TABLE Ventas.Pago
(
    PagoId INT PRIMARY KEY IDENTITY(1,1),
    VentaId INT NOT NULL,
    MetodoPagoId INT NOT NULL,
    Monto DECIMAL(18,2) NOT NULL,
    FechaPago DATETIME DEFAULT GETDATE(),
    MonedaId INT DEFAULT 1,
    FOREIGN KEY (VentaId) REFERENCES Ventas.Venta(VentaId),
    FOREIGN KEY (MetodoPagoId) REFERENCES Ventas.MetodoPago(MetodoPagoId)
);
GO

CREATE TABLE Ventas.CuentaPorCobrar
(
    CuentaPorCobrarId INT PRIMARY KEY IDENTITY(1,1),
    VentaId INT NOT NULL,
    MontoTotal DECIMAL(18,2) NOT NULL,
    MontoPagado DECIMAL(18,2) DEFAULT 0,
    Saldo AS (MontoTotal - MontoPagado),
    FechaVencimiento DATE,
    EstaActivo BIT DEFAULT 1,
    FOREIGN KEY (VentaId) REFERENCES Ventas.Venta(VentaId)
);
GO

CREATE TABLE Ventas.Devolucion
(
    DevolucionId INT PRIMARY KEY IDENTITY(1,1),
    VentaId INT NOT NULL,
    FechaDevolucion DATETIME DEFAULT GETDATE(),
    TipoReembolso NVARCHAR(50),
    MotivoDevolucionId INT NULL,
    Observacion NVARCHAR(255),
    FOREIGN KEY (VentaId) REFERENCES Ventas.Venta(VentaId)
);
GO

CREATE TABLE Ventas.MotivoDevolucion
(
    MotivoDevolucionId INT PRIMARY KEY IDENTITY(1,1),
    Descripcion NVARCHAR(255) NOT NULL,
    EstaActivo BIT DEFAULT 1
);
GO


-- ------------------------------
-- Esquema: Reportes
-- ------------------------------
CREATE SCHEMA Reportes;
GO

--CREATE VIEW Reportes.VentasPorDia AS
--SELECT CAST(FechaVenta AS DATE) AS Fecha, SUM(Total) AS TotalVentas
--FROM Ventas.Venta
--GROUP BY CAST(FechaVenta AS DATE);
--GO

--CREATE VIEW Reportes.ProductosMasVendidos AS
--SELECT dv.ProductoId, p.Nombre, SUM(dv.Cantidad) AS CantidadVendida
--FROM Ventas.DetalleVenta dv
--JOIN Productos.Producto p ON dv.ProductoId = p.ProductoId
--GROUP BY dv.ProductoId, p.Nombre
--ORDER BY CantidadVendida DESC;
--GO

--CREATE VIEW Reportes.ClientesFrecuentes AS
--SELECT c.ClienteId, per.Nombre, COUNT(v.VentaId) AS NumeroCompras
--FROM Personas.Cliente c
--JOIN Personas.Persona per ON c.PersonaId = per.PersonaId
--JOIN Ventas.Venta v ON c.ClienteId = v.ClienteId
--GROUP BY c.ClienteId, per.Nombre
--ORDER BY NumeroCompras DESC;
--GO

--CREATE VIEW Reportes.StockActual AS
--SELECT ProductoId, Nombre, Stock, Precio, StockMinimo
--FROM Productos.Producto
--WHERE EstaActivo = 1;
--GO


-- ------------------------------
-- Esquema: Caja
-- ------------------------------
CREATE SCHEMA Caja;
GO

CREATE TABLE Caja.CajaDiaria
(
    CajaDiariaId INT PRIMARY KEY IDENTITY(1,1),
    UsuarioId INT NOT NULL,
    Fecha DATE NOT NULL,
    MontoApertura DECIMAL(18,2) NOT NULL,
    MontoCierre DECIMAL(18,2),
    Estado NVARCHAR(50) NOT NULL,
    FOREIGN KEY (UsuarioId) REFERENCES Seguridad.Usuario(UsuarioId)
);
GO


-- ------------------------------
-- Esquema: Fidelizacion
-- ------------------------------
CREATE SCHEMA Fidelizacion;
GO

CREATE TABLE Fidelizacion.PuntosCliente
(
    PuntosClienteId INT PRIMARY KEY IDENTITY(1,1),
    ClienteId INT NOT NULL,
    PuntosAcumulados INT DEFAULT 0,
    FechaUltimaActualizacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ClienteId) REFERENCES Personas.Cliente(ClienteId)
);
GO


-- ------------------------------
-- Esquema: Configuracion
-- ------------------------------
CREATE SCHEMA Configuracion;
GO

CREATE TABLE Configuracion.Impresora
(
    ImpresoraId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100),
    Tipo NVARCHAR(50),
    Configuracion NVARCHAR(MAX)
);
GO


-- ------------------------------
-- Esquema: Finanzas
-- ------------------------------
CREATE SCHEMA Finanzas;
GO

CREATE TABLE Finanzas.Moneda
(
    MonedaId INT PRIMARY KEY IDENTITY(1,1),
    Codigo NVARCHAR(10) NOT NULL,
    Nombre NVARCHAR(50) NOT NULL,
    Simbolo NVARCHAR(10) NOT NULL,
    TipoCambio DECIMAL(18,6) DEFAULT 1
);
GO

-- Insertar moneda base (Ejemplo: MXN)
INSERT INTO Finanzas.Moneda (Codigo, Nombre, Simbolo, TipoCambio) VALUES ('MXN', 'Peso Mexicano', '$', 1);
GO


-- ------------------------------
-- Esquema: Compras
-- ------------------------------
CREATE SCHEMA Compras;
GO

CREATE TABLE Compras.OrdenCompra
(
    OrdenCompraId INT PRIMARY KEY IDENTITY(1,1),
    ProveedorId INT NOT NULL,
    FechaOrden DATETIME DEFAULT GETDATE(),
    FechaRecepcion DATETIME,
    Estado NVARCHAR(50),
    Total DECIMAL(18,2),
    FOREIGN KEY (ProveedorId) REFERENCES Personas.Proveedor(ProveedorId)
);
GO

CREATE TABLE Compras.DetalleOrdenCompra
(
    DetalleOrdenCompraId INT PRIMARY KEY IDENTITY(1,1),
    OrdenCompraId INT NOT NULL,
    ProductoId INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (OrdenCompraId) REFERENCES Compras.OrdenCompra(OrdenCompraId),
    FOREIGN KEY (ProductoId) REFERENCES Productos.Producto(ProductoId)
);
GO

CREATE TABLE Compras.RecepcionMercaderia
(
    RecepcionId INT PRIMARY KEY IDENTITY(1,1),
    OrdenCompraId INT NOT NULL,
    FechaRecepcion DATETIME DEFAULT GETDATE(),
    UsuarioId INT NOT NULL,
    FOREIGN KEY (OrdenCompraId) REFERENCES Compras.OrdenCompra(OrdenCompraId),
    FOREIGN KEY (UsuarioId) REFERENCES Seguridad.Usuario(UsuarioId)
);
GO

CREATE TABLE Compras.DetalleRecepcionMercaderia
(
    DetalleRecepcionId INT PRIMARY KEY IDENTITY(1,1),
    RecepcionId INT NOT NULL,
    ProductoId INT NOT NULL,
    CantidadRecibida INT NOT NULL,
    FOREIGN KEY (RecepcionId) REFERENCES Compras.RecepcionMercaderia(RecepcionId),
    FOREIGN KEY (ProductoId) REFERENCES Productos.Producto(ProductoId)
);
GO


-- ==========================================
-- Fin del script unificado SubliColorBD1 Mejorado
-- ==========================================
