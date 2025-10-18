﻿using System;
using System.Collections.Generic;

namespace SubliColor.Server.Models;

public partial class Accion
{
    public int IdAccion { get; set; }

    public string? CodigoInterno { get; set; }

    public string? Nombre { get; set; }

    public string? Descripcion { get; set; }

    public bool? EstaActivo { get; set; }

    public int? IdUsuarioCreacion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public int? IdUsuarioModificacion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public virtual ICollection<RolAccion> RolAccions { get; set; } = new List<RolAccion>();
}
