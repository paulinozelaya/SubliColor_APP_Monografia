using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SubliColor.Server.Data;
using SubliColor.Server.Models;
using SubliColor.Server.Models.DTOs;

namespace SubliColor.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PersonasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Personas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PersonaDto>>> GetPersonas()
        {
            var personas = await _context.Personas
                .Include(p => p.PersonaContactos)
                .Include(p => p.PersonaDireccions)
                .Include(p => p.PersonaIdentificacions)
                .ToListAsync();

            return personas.Select(MapToDto).ToList();
        }

        // GET: api/Personas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PersonaDto>> GetPersona(int id)
        {
            var persona = await _context.Personas
                .Include(p => p.PersonaContactos)
                .Include(p => p.PersonaDireccions)
                .Include(p => p.PersonaIdentificacions)
                .FirstOrDefaultAsync(p => p.IdPersona == id);

            if (persona == null) return NotFound();

            return MapToDto(persona);
        }

        // POST: api/Personas
        [HttpPost]
        public async Task<ActionResult<PersonaDto>> CreatePersona(PersonaDto dto)
        {
            var persona = new Persona
            {
                PrimerNombre = dto.PrimerNombre,
                SegundoNombre = dto.SegundoNombre,
                PrimerApellido = dto.PrimerApellido,
                SegundoApellido = dto.SegundoApellido,
                EstaActivo = true,
                FechaCreacion = DateTime.Now
            };

            // Contactos
            persona.PersonaContactos = dto.Contactos.Select(c => new PersonaContacto
            {
                IdTipoContacto = c.IdTipoContacto,
                Contacto = c.Contacto
            }).ToList();

            // Direcciones
            persona.PersonaDireccions = dto.Direcciones.Select(d => new PersonaDireccion
            {
                Direccion = d.Direccion
            }).ToList();

            // Identificaciones
            persona.PersonaIdentificacions = dto.Identificaciones.Select(i => new PersonaIdentificacion
            {
                IdTipoIdentificacion = i.IdTipoIdentificacion,
                Identificacion = i.Identificacion
            }).ToList();

            _context.Personas.Add(persona);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPersona), new { id = persona.IdPersona }, MapToDto(persona));
        }

        // PUT: api/Personas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePersona(int id, PersonaDto dto)
        {
            var persona = await _context.Personas
                .Include(p => p.PersonaContactos)
                .Include(p => p.PersonaDireccions)
                .Include(p => p.PersonaIdentificacions)
                .FirstOrDefaultAsync(p => p.IdPersona == id);

            if (persona == null) return NotFound();

            // Actualizar datos base
            persona.PrimerNombre = dto.PrimerNombre;
            persona.SegundoNombre = dto.SegundoNombre;
            persona.PrimerApellido = dto.PrimerApellido;
            persona.SegundoApellido = dto.SegundoApellido;
            persona.EstaActivo = dto.EstaActivo;
            persona.FechaModificacion = DateTime.Now;

            // Actualizar contactos (simplificado: borramos y reinsertamos)
            _context.PersonaContactos.RemoveRange(persona.PersonaContactos);
            persona.PersonaContactos = dto.Contactos.Select(c => new PersonaContacto
            {
                IdTipoContacto = c.IdTipoContacto,
                Contacto = c.Contacto
            }).ToList();

            // Direcciones
            _context.PersonaDireccions.RemoveRange(persona.PersonaDireccions);
            persona.PersonaDireccions = dto.Direcciones.Select(d => new PersonaDireccion
            {
                Direccion = d.Direccion
            }).ToList();

            // Identificaciones
            _context.PersonaIdentificacions.RemoveRange(persona.PersonaIdentificacions);
            persona.PersonaIdentificacions = dto.Identificaciones.Select(i => new PersonaIdentificacion
            {
                IdTipoIdentificacion = i.IdTipoIdentificacion,
                Identificacion = i.Identificacion
            }).ToList();

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Personas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePersona(int id)
        {
            var persona = await _context.Personas.FindAsync(id);
            if (persona == null) return NotFound();

            // Eliminación lógica
            persona.EstaActivo = false;
            persona.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Mapper auxiliar
        private PersonaDto MapToDto(Persona p) =>
            new PersonaDto
            {
                IdPersona = p.IdPersona,
                PrimerNombre = p.PrimerNombre,
                SegundoNombre = p.SegundoNombre,
                PrimerApellido = p.PrimerApellido,
                SegundoApellido = p.SegundoApellido,
                EstaActivo = p.EstaActivo,
                Contactos = p.PersonaContactos.Select(c => new PersonaContactoDto
                {
                    IdTipoContacto = c.IdTipoContacto,
                    Contacto = c.Contacto
                }).ToList(),
                Direcciones = p.PersonaDireccions.Select(d => new PersonaDireccionDto
                {
                    IdPersonaDireccion = d.IdPersonaDireccion,
                    Direccion = d.Direccion
                }).ToList(),
                Identificaciones = p.PersonaIdentificacions.Select(i => new PersonaIdentificacionDto
                {
                    IdTipoIdentificacion = i.IdTipoIdentificacion,
                    Identificacion = i.Identificacion
                }).ToList()
            };
    }
}
