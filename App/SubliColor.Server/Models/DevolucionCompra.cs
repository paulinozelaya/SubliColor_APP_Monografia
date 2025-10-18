using System;
using System.Collections.Generic;

namespace SubliColor.Server.Models;

public partial class DevolucionCompra
{
    public int IdDevolucionCompra { get; set; }

    public int? IdCompra { get; set; }

    public DateTime? FechaDevolucion { get; set; }

    public string? Motivo { get; set; }

    public decimal? TotalDevuelto { get; set; }

    public bool? EstaActivo { get; set; }

    public int? IdUsuarioCreacion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public int? IdUsuarioModificacion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public virtual ICollection<DetalleDevolucionCompra> DetalleDevolucionCompras { get; set; } = new List<DetalleDevolucionCompra>();

    public virtual Compra? IdCompraNavigation { get; set; }
}
