using System;
using System.Collections.Generic;

namespace SubliColor.Server.Models;

public partial class Producto
{
    public int IdProducto { get; set; }

    public int? IdCategoria { get; set; }

    public string? Codigo { get; set; }

    public string? Nombre { get; set; }

    public string? Descripcion { get; set; }

    public decimal? PrecioVenta { get; set; }

    public int? IdUnidadMedida { get; set; }

    public int? IdEstado { get; set; }

    public bool? EstaActivo { get; set; }

    public int? IdUsuarioCreacion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public int? IdUsuarioModificacion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public virtual ICollection<DetalleCompra> DetalleCompras { get; set; } = new List<DetalleCompra>();

    public virtual ICollection<DetalleDevolucionCompra> DetalleDevolucionCompras { get; set; } = new List<DetalleDevolucionCompra>();

    public virtual ICollection<DetalleDevolucionVenta> DetalleDevolucionVenta { get; set; } = new List<DetalleDevolucionVenta>();

    public virtual ICollection<DetalleVentum> DetalleVenta { get; set; } = new List<DetalleVentum>();

    public virtual ICollection<ProductoExistencia> ProductoExistencia { get; set; } = new List<ProductoExistencia>();

    public virtual ICollection<ProductoMovimientoDetalle> ProductoMovimientoDetalles { get; set; } = new List<ProductoMovimientoDetalle>();

    public virtual Categoria? CategoriaNavigation { get; set; }
}
