using System;
using System.Collections.Generic;

namespace SubliColor.Server.Models;

public partial class Notificacion
{
    public int IdNotificacion { get; set; }

    public int? IdUsuario { get; set; }

    public int? IdPlantillaNotificacion { get; set; }

    public string? Notificacion1 { get; set; }

    public bool? Enviado { get; set; }

    public bool? EstaActivo { get; set; }

    public int? IdUsuarioCreacion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public int? IdUsuarioModificacion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public virtual PlantillaNotificacion? IdPlantillaNotificacionNavigation { get; set; }

    public virtual Usuario? IdUsuarioNavigation { get; set; }
}
