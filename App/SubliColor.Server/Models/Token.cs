using System;
using System.Collections.Generic;

namespace SubliColor.Server.Models;

public partial class Token
{
    public int IdToken { get; set; }

    public int? IdUsuario { get; set; }

    public string? Token1 { get; set; }

    public DateTime? FechaExpiracion { get; set; }

    public bool? Usado { get; set; }

    public bool? EstaActivo { get; set; }

    public int? IdUsuarioCreacion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public int? IdUsuarioModificacion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public virtual Usuario? IdUsuarioNavigation { get; set; }
}
