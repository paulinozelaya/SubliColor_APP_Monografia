using System;
using System.Collections.Generic;

namespace SubliColor.Server.Models;

public partial class Rol
{
    public int IdRol { get; set; }

    public string? CodigoInterno { get; set; }

    public string? Nombre { get; set; }

    public string? Descripcion { get; set; }

    public bool? EstaActivo { get; set; }

    public int? IdUsuarioCreacion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public int? IdUsuarioModificacion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public virtual ICollection<RolAccion> RolAccions { get; set; } = new List<RolAccion>();

    public virtual ICollection<RolMenu> RolMenus { get; set; } = new List<RolMenu>();

    public virtual ICollection<UsuarioRol> UsuarioRols { get; set; } = new List<UsuarioRol>();
}
