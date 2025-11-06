using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using SubliColor.Server.Models;

namespace SubliColor.Server.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Accion> Accions { get; set; }

    public virtual DbSet<AuditoriaInicioSesion> AuditoriaInicioSesions { get; set; }

    public virtual DbSet<Categoria> Categoria { get; set; }

    public virtual DbSet<Cliente> Clientes { get; set; }

    public virtual DbSet<Compra> Compras { get; set; }

    public virtual DbSet<DetalleCompra> DetalleCompras { get; set; }

    public virtual DbSet<DetalleDevolucionCompra> DetalleDevolucionCompras { get; set; }

    public virtual DbSet<DetalleDevolucionVenta> DetalleDevolucionVenta { get; set; }

    public virtual DbSet<DetalleVentum> DetalleVenta { get; set; }

    public virtual DbSet<DevolucionCompra> DevolucionCompras { get; set; }

    public virtual DbSet<DevolucionVenta> DevolucionVenta { get; set; }

    public virtual DbSet<HistorialClave> HistorialClaves { get; set; }

    public virtual DbSet<Menu> Menus { get; set; }

    public virtual DbSet<Notificacion> Notificacions { get; set; }

    public virtual DbSet<Persona> Personas { get; set; }

    public virtual DbSet<PersonaContacto> PersonaContactos { get; set; }

    public virtual DbSet<PersonaDireccion> PersonaDireccions { get; set; }

    public virtual DbSet<PersonaIdentificacion> PersonaIdentificacions { get; set; }

    public virtual DbSet<PlantillaNotificacion> PlantillaNotificacions { get; set; }

    public virtual DbSet<Producto> Productos { get; set; }

    public virtual DbSet<ProductoExistencia> ProductoExistencia { get; set; }

    public virtual DbSet<ProductoMovimiento> ProductoMovimientos { get; set; }

    public virtual DbSet<ProductoMovimientoDetalle> ProductoMovimientoDetalles { get; set; }

    public virtual DbSet<Proveedor> Proveedors { get; set; }

    public virtual DbSet<Rol> Rols { get; set; }

    public virtual DbSet<RolAccion> RolAccions { get; set; }

    public virtual DbSet<RolMenu> RolMenus { get; set; }

    public virtual DbSet<Token> Tokens { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    public virtual DbSet<UsuarioRol> UsuarioRols { get; set; }

    public virtual DbSet<Valor> Valors { get; set; }

    public virtual DbSet<Venta> Venta { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=PAULINOZELAYA\\SQLEXPRESS01;Database=SubliColorBD2;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Accion>(entity =>
        {
            entity.HasKey(e => e.IdAccion).HasName("PK_IdAccion");

            entity.ToTable("Accion", "Administracion");

            entity.Property(e => e.CodigoInterno).HasMaxLength(100);
            entity.Property(e => e.Descripcion).HasMaxLength(4000);
            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);
            entity.Property(e => e.Nombre).HasMaxLength(255);
        });

        modelBuilder.Entity<AuditoriaInicioSesion>(entity =>
        {
            entity.HasKey(e => e.IdAuditoriaInicioSesion).HasName("PK_IdAuditoriaInicioSession");

            entity.ToTable("AuditoriaInicioSesion", "Seguridad");

            entity.Property(e => e.DireccionIP).HasMaxLength(50);
            entity.Property(e => e.Dispositivo).HasMaxLength(255);
            entity.Property(e => e.FechaFin).HasColumnType("datetime");
            entity.Property(e => e.FechaInicio)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Ubicacion).HasMaxLength(255);

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.AuditoriaInicioSesions)
                .HasForeignKey(d => d.IdUsuario)
                .HasConstraintName("FK_IdAuditoriaInicioSesion_Usuario");
        });

        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.HasKey(e => e.IdCategoria).HasName("PK_IdCategoria");

            entity.ToTable("Categoria", "Administracion");

            entity.Property(e => e.CodigoInterno).HasMaxLength(100);
            entity.Property(e => e.Descripcion).HasMaxLength(300);
            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);
            entity.Property(e => e.Nombre).HasMaxLength(200);
        });

        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.IdCliente).HasName("PK_IdCliente");

            entity.ToTable("Cliente", "Proceso");

            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);

            entity.HasOne(d => d.IdPersonaNavigation).WithMany(p => p.Clientes)
                .HasForeignKey(d => d.IdPersona)
                .HasConstraintName("FK_IdPersona_Cliente");
        });

        modelBuilder.Entity<Compra>(entity =>
        {
            entity.HasKey(e => e.IdCompra).HasName("PK__Compra__0A5CDB5C181115C0");

            entity.ToTable("Compra", "Proceso");

            entity.Property(e => e.Descuento).HasColumnType("money");
            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCompra).HasColumnType("datetime");
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);
            entity.Property(e => e.NumeroFactura).HasMaxLength(255);
            entity.Property(e => e.Observacion).HasMaxLength(4000);
            entity.Property(e => e.SubTotal).HasColumnType("money");
            entity.Property(e => e.Total).HasColumnType("money");

            entity.HasOne(d => d.IdProveedorNavigation).WithMany(p => p.Compras)
                .HasForeignKey(d => d.IdProveedor)
                .HasConstraintName("FK_Compra_Proveedor");
        });

        modelBuilder.Entity<DetalleCompra>(entity =>
        {
            entity.HasKey(e => e.IdDetalleCompra).HasName("PK__DetalleC__E046CCBB6F90F9C9");

            entity.ToTable("DetalleCompra", "Proceso");

            entity.Property(e => e.Descuento).HasColumnType("money");
            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);
            entity.Property(e => e.PrecioUnitario).HasColumnType("money");
            entity.Property(e => e.Total).HasColumnType("money");

            entity.HasOne(d => d.IdCompraNavigation).WithMany(p => p.DetalleCompras)
                .HasForeignKey(d => d.IdCompra)
                .HasConstraintName("FK_DetalleCompra_Compra");

            entity.HasOne(d => d.IdProductoNavigation).WithMany(p => p.DetalleCompras)
                .HasForeignKey(d => d.IdProducto)
                .HasConstraintName("FK_DetalleCompra_Producto");
        });

        modelBuilder.Entity<DetalleDevolucionCompra>(entity =>
        {
            entity.HasKey(e => e.IdDetalleDevolucionCompra).HasName("PK__DetalleD__57038FF02533E0FE");

            entity.ToTable("DetalleDevolucionCompra", "Proceso");

            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);
            entity.Property(e => e.PrecioUnitario).HasColumnType("money");
            entity.Property(e => e.SubTotalDevuelto).HasColumnType("money");
            entity.Property(e => e.TotalDevuelto).HasColumnType("money");

            entity.HasOne(d => d.IdDevolucionCompraNavigation).WithMany(p => p.DetalleDevolucionCompras)
                .HasForeignKey(d => d.IdDevolucionCompra)
                .HasConstraintName("FK_DetalleDevolucionCompra_Devolucion");

            entity.HasOne(d => d.IdProductoNavigation).WithMany(p => p.DetalleDevolucionCompras)
                .HasForeignKey(d => d.IdProducto)
                .HasConstraintName("FK_DetalleDevolucionCompra_Producto");
        });

        modelBuilder.Entity<DetalleDevolucionVenta>(entity =>
        {
            entity.HasKey(e => e.IdDetalleDevolucionVenta).HasName("PK__DetalleD__1C8E38ECCB250518");

            entity.ToTable("DetalleDevolucionVenta", "Proceso");

            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);
            entity.Property(e => e.PrecioUnitario).HasColumnType("money");
            entity.Property(e => e.SubTotalDevuelto).HasColumnType("money");
            entity.Property(e => e.TotalDevuelto).HasColumnType("money");

            entity.HasOne(d => d.IdDevolucionVentaNavigation).WithMany(p => p.DetalleDevolucionVenta)
                .HasForeignKey(d => d.IdDevolucionVenta)
                .HasConstraintName("FK_DetalleDevolucionVenta_Devolucion");

            entity.HasOne(d => d.IdProductoNavigation).WithMany(p => p.DetalleDevolucionVenta)
                .HasForeignKey(d => d.IdProducto)
                .HasConstraintName("FK_DetalleDevolucionVenta_Producto");
        });

        modelBuilder.Entity<DetalleVentum>(entity =>
        {
            entity.HasKey(e => e.IdDetalleVenta).HasName("PK_IdDetalleVenta");

            entity.ToTable("DetalleVenta", "Proceso");

            entity.Property(e => e.Descuento).HasColumnType("money");
            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);
            entity.Property(e => e.PrecioTotal).HasColumnType("money");
            entity.Property(e => e.PrecioUnitario).HasColumnType("money");

            entity.HasOne(d => d.IdProductoNavigation).WithMany(p => p.DetalleVenta)
                .HasForeignKey(d => d.IdProducto)
                .HasConstraintName("FK_IdProducto_DetalleVenta");

            entity.HasOne(d => d.IdVentaNavigation).WithMany(p => p.DetalleVenta)
                .HasForeignKey(d => d.IdVenta)
                .HasConstraintName("FK_IdVenta_DetalleVenta");
        });

        modelBuilder.Entity<DevolucionCompra>(entity =>
        {
            entity.HasKey(e => e.IdDevolucionCompra).HasName("PK__Devoluci__CA3D4B177EE1C30D");

            entity.ToTable("DevolucionCompra", "Proceso");

            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaDevolucion).HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);
            entity.Property(e => e.Motivo).HasMaxLength(4000);
            entity.Property(e => e.TotalDevuelto).HasColumnType("money");

            entity.HasOne(d => d.IdCompraNavigation).WithMany(p => p.DevolucionCompras)
                .HasForeignKey(d => d.IdCompra)
                .HasConstraintName("FK_DevolucionCompra_Compra");
        });

        modelBuilder.Entity<DevolucionVenta>(entity =>
        {
            entity.HasKey(e => e.IdDevolucionVenta).HasName("PK__Devoluci__9E78BF104A2202E5");

            entity.ToTable("DevolucionVenta", "Proceso");

            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaDevolucion).HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);
            entity.Property(e => e.Motivo).HasMaxLength(4000);
            entity.Property(e => e.TotalDevuelto).HasColumnType("money");

            entity.HasOne(d => d.IdVentaNavigation).WithMany(p => p.DevolucionVenta)
                .HasForeignKey(d => d.IdVenta)
                .HasConstraintName("FK_DevolucionVenta_Venta");
        });

        modelBuilder.Entity<HistorialClave>(entity =>
        {
            entity.HasKey(e => e.IdHistorialClave).HasName("PK_IdHistorialClave");

            entity.ToTable("HistorialClave", "Seguridad");

            entity.Property(e => e.Clave).HasMaxLength(255);
            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.HistorialClaves)
                .HasForeignKey(d => d.IdUsuario)
                .HasConstraintName("FK_IdUsuario_HistorialClave");
        });

        modelBuilder.Entity<Menu>(entity =>
        {
            entity.HasKey(e => e.IdMenu).HasName("PK_IdMenu");

            entity.ToTable("Menu", "Administracion");

            entity.Property(e => e.CodigoInterno).HasMaxLength(255);
            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);
            entity.Property(e => e.Nombre).HasMaxLength(255);
        });

        modelBuilder.Entity<Notificacion>(entity =>
        {
            entity.HasKey(e => e.IdNotificacion).HasName("PK_IdNotificacion");

            entity.ToTable("Notificacion", "Seguridad");

            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);
            entity.Property(e => e.Notificacion1)
                .HasMaxLength(8000)
                .IsUnicode(false)
                .HasColumnName("Notificacion");

            entity.HasOne(d => d.IdPlantillaNotificacionNavigation).WithMany(p => p.Notificacions)
                .HasForeignKey(d => d.IdPlantillaNotificacion)
                .HasConstraintName("FK_IdPlantillaNotificacion_Notificacion");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.Notificacions)
                .HasForeignKey(d => d.IdUsuario)
                .HasConstraintName("FK_IdUsuario_Notificacion");
        });

        modelBuilder.Entity<Persona>(entity =>
        {
            entity.HasKey(e => e.IdPersona).HasName("PK_IdPersona");

            entity.ToTable("Persona", "Administracion");

            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);
            entity.Property(e => e.PrimerApellido).HasMaxLength(100);
            entity.Property(e => e.PrimerNombre).HasMaxLength(100);
            entity.Property(e => e.SegundoApellido).HasMaxLength(100);
            entity.Property(e => e.SegundoNombre).HasMaxLength(100);
        });

        modelBuilder.Entity<PersonaContacto>(entity =>
        {
            entity.HasKey(e => e.IdPersonaContacto).HasName("PK_IdPersonaContacto");

            entity.ToTable("PersonaContacto", "Administracion");

            entity.Property(e => e.Contacto).HasMaxLength(255);
            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);

            entity.HasOne(d => d.IdPersonaNavigation).WithMany(p => p.PersonaContactos)
                .HasForeignKey(d => d.IdPersona)
                .HasConstraintName("FK_IdPersona_PersonaContacto");
        });

        modelBuilder.Entity<PersonaDireccion>(entity =>
        {
            entity.HasKey(e => e.IdPersonaDireccion).HasName("PK_IdPersonaDireccion");

            entity.ToTable("PersonaDireccion", "Administracion");

            entity.Property(e => e.Direccion).HasMaxLength(255);
            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);

            entity.HasOne(d => d.IdPersonaNavigation).WithMany(p => p.PersonaDireccions)
                .HasForeignKey(d => d.IdPersona)
                .HasConstraintName("FK_IdPersona_PersonaDireccion");
        });

        modelBuilder.Entity<PersonaIdentificacion>(entity =>
        {
            entity.HasKey(e => e.IdPersonaIdentificacion).HasName("PK_IdPersonaIdentificacion");

            entity.ToTable("PersonaIdentificacion", "Administracion");

            entity.Property(e => e.Identificacion).HasMaxLength(255);
            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);

            entity.HasOne(d => d.IdPersonaNavigation).WithMany(p => p.PersonaIdentificacions)
                .HasForeignKey(d => d.IdPersona)
                .HasConstraintName("FK_IdPersona_PersonaIdentificacion");
        });

        modelBuilder.Entity<PlantillaNotificacion>(entity =>
        {
            entity.HasKey(e => e.IdPlantillaNotificacion).HasName("PK_IdPlantillaNotificacion");

            entity.ToTable("PlantillaNotificacion", "Administracion");

            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);
            entity.Property(e => e.Plantilla)
                .HasMaxLength(8000)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Producto>(entity =>
        {
            entity.HasKey(e => e.IdProducto).HasName("PK_IdProducto");

            entity.ToTable("Producto", "Proceso");

            entity.Property(e => e.Codigo).HasMaxLength(255);
            entity.Property(e => e.Descripcion).HasMaxLength(4000);
            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);
            entity.Property(e => e.Nombre).HasMaxLength(1000);
            entity.Property(e => e.PrecioVenta).HasColumnType("money");
        });

        modelBuilder.Entity<ProductoExistencia>(entity =>
        {
            entity.HasKey(e => e.IdProductoExistencia).HasName("PK_IdProductoExistencia");

            entity.ToTable("ProductoExistencia", "Proceso");

            entity.Property(e => e.CostoPromedio).HasColumnType("money");
            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);
            entity.Property(e => e.UltimoCosto).HasColumnType("money");

            entity.HasOne(d => d.IdProductoNavigation).WithMany(p => p.ProductoExistencia)
                .HasForeignKey(d => d.IdProducto)
                .HasConstraintName("FK_IdProducto_ProductoExistencia");
        });

        modelBuilder.Entity<ProductoMovimiento>(entity =>
        {
            entity.HasKey(e => e.IdMovimientoProducto).HasName("PK_IdMovimientoProducto");

            entity.ToTable("ProductoMovimiento", "Proceso");

            entity.Property(e => e.IdMovimientoProducto).ValueGeneratedNever();
            entity.Property(e => e.Comentario).HasMaxLength(4000);
            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);
            entity.Property(e => e.Referencia).HasMaxLength(255);
        });

        modelBuilder.Entity<ProductoMovimientoDetalle>(entity =>
        {
            entity.HasKey(e => e.IdProductoMovimientoDetalle).HasName("PK_IdProductoMovimientoDetalle");

            entity.ToTable("ProductoMovimientoDetalle", "Proceso");

            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);
            entity.Property(e => e.PrecioUnitario).HasColumnType("money");

            entity.HasOne(d => d.IdMovimientoProductoNavigation).WithMany(p => p.ProductoMovimientoDetalles)
                .HasForeignKey(d => d.IdMovimientoProducto)
                .HasConstraintName("FK_IdMovimientoProducto_ProductoMovimientoDetalle");

            entity.HasOne(d => d.IdProductoNavigation).WithMany(p => p.ProductoMovimientoDetalles)
                .HasForeignKey(d => d.IdProducto)
                .HasConstraintName("FK_IdProducto_ProductoMovimientoDetalle");
        });

        modelBuilder.Entity<Proveedor>(entity =>
        {
            entity.HasKey(e => e.IdProveedor).HasName("PK__Proveedo__E8B631AFCE476D90");

            entity.ToTable("Proveedor", "Proceso");

            entity.Property(e => e.Correo).HasMaxLength(100);
            entity.Property(e => e.Direccion).HasMaxLength(300);
            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);
            entity.Property(e => e.NombreProveedor).HasMaxLength(200);
            entity.Property(e => e.RUC).HasMaxLength(50);
            entity.Property(e => e.Telefono).HasMaxLength(50);
        });

        modelBuilder.Entity<Rol>(entity =>
        {
            entity.HasKey(e => e.IdRol).HasName("PK_IdRol");

            entity.ToTable("Rol", "Administracion");

            entity.Property(e => e.CodigoInterno).HasMaxLength(100);
            entity.Property(e => e.Descripcion).HasMaxLength(4000);
            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);
            entity.Property(e => e.Nombre).HasMaxLength(255);
        });

        modelBuilder.Entity<RolAccion>(entity =>
        {
            entity.HasKey(e => e.IdRolAccion).HasName("PK_IdRolAccion");

            entity.ToTable("RolAccion", "Administracion");

            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);

            entity.HasOne(d => d.IdAccionNavigation).WithMany(p => p.RolAccions)
                .HasForeignKey(d => d.IdAccion)
                .HasConstraintName("FK_IdAccion_RolAccion");

            entity.HasOne(d => d.IdRolNavigation).WithMany(p => p.RolAccions)
                .HasForeignKey(d => d.IdRol)
                .HasConstraintName("FK_IdRol_RolAccion");
        });

        modelBuilder.Entity<RolMenu>(entity =>
        {
            entity.HasKey(e => e.IdRolMenu).HasName("PK_IdRolMenu");

            entity.ToTable("RolMenu", "Administracion");

            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);

            entity.HasOne(d => d.IdMenuNavigation).WithMany(p => p.RolMenus)
                .HasForeignKey(d => d.IdMenu)
                .HasConstraintName("FK_RolMenu_Menu");

            entity.HasOne(d => d.IdRolNavigation).WithMany(p => p.RolMenus)
                .HasForeignKey(d => d.IdRol)
                .HasConstraintName("FK_RolMenu_Rol");
        });

        modelBuilder.Entity<Token>(entity =>
        {
            entity.HasKey(e => e.IdToken).HasName("PK_IdToken");

            entity.ToTable("Token", "Seguridad");

            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaExpiracion).HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);
            entity.Property(e => e.Token1)
                .HasMaxLength(255)
                .HasColumnName("Token");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.Tokens)
                .HasForeignKey(d => d.IdUsuario)
                .HasConstraintName("FK_IdUsuario_Token");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.IdUsuario).HasName("PK_IdUsuario");

            entity.ToTable("Usuario", "Seguridad");

            entity.Property(e => e.Clave).HasMaxLength(255);
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaBloqueo).HasColumnType("datetime");
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaExpiracion).HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);
            entity.Property(e => e.Usuario1)
                .HasMaxLength(100)
                .HasColumnName("Usuario");

            entity.HasOne(d => d.IdPersonaNavigation).WithMany(p => p.Usuarios)
                .HasForeignKey(d => d.IdPersona)
                .HasConstraintName("FK_IdPersona_Notificacion");
        });

        modelBuilder.Entity<UsuarioRol>(entity =>
        {
            entity.HasKey(e => e.IdUsuarioRol).HasName("PK_IdUsuarioRol");

            entity.ToTable("UsuarioRol", "Administracion");

            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);

            entity.HasOne(d => d.IdRolNavigation).WithMany(p => p.UsuarioRols)
                .HasForeignKey(d => d.IdRol)
                .HasConstraintName("FK_IdRol_UsuarioRol");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.UsuarioRols)
                .HasForeignKey(d => d.IdUsuario)
                .HasConstraintName("FK_IdUsuario_RolAccion");
        });

        modelBuilder.Entity<Valor>(entity =>
        {
            entity.HasKey(e => e.IdValor).HasName("PK_IdValor");

            entity.ToTable("Valor", "Administracion");

            entity.Property(e => e.CodigoInterno).HasMaxLength(100);
            entity.Property(e => e.Descripcion).HasMaxLength(300);
            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);
            entity.Property(e => e.Nombre).HasMaxLength(200);

            entity.HasOne(d => d.IdCategoriaNavigation).WithMany(p => p.Valors)
                .HasForeignKey(d => d.IdCategoria)
                .HasConstraintName("FK_IdCategoria_Valor");
        });

        modelBuilder.Entity<Venta>(entity =>
        {
            entity.HasKey(e => e.IdVenta).HasName("PK_IdVenta");

            entity.ToTable("Venta", "Proceso");

            entity.Property(e => e.Descuento).HasColumnType("money");
            entity.Property(e => e.EstaActivo).HasDefaultValue(true);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.IdMetodoPago).HasMaxLength(255);
            entity.Property(e => e.IdUsuarioCreacion).HasDefaultValue(1);
            entity.Property(e => e.NumeroFactura).HasMaxLength(255);
            entity.Property(e => e.Observacion).HasMaxLength(4000);
            entity.Property(e => e.SubTotal).HasColumnType("money");
            entity.Property(e => e.Total).HasColumnType("money");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.Venta)
                .HasForeignKey(d => d.IdCliente)
                .HasConstraintName("FK_IdCliente_Notificacion");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
