using System;
using System.Collections.Generic;

namespace SubliColor.Server.Models;

public partial class RolAccion
{
    public int IdRolAccion { get; set; }

    public int? IdRol { get; set; }

    public int? IdAccion { get; set; }

    public bool? EstaActivo { get; set; }

    public int? IdUsuarioCreacion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public int? IdUsuarioModificacion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public virtual Accion? IdAccionNavigation { get; set; }

    public virtual Rol? IdRolNavigation { get; set; }
}
