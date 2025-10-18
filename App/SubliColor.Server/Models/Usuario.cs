using System;
using System.Collections.Generic;

namespace SubliColor.Server.Models;

public partial class Usuario
{
    public int IdUsuario { get; set; }

    public string? Usuario1 { get; set; }

    public string? Clave { get; set; }

    public string? Email { get; set; }

    public int? IdPersona { get; set; }

    public bool? EstaBloqueado { get; set; }

    public DateTime? FechaBloqueo { get; set; }

    public byte? IntentosFallidos { get; set; }

    public DateTime? FechaExpiracion { get; set; }

    public bool? EstaActivo { get; set; }

    public int? IdUsuarioCreacion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public int? IdUsuarioModificacion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public virtual ICollection<AuditoriaInicioSesion> AuditoriaInicioSesions { get; set; } = new List<AuditoriaInicioSesion>();

    public virtual ICollection<HistorialClave> HistorialClaves { get; set; } = new List<HistorialClave>();

    public virtual Persona? IdPersonaNavigation { get; set; }

    public virtual ICollection<Notificacion> Notificacions { get; set; } = new List<Notificacion>();

    public virtual ICollection<Token> Tokens { get; set; } = new List<Token>();

    public virtual ICollection<UsuarioRol> UsuarioRols { get; set; } = new List<UsuarioRol>();
}
