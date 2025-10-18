using System;
using System.Collections.Generic;

namespace SubliColor.Server.Models;

public partial class Persona
{
    public int IdPersona { get; set; }

    public string? PrimerNombre { get; set; }

    public string? SegundoNombre { get; set; }

    public string? PrimerApellido { get; set; }

    public string? SegundoApellido { get; set; }

    public bool? EstaActivo { get; set; }

    public int? IdUsuarioCreacion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public int? IdUsuarioModificacion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public virtual ICollection<Cliente> Clientes { get; set; } = new List<Cliente>();

    public virtual ICollection<PersonaContacto> PersonaContactos { get; set; } = new List<PersonaContacto>();

    public virtual ICollection<PersonaDireccion> PersonaDireccions { get; set; } = new List<PersonaDireccion>();

    public virtual ICollection<PersonaIdentificacion> PersonaIdentificacions { get; set; } = new List<PersonaIdentificacion>();

    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}
