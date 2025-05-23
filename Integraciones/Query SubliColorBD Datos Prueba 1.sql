USE SubliColorBD1;
GO

-- Personas.Persona
INSERT INTO Personas.Persona (Nombre, Apellido, Telefono, Email, TipoIdentificacion, NumeroIdentificacion, FechaNacimiento, Sexo, Facebook, Instagram, Twitter)
VALUES 
('Juan', 'Pérez', '555-1234', 'juan.perez@example.com', 'DNI', '12345678', '1985-04-12', 'M', 'juanperezfb', 'juanperezig', 'juanpereztw'),
('María', 'González', '555-5678', 'maria.gonzalez@example.com', 'DNI', '87654321', '1990-09-23', 'F', 'mariagonzfb', 'mariagonzig', 'mariagonztw'),
('Carlos', 'Ramírez', '555-9876', 'carlos.ramirez@example.com', 'DNI', '11223344', '1980-02-18', 'M', NULL, NULL, NULL),
('Ana', 'López', '555-6543', 'ana.lopez@example.com', 'DNI', '44332211', '1995-07-30', 'F', 'analopezfb', 'analopezig', NULL);
GO

-- Personas.Cliente
INSERT INTO Personas.Cliente (PersonaId)
SELECT PersonaId FROM Personas.Persona;
GO

-- Personas.Proveedor
INSERT INTO Personas.Proveedor (PersonaId, Empresa)
VALUES 
((SELECT PersonaId FROM Personas.Persona WHERE Nombre='Carlos' AND Apellido='Ramírez'), 'Proveedor XYZ'),
((SELECT PersonaId FROM Personas.Persona WHERE Nombre='Ana' AND Apellido='López'), 'Proveedor ABC');
GO

-- Seguridad.Usuario
INSERT INTO Seguridad.Usuario (PersonaId, Email, NombreUsuario, ContrasenaHash, EstaActivo, EstaBloqueado, IntentosFallidos, FechaBloqueo, FechaModificacion)
VALUES
(
    (SELECT PersonaId FROM Personas.Persona WHERE Nombre='Juan' AND Apellido='Pérez'),
    'juan.perez@example.com', 'juanp', 'hashed_password1', 1, 0, 0, NULL, GETDATE()
),
(
    (SELECT PersonaId FROM Personas.Persona WHERE Nombre='María' AND Apellido='González'),
    'maria.gonzalez@example.com', 'mariag', 'hashed_password2', 1, 0, 0, NULL, GETDATE()
);
GO


-- Seguridad.Rol
INSERT INTO Seguridad.Rol (Nombre, Descripcion)
VALUES ('Admin', 'Administrador del sistema'),
       ('Vendedor', 'Usuario que realiza ventas');
GO

-- Seguridad.UsuarioRol
INSERT INTO Seguridad.UsuarioRol (UsuarioId, RolId, EstaActivo)
VALUES 
((SELECT UsuarioId FROM Seguridad.Usuario WHERE NombreUsuario='juanp'), (SELECT RolId FROM Seguridad.Rol WHERE Nombre='Admin'), 1),
((SELECT UsuarioId FROM Seguridad.Usuario WHERE NombreUsuario='mariag'), (SELECT RolId FROM Seguridad.Rol WHERE Nombre='Vendedor'), 1);
GO

-- Productos.Categoria
INSERT INTO Productos.Categoria (Nombre, CategoriaPadreId, EstaActivo)
VALUES ('Tazas', NULL, 1),
       ('Ropa', NULL, 1),
       ('Gorras', NULL, 1),
       ('Tazas Personalizadas', (SELECT CategoriaId FROM Productos.Categoria WHERE Nombre='Tazas'), 1);
GO

-- Productos.UnidadMedida
INSERT INTO Productos.UnidadMedida (Nombre)
VALUES ('Pieza'), ('Paquete'), ('Litro');
GO

-- Productos.Producto
INSERT INTO Productos.Producto (Nombre, Descripcion, Precio, Stock, Costo, MargenGanancia, StockMinimo, Imagen, CategoriaId, UnidadMedidaId, EstaActivo)
VALUES 
('Taza Blanca', 'Taza de cerámica blanca', 50.00, 100, 20.00, 150, 10, 'taza_blanca.jpg', (SELECT CategoriaId FROM Productos.Categoria WHERE Nombre='Tazas'), (SELECT UnidadMedidaId FROM Productos.UnidadMedida WHERE Nombre='Pieza'), 1),
('Gorra Negra', 'Gorra ajustable negra', 120.00, 50, 70.00, 71.42, 5, 'gorra_negra.jpg', (SELECT CategoriaId FROM Productos.Categoria WHERE Nombre='Gorras'), (SELECT UnidadMedidaId FROM Productos.UnidadMedida WHERE Nombre='Pieza'), 1);
GO

-- Productos.Variantes
INSERT INTO Productos.Variantes (ProductoId, Nombre, Valor, EstaActivo)
VALUES 
((SELECT ProductoId FROM Productos.Producto WHERE Nombre='Taza Blanca'), 'Color', 'Blanco', 1),
((SELECT ProductoId FROM Productos.Producto WHERE Nombre='Gorra Negra'), 'Talla', 'Única', 1);
GO

-- Productos.Combo
INSERT INTO Productos.Combo (Nombre, Precio, EstaActivo)
VALUES ('Combo Taza + Gorra', 160.00, 1);
GO

-- Productos.ComboDetalle
INSERT INTO Productos.ComboDetalle (ComboId, ProductoId, Cantidad)
VALUES 
((SELECT ComboId FROM Productos.Combo WHERE Nombre='Combo Taza + Gorra'), (SELECT ProductoId FROM Productos.Producto WHERE Nombre='Taza Blanca'), 1),
((SELECT ComboId FROM Productos.Combo WHERE Nombre='Combo Taza + Gorra'), (SELECT ProductoId FROM Productos.Producto WHERE Nombre='Gorra Negra'), 1);
GO

-- Ventas.Venta
INSERT INTO Ventas.Venta (ClienteId, FechaVenta, Total, DescuentoTotal, Observacion, MonedaId)
VALUES 
((SELECT ClienteId FROM Personas.Cliente WHERE PersonaId = (SELECT PersonaId FROM Personas.Persona WHERE Nombre='Juan' AND Apellido='Pérez')), GETDATE(), 170.00, 10.00, 'Venta por promoción', 1),
((SELECT ClienteId FROM Personas.Cliente WHERE PersonaId = (SELECT PersonaId FROM Personas.Persona WHERE Nombre='María' AND Apellido='González')), GETDATE(), 50.00, 0, NULL, 1);
GO

-- Ventas.DetalleVenta
INSERT INTO Ventas.DetalleVenta (VentaId, ProductoId, Cantidad, PrecioUnitario, Descuento)
VALUES
((SELECT TOP 1 VentaId FROM Ventas.Venta WHERE ClienteId = (SELECT ClienteId FROM Personas.Cliente WHERE PersonaId = (SELECT PersonaId FROM Personas.Persona WHERE Nombre='Juan' AND Apellido='Pérez')) ORDER BY FechaVenta DESC), 
 (SELECT ProductoId FROM Productos.Producto WHERE Nombre='Gorra Negra'), 1, 120.00, 0),
((SELECT TOP 1 VentaId FROM Ventas.Venta WHERE ClienteId = (SELECT ClienteId FROM Personas.Cliente WHERE PersonaId = (SELECT PersonaId FROM Personas.Persona WHERE Nombre='Juan' AND Apellido='Pérez')) ORDER BY FechaVenta DESC),
 (SELECT ProductoId FROM Productos.Producto WHERE Nombre='Taza Blanca'), 1, 50.00, 10.00),
((SELECT TOP 1 VentaId FROM Ventas.Venta WHERE ClienteId = (SELECT ClienteId FROM Personas.Cliente WHERE PersonaId = (SELECT PersonaId FROM Personas.Persona WHERE Nombre='María' AND Apellido='González')) ORDER BY FechaVenta DESC),
 (SELECT ProductoId FROM Productos.Producto WHERE Nombre='Taza Blanca'), 1, 50.00, 0);
GO

-- Ventas.MetodoPago
INSERT INTO Ventas.MetodoPago (Nombre)
VALUES ('Efectivo'), ('Tarjeta Crédito'), ('Transferencia');
GO

-- Ventas.Pago
INSERT INTO Ventas.Pago (VentaId, MetodoPagoId, Monto, FechaPago, MonedaId)
VALUES
((SELECT TOP 1 VentaId FROM Ventas.Venta WHERE ClienteId = (SELECT ClienteId FROM Personas.Cliente WHERE PersonaId = (SELECT PersonaId FROM Personas.Persona WHERE Nombre='Juan' AND Apellido='Pérez')) ORDER BY FechaVenta DESC), 
 (SELECT MetodoPagoId FROM Ventas.MetodoPago WHERE Nombre = 'Tarjeta Crédito'), 160.00, GETDATE(), 1),
((SELECT TOP 1 VentaId FROM Ventas.Venta WHERE ClienteId = (SELECT ClienteId FROM Personas.Cliente WHERE PersonaId = (SELECT PersonaId FROM Personas.Persona WHERE Nombre='María' AND Apellido='González')) ORDER BY FechaVenta DESC),
 (SELECT MetodoPagoId FROM Ventas.MetodoPago WHERE Nombre = 'Efectivo'), 50.00, GETDATE(), 1);
GO

-- Caja.CajaDiaria
INSERT INTO Caja.CajaDiaria (UsuarioId, Fecha, MontoApertura, Estado)
VALUES
((SELECT UsuarioId FROM Seguridad.Usuario WHERE NombreUsuario='juanp'), CAST(GETDATE() AS DATE), 1000.00, 'Abierta');
GO

-- Fidelizacion.PuntosCliente
INSERT INTO Fidelizacion.PuntosCliente (ClienteId, PuntosAcumulados)
VALUES
((SELECT ClienteId FROM Personas.Cliente WHERE PersonaId = (SELECT PersonaId FROM Personas.Persona WHERE Nombre='Juan' AND Apellido='Pérez')), 150),
((SELECT ClienteId FROM Personas.Cliente WHERE PersonaId = (SELECT PersonaId FROM Personas.Persona WHERE Nombre='María' AND Apellido='González')), 80);
GO

-- Compras.OrdenCompra
INSERT INTO Compras.OrdenCompra (ProveedorId, FechaOrden, Estado, Total)
VALUES 
((SELECT ProveedorId FROM Personas.Proveedor WHERE Empresa = 'Proveedor XYZ'), GETDATE(), 'Pendiente', 2000.00);
GO

-- Compras.DetalleOrdenCompra
INSERT INTO Compras.DetalleOrdenCompra (OrdenCompraId, ProductoId, Cantidad, PrecioUnitario)
VALUES 
((SELECT TOP 1 OrdenCompraId FROM Compras.OrdenCompra ORDER BY FechaOrden DESC), (SELECT ProductoId FROM Productos.Producto WHERE Nombre='Taza Blanca'), 50, 18.00);
GO
