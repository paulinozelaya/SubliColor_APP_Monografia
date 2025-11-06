using System;
using System.Collections.Generic;

namespace SubliColor.Server.Models;

public partial class PersonaIdentificacion
{
    public int IdPersonaIdentificacion { get; set; }

    public int? IdPersona { get; set; }

    public int? IdTipoIdentificacion { get; set; }

    public string? Identificacion { get; set; }

    public bool? EstaActivo { get; set; }

    public int? IdUsuarioCreacion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public int? IdUsuarioModificacion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public virtual Persona? IdPersonaNavigation { get; set; }
}
