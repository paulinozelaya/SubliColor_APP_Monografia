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
INSERT INTO Seguridad.Usuario
    (PersonaId, Email, NombreUsuario, ContrasenaHash, EstaActivo, EstaBloqueado, IntentosFallidos, FechaBloqueo, FechaModificacion)
VALUES
    -- Usuario activo, sin bloqueo, sin intentos fallidos
    ((SELECT PersonaId FROM Personas.Persona WHERE Nombre = 'Juan' AND Apellido = 'Pérez'),
     'juan.perez@example.com',
     'juanp',
     HASHBYTES('SHA2_256', CONVERT(VARBINARY, 'Password123!')),  -- Ejemplo de hash
     1, 0, 0, NULL, GETDATE()),

    -- Usuario activo, con intentos fallidos
    ((SELECT PersonaId FROM Personas.Persona WHERE Nombre = 'María' AND Apellido = 'González'),
     'maria.gonzalez@example.com',
     'mariag',
     HASHBYTES('SHA2_256', CONVERT(VARBINARY, 'Password456!')),
     1, 0, 2, NULL, GETDATE()),

    -- Usuario bloqueado
    ((SELECT PersonaId FROM Personas.Persona WHERE Nombre = 'Carlos' AND Apellido = 'Ramírez'),
     'carlos.ramirez@example.com',
     'carlor',
     HASHBYTES('SHA2_256', CONVERT(VARBINARY, 'Password789!')),
     1, 1, 5, GETDATE(), GETDATE());
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
('Taza Blanca', 'Taza de cerámica blanca para sublimar', 100.00, 50, 70, 30, 5, NULL, (SELECT CategoriaId FROM Productos.Categoria WHERE Nombre='Tazas'), (SELECT UnidadMedidaId FROM Productos.UnidadMedida WHERE Nombre='Pieza'), 1),
('Camisa Algodón', 'Camisa blanca de algodón para sublimar', 150.00, 100, 90, 40, 10, NULL, (SELECT CategoriaId FROM Productos.Categoria WHERE Nombre='Ropa'), (SELECT UnidadMedidaId FROM Productos.UnidadMedida WHERE Nombre='Pieza'), 1);
GO

-- Productos.Variantes
INSERT INTO Productos.Variantes (ProductoId, Nombre, Valor, EstaActivo)
VALUES 
((SELECT ProductoId FROM Productos.Producto WHERE Nombre='Camisa Algodón'), 'Talla', 'M', 1),
((SELECT ProductoId FROM Productos.Producto WHERE Nombre='Camisa Algodón'), 'Talla', 'L', 1);
GO

-- Finanzas.Moneda
INSERT INTO Finanzas.Moneda (Nombre, Simbolo)
VALUES ('Sol Peruano', 'S/'), ('Dólar Americano', '$');
GO

-- Ventas.Cliente (ya insertado arriba)

-- Ventas.Venta
INSERT INTO Ventas.Venta (ClienteId, FechaVenta, Total, DescuentoTotal, Observacion, MonedaId)
VALUES
((SELECT ClienteId FROM Personas.Cliente WHERE PersonaId = (SELECT PersonaId FROM Personas.Persona WHERE Nombre='Juan' AND Apellido='Pérez')), GETDATE(), 250.00, 0, 'Venta prueba 1', (SELECT MonedaId FROM Finanzas.Moneda WHERE Nombre='Sol Peruano')),
((SELECT ClienteId FROM Personas.Cliente WHERE PersonaId = (SELECT PersonaId FROM Personas.Persona WHERE Nombre='María' AND Apellido='González')), GETDATE(), 300.00, 10, 'Venta prueba 2', (SELECT MonedaId FROM Finanzas.Moneda WHERE Nombre='Dólar Americano'));
GO

-- Ventas.DetalleVenta
INSERT INTO Ventas.DetalleVenta (VentaId, ProductoId, Cantidad, PrecioUnitario, Descuento)
VALUES
((SELECT VentaId FROM Ventas.Venta WHERE Observacion='Venta prueba 1'), (SELECT ProductoId FROM Productos.Producto WHERE Nombre='Taza Blanca'), 2, 100.00, 0),
((SELECT VentaId FROM Ventas.Venta WHERE Observacion='Venta prueba 1'), (SELECT ProductoId FROM Productos.Producto WHERE Nombre='Camisa Algodón'), 1, 150.00, 0),
((SELECT VentaId FROM Ventas.Venta WHERE Observacion='Venta prueba 2'), (SELECT ProductoId FROM Productos.Producto WHERE Nombre='Camisa Algodón'), 2, 150.00, 10);
GO

-- Ventas.MetodoPago
INSERT INTO Ventas.MetodoPago (Nombre)
VALUES ('Efectivo'), ('Tarjeta'), ('Transferencia');
GO

-- Ventas.Pago
INSERT INTO Ventas.Pago (VentaId, MetodoPagoId, Monto, FechaPago, MonedaId)
VALUES
((SELECT VentaId FROM Ventas.Venta WHERE Observacion='Venta prueba 1'), (SELECT MetodoPagoId FROM Ventas.MetodoPago WHERE Nombre='Efectivo'), 250.00, GETDATE(), (SELECT MonedaId FROM Finanzas.Moneda WHERE Nombre='Sol Peruano')),
((SELECT VentaId FROM Ventas.Venta WHERE Observacion='Venta prueba 2'), (SELECT MetodoPagoId FROM Ventas.MetodoPago WHERE Nombre='Tarjeta'), 290.00, GETDATE(), (SELECT MonedaId FROM Finanzas.Moneda WHERE Nombre='Dólar Americano'));
GO

-- Ventas.Devolucion
INSERT INTO Ventas.Devolucion (VentaId, FechaDevolucion, Motivo, TotalDevuelto, UsuarioId)
VALUES
((SELECT VentaId FROM Ventas.Venta WHERE Observacion='Venta prueba 1'), GETDATE(), 'Producto dañado', 100.00, (SELECT UsuarioId FROM Seguridad.Usuario WHERE NombreUsuario='juanp'));
GO

-- Ventas.DetalleDevolucion
INSERT INTO Ventas.DetalleDevolucion (DevolucionId, ProductoId, Cantidad, PrecioUnitario)
VALUES
((SELECT DevolucionId FROM Ventas.Devolucion WHERE Motivo='Producto dañado'), (SELECT ProductoId FROM Productos.Producto WHERE Nombre='Taza Blanca'), 1, 100.00);
GO

-- Caja.CajaDiaria
INSERT INTO Caja.CajaDiaria (UsuarioId, Fecha, MontoApertura, Estado)
VALUES
((SELECT UsuarioId FROM Seguridad.Usuario WHERE NombreUsuario='juanp'), CAST(GETDATE() AS DATE), 500.00, 'Abierta');
GO

-- Compras.OrdenCompra
INSERT INTO Compras.OrdenCompra (ProveedorId, FechaOrden, Estado, Total)
VALUES
((SELECT ProveedorId FROM Personas.Proveedor WHERE Empresa='Proveedor XYZ'), GETDATE(), 'Pendiente', 1000.00);
GO

-- Compras.DetalleOrdenCompra
INSERT INTO Compras.DetalleOrdenCompra (OrdenCompraId, ProductoId, Cantidad, PrecioUnitario)
VALUES
((SELECT OrdenCompraId FROM Compras.OrdenCompra WHERE Estado='Pendiente'), (SELECT ProductoId FROM Productos.Producto WHERE Nombre='Taza Blanca'), 10, 70.00);
GO
