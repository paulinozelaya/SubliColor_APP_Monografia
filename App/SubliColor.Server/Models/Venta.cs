using System;
using System.Collections.Generic;

namespace SubliColor.Server.Models;

public partial class Venta
{
    public int IdVenta { get; set; }

    public int? IdCliente { get; set; }

    public string? NumeroFactura { get; set; }

    public decimal? SubTotal { get; set; }

    public decimal? Descuento { get; set; }

    public decimal? Total { get; set; }

    public int? IdMetodoPago { get; set; }

    public string? Observacion { get; set; }

    public int? IdEstado { get; set; }

    public int? IdUsuarioPedido { get; set; }

    public int? IdUsuarioCaja { get; set; }

    public bool? EstaPagado { get; set; }

    public bool? EstaActivo { get; set; }

    public int? IdUsuarioCreacion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public int? IdUsuarioModificacion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public virtual ICollection<DetalleVentum> DetalleVenta { get; set; } = new List<DetalleVentum>();

    public virtual ICollection<DevolucionVenta> DevolucionVenta { get; set; } = new List<DevolucionVenta>();

    public virtual Cliente? IdClienteNavigation { get; set; }
}
