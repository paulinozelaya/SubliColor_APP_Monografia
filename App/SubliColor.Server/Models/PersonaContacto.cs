using System;
using System.Collections.Generic;

namespace SubliColor.Server.Models;

public partial class PersonaContacto
{
    public int IdPersonaContacto { get; set; }

    public int? IdPersona { get; set; }

    public int? IdTipoContacto { get; set; }

    public string? Contacto { get; set; }

    public bool? EstaActivo { get; set; }

    public int? IdUsuarioCreacion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public int? IdUsuarioModificacion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public virtual Persona? IdPersonaNavigation { get; set; }
}
