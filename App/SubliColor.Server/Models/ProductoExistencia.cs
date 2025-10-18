using System;
using System.Collections.Generic;

namespace SubliColor.Server.Models;

public partial class ProductoExistencia
{
    public int IdProductoExistencia { get; set; }

    public int? IdProducto { get; set; }

    public int? CantidadActual { get; set; }

    public decimal? UltimoCosto { get; set; }

    public decimal? CostoPromedio { get; set; }

    public bool? EstaActivo { get; set; }

    public int? IdUsuarioCreacion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public int? IdUsuarioModificacion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public virtual Producto? IdProductoNavigation { get; set; }
}
