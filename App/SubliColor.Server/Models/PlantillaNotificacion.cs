using System;
using System.Collections.Generic;

namespace SubliColor.Server.Models;

public partial class PlantillaNotificacion
{
    public int IdPlantillaNotificacion { get; set; }

    public int? IdTipoPlantilla { get; set; }

    public string? Plantilla { get; set; }

    public bool? EstaActivo { get; set; }

    public int? IdUsuarioCreacion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public int? IdUsuarioModificacion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public virtual ICollection<Notificacion> Notificacions { get; set; } = new List<Notificacion>();
}
