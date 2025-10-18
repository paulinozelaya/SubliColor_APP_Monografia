using System;
using System.Collections.Generic;

namespace SubliColor.Server.Models;

public partial class DevolucionVenta
{
    public int IdDevolucionVenta { get; set; }

    public int? IdVenta { get; set; }

    public DateTime? FechaDevolucion { get; set; }

    public string? Motivo { get; set; }

    public decimal? TotalDevuelto { get; set; }

    public bool? EstaActivo { get; set; }

    public int? IdUsuarioCreacion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public int? IdUsuarioModificacion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public virtual ICollection<DetalleDevolucionVenta> DetalleDevolucionVenta { get; set; } = new List<DetalleDevolucionVenta>();

    public virtual Venta? IdVentaNavigation { get; set; }
}
