using System;
using System.Collections.Generic;

namespace SubliColor.Server.Models;

public partial class DetalleDevolucionVenta
{
    public int IdDetalleDevolucionVenta { get; set; }

    public int? IdDevolucionVenta { get; set; }

    public int? IdProducto { get; set; }

    public int? CantidadDevuelta { get; set; }

    public decimal? PrecioUnitario { get; set; }

    public decimal? SubTotalDevuelto { get; set; }

    public decimal? TotalDevuelto { get; set; }

    public bool? EstaActivo { get; set; }

    public int? IdUsuarioCreacion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public int? IdUsuarioModificacion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public virtual DevolucionVenta? IdDevolucionVentaNavigation { get; set; }

    public virtual Producto? IdProductoNavigation { get; set; }
}
