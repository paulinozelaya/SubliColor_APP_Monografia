using System;
using System.Collections.Generic;

namespace SubliColor.Server.Models;

public partial class Compra
{
    public int IdCompra { get; set; }

    public int? IdProveedor { get; set; }

    public string? NumeroFactura { get; set; }

    public DateTime? FechaCompra { get; set; }

    public decimal? SubTotal { get; set; }

    public decimal? Descuento { get; set; }

    public decimal? Total { get; set; }

    public string? Observacion { get; set; }

    public bool? EstaActivo { get; set; }

    public int? IdUsuarioCreacion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public int? IdUsuarioModificacion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public virtual ICollection<DetalleCompra> DetalleCompras { get; set; } = new List<DetalleCompra>();

    public virtual ICollection<DevolucionCompra> DevolucionCompras { get; set; } = new List<DevolucionCompra>();

    public virtual Proveedor? IdProveedorNavigation { get; set; }
}
