﻿namespace SubliColor.Server.Models.DTOs
{
    public class PersonaDto
    {
        public int IdPersona { get; set; }
        public string? PrimerNombre { get; set; }
        public string? SegundoNombre { get; set; }
        public string? PrimerApellido { get; set; }
        public string? SegundoApellido { get; set; }
        public bool? EstaActivo { get; set; }

        public List<PersonaContactoDto> Contactos { get; set; } = new();
        public List<PersonaDireccionDto> Direcciones { get; set; } = new();
        public List<PersonaIdentificacionDto> Identificaciones { get; set; } = new();
    }

    public class PersonaContactoDto
    {
        public int? IdTipoContacto { get; set; }
        public string Contacto { get; set; }
    }

    public class PersonaDireccionDto
    {
        public int? IdTipoContacto { get; set; }
        public string Contacto { get; set; }
    }

    public class PersonaIdentificacionDto
    {
        public int? IdTipoContacto { get; set; }
        public string Contacto { get; set; }
    }
}
