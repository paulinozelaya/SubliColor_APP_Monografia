using System;
using System.Collections.Generic;

namespace SubliColor.Server.Models;

public partial class Menu
{
    public int IdMenu { get; set; }

    public int? IdMenuPadre { get; set; }

    public string? CodigoInterno { get; set; }

    public string? Icono {  get; set; }

    public string? Nombre { get; set; }

    public bool? EstaActivo { get; set; }

    public int? IdUsuarioCreacion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public int? IdUsuarioModificacion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public virtual ICollection<RolMenu> RolMenus { get; set; } = new List<RolMenu>();
}
