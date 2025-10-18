using System;
using System.Collections.Generic;

namespace SubliColor.Server.Models;

public partial class Proveedor
{
    public int IdProveedor { get; set; }

    public string? NombreProveedor { get; set; }

    public string? RUC { get; set; }

    public string? Telefono { get; set; }

    public string? Correo { get; set; }

    public string? Direccion { get; set; }

    public bool? EstaActivo { get; set; }

    public int? IdUsuarioCreacion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public int? IdUsuarioModificacion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public virtual ICollection<Compra> Compras { get; set; } = new List<Compra>();
}
