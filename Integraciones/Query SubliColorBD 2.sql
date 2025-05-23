-- Crear base de datos y usarla
CREATE DATABASE SubliColorBD1;
GO
USE SubliColorBD1;
GO

-- Crear esquemas
CREATE SCHEMA Personas;
GO

CREATE SCHEMA Seguridad;
GO
CREATE SCHEMA Productos;
GO
CREATE SCHEMA Ventas;
GO
CREATE SCHEMA Caja;
GO
CREATE SCHEMA Configuracion;
GO
CREATE SCHEMA Finanzas;
GO
CREATE SCHEMA Compras;
GO

-- =========================
-- PERSONAS
-- =========================

CREATE TABLE Personas.Persona (
    PersonaId INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Apellido NVARCHAR(100) NOT NULL,
    Telefono NVARCHAR(20),
    Email NVARCHAR(100),
    TipoIdentificacion NVARCHAR(50),
    NumeroIdentificacion NVARCHAR(50),
    FechaNacimiento DATE,
    Sexo CHAR(1),
    Facebook NVARCHAR(100),
    Instagram NVARCHAR(100),
    Twitter NVARCHAR(100)
);

CREATE TABLE Personas.Cliente (
    ClienteId INT IDENTITY PRIMARY KEY,
    PersonaId INT NOT NULL UNIQUE,
    FOREIGN KEY (PersonaId) REFERENCES Personas.Persona(PersonaId)
);

CREATE TABLE Personas.Proveedor (
    ProveedorId INT IDENTITY PRIMARY KEY,
    PersonaId INT NOT NULL UNIQUE,
    Empresa NVARCHAR(200) NOT NULL,
    FOREIGN KEY (PersonaId) REFERENCES Personas.Persona(PersonaId)
);

-- =========================
-- SEGURIDAD
-- =========================

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

CREATE TABLE Seguridad.Rol (
    RolId INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL UNIQUE,
    Descripcion NVARCHAR(200)
);

CREATE TABLE Seguridad.UsuarioRol (
    UsuarioRolId INT IDENTITY PRIMARY KEY,
    UsuarioId INT NOT NULL,
    RolId INT NOT NULL,
    EstaActivo BIT NOT NULL DEFAULT 1,
    FOREIGN KEY (UsuarioId) REFERENCES Seguridad.Usuario(UsuarioId),
    FOREIGN KEY (RolId) REFERENCES Seguridad.Rol(RolId)
);

CREATE TABLE Seguridad.Permiso (
    PermisoId INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL UNIQUE,
    Descripcion NVARCHAR(200)
);

CREATE TABLE Seguridad.RolPermiso (
    RolPermisoId INT IDENTITY PRIMARY KEY,
    RolId INT NOT NULL,
    PermisoId INT NOT NULL,
    FOREIGN KEY (RolId) REFERENCES Seguridad.Rol(RolId),
    FOREIGN KEY (PermisoId) REFERENCES Seguridad.Permiso(PermisoId)
);

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

CREATE TABLE Seguridad.PinRecuperacion (
    PinRecuperacionId INT IDENTITY PRIMARY KEY,
    UsuarioId INT NOT NULL,
    Pin NVARCHAR(10) NOT NULL,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    FechaExpiracion DATETIME NOT NULL,
    Usado BIT NOT NULL DEFAULT 0,
    FOREIGN KEY (UsuarioId) REFERENCES Seguridad.Usuario(UsuarioId)
);

-- =========================
-- PRODUCTOS
-- =========================

CREATE TABLE Productos.Categoria (
    CategoriaId INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    CategoriaPadreId INT NULL,
    EstaActivo BIT NOT NULL DEFAULT 1,
    FOREIGN KEY (CategoriaPadreId) REFERENCES Productos.Categoria(CategoriaId)
);

CREATE TABLE Productos.UnidadMedida (
    UnidadMedidaId INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Productos.Producto (
    ProductoId INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(255),
    Precio DECIMAL(10,2) NOT NULL,
    Stock INT NOT NULL DEFAULT 0,
    Costo DECIMAL(10,2),
    MargenGanancia DECIMAL(5,2),
    StockMinimo INT DEFAULT 0,
    Imagen NVARCHAR(255),
    CategoriaId INT NOT NULL,
    UnidadMedidaId INT NOT NULL,
    EstaActivo BIT NOT NULL DEFAULT 1,
    FOREIGN KEY (CategoriaId) REFERENCES Productos.Categoria(CategoriaId),
    FOREIGN KEY (UnidadMedidaId) REFERENCES Productos.UnidadMedida(UnidadMedidaId)
);

CREATE TABLE Productos.Variantes (
    VarianteId INT IDENTITY PRIMARY KEY,
    ProductoId INT NOT NULL,
    Nombre NVARCHAR(100) NOT NULL,
    Valor NVARCHAR(100) NOT NULL,
    EstaActivo BIT NOT NULL DEFAULT 1,
    FOREIGN KEY (ProductoId) REFERENCES Productos.Producto(ProductoId)
);

-- =========================
-- FINANZAS
-- =========================

CREATE TABLE Finanzas.Moneda (
    MonedaId INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL,
    Simbolo NVARCHAR(10)
);

-- =========================
-- VENTAS
-- =========================

CREATE TABLE Ventas.Venta (
    VentaId INT IDENTITY PRIMARY KEY,
    ClienteId INT NOT NULL,
    FechaVenta DATETIME NOT NULL DEFAULT GETDATE(),
    Total DECIMAL(10,2) NOT NULL,
    DescuentoTotal DECIMAL(10,2) DEFAULT 0,
    Observacion NVARCHAR(255),
    MonedaId INT NOT NULL,
    FOREIGN KEY (ClienteId) REFERENCES Personas.Cliente(ClienteId),
    FOREIGN KEY (MonedaId) REFERENCES Finanzas.Moneda(MonedaId)
);

CREATE TABLE Ventas.DetalleVenta (
    DetalleVentaId INT IDENTITY PRIMARY KEY,
    VentaId INT NOT NULL,
    ProductoId INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(10,2) NOT NULL,
    Descuento DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (VentaId) REFERENCES Ventas.Venta(VentaId),
    FOREIGN KEY (ProductoId) REFERENCES Productos.Producto(ProductoId)
);

CREATE TABLE Ventas.MetodoPago (
    MetodoPagoId INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL
);

CREATE TABLE Ventas.Pago (
    PagoId INT IDENTITY PRIMARY KEY,
    VentaId INT NOT NULL,
    MetodoPagoId INT NOT NULL,
    Monto DECIMAL(10,2) NOT NULL,
    FechaPago DATETIME NOT NULL DEFAULT GETDATE(),
    MonedaId INT NOT NULL,
    FOREIGN KEY (VentaId) REFERENCES Ventas.Venta(VentaId),
    FOREIGN KEY (MetodoPagoId) REFERENCES Ventas.MetodoPago(MetodoPagoId),
    FOREIGN KEY (MonedaId) REFERENCES Finanzas.Moneda(MonedaId)
);

-- Tablas nuevas: Devoluciones

CREATE TABLE Ventas.Devolucion (
    DevolucionId INT IDENTITY PRIMARY KEY,
    VentaId INT NOT NULL,
    FechaDevolucion DATETIME NOT NULL DEFAULT GETDATE(),
    Motivo NVARCHAR(255),
    TotalDevuelto DECIMAL(10,2) NOT NULL,
    UsuarioId INT NOT NULL,
    FOREIGN KEY (VentaId) REFERENCES Ventas.Venta(VentaId),
    FOREIGN KEY (UsuarioId) REFERENCES Seguridad.Usuario(UsuarioId)
);

CREATE TABLE Ventas.DetalleDevolucion (
    DetalleDevolucionId INT IDENTITY PRIMARY KEY,
    DevolucionId INT NOT NULL,
    ProductoId INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (DevolucionId) REFERENCES Ventas.Devolucion(DevolucionId),
    FOREIGN KEY (ProductoId) REFERENCES Productos.Producto(ProductoId)
);

-- =========================
-- CAJA
-- =========================

CREATE TABLE Caja.CajaDiaria (
    CajaDiariaId INT IDENTITY PRIMARY KEY,
    UsuarioId INT NOT NULL,
    Fecha DATE NOT NULL,
    MontoApertura DECIMAL(10,2) NOT NULL,
    Estado NVARCHAR(50) NOT NULL,
    FOREIGN KEY (UsuarioId) REFERENCES Seguridad.Usuario(UsuarioId)
);

-- =========================
-- CONFIGURACION
-- =========================

CREATE TABLE Configuracion.ParametroSistema (
    ParametroSistemaId INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Valor NVARCHAR(255) NOT NULL,
    Descripcion NVARCHAR(255)
);

-- =========================
-- COMPRAS
-- =========================

CREATE TABLE Compras.OrdenCompra (
    OrdenCompraId INT IDENTITY PRIMARY KEY,
    ProveedorId INT NOT NULL,
    FechaOrden DATETIME NOT NULL DEFAULT GETDATE(),
    Estado NVARCHAR(50) NOT NULL,
    Total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (ProveedorId) REFERENCES Personas.Proveedor(ProveedorId)
);

CREATE TABLE Compras.DetalleOrdenCompra (
    DetalleOrdenCompraId INT IDENTITY PRIMARY KEY,
    OrdenCompraId INT NOT NULL,
    ProductoId INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (OrdenCompraId) REFERENCES Compras.OrdenCompra(OrdenCompraId),
    FOREIGN KEY (ProductoId) REFERENCES Productos.Producto(ProductoId)
);
