using System;
using System.Collections.Generic;

namespace SubliColor.Server.Models;

public partial class AuditoriaInicioSesion
{
    public int IdAuditoriaInicioSesion { get; set; }

    public int? IdUsuario { get; set; }

    public DateTime FechaInicio { get; set; }

    public DateTime? FechaFin { get; set; }

    public string? DireccionIP { get; set; }

    public string? Dispositivo { get; set; }

    public string? Ubicacion { get; set; }

    public bool Exitoso { get; set; }

    public virtual Usuario? IdUsuarioNavigation { get; set; }
}
