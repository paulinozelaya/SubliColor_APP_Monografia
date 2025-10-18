using System;
using System.Collections.Generic;

namespace SubliColor.Server.Models;

public partial class ProductoMovimientoDetalle
{
    public int IdProductoMovimientoDetalle { get; set; }

    public int? IdProducto { get; set; }

    public int? IdMovimientoProducto { get; set; }

    public int? Cantidad { get; set; }

    public decimal? PrecioUnitario { get; set; }

    public bool? EstaActivo { get; set; }

    public int? IdUsuarioCreacion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public int? IdUsuarioModificacion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public virtual ProductoMovimiento? IdMovimientoProductoNavigation { get; set; }

    public virtual Producto? IdProductoNavigation { get; set; }
}
