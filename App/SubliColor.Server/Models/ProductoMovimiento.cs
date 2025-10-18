using System;
using System.Collections.Generic;

namespace SubliColor.Server.Models;

public partial class ProductoMovimiento
{
    public int IdMovimientoProducto { get; set; }

    public int? IdTipoMovimiento { get; set; }

    public string? Referencia { get; set; }

    public string? Comentario { get; set; }

    public bool? EstaActivo { get; set; }

    public int? IdUsuarioCreacion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public int? IdUsuarioModificacion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public virtual ICollection<ProductoMovimientoDetalle> ProductoMovimientoDetalles { get; set; } = new List<ProductoMovimientoDetalle>();
}
