using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SubliColor.Server.Data;
using SubliColor.Server.Models;
using SubliColor.Server.Models.DTOs;

namespace SubliColor.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClientesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Clientes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClienteDto>>> GetClientes()
        {
            var clientes = await _context.Clientes
                .Include(c => c.IdPersonaNavigation)
                .ToListAsync();

            return clientes.Select(c => new ClienteDto
            {
                IdCliente = c.IdCliente,
                IdPersona = c.IdPersona,
                NombrePersona = $"{c.IdPersonaNavigation?.PrimerNombre} {c.IdPersonaNavigation?.PrimerApellido}",
                EstaActivo = c.EstaActivo ?? true
            }).ToList();
        }

        // GET: api/Clientes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ClienteDto>> GetCliente(int id)
        {
            var cliente = await _context.Clientes
                .Include(c => c.IdPersonaNavigation)
                .FirstOrDefaultAsync(c => c.IdCliente == id);

            if (cliente == null) return NotFound();

            return new ClienteDto
            {
                IdCliente = cliente.IdCliente,
                IdPersona = cliente.IdPersona,
                NombrePersona = $"{cliente.IdPersonaNavigation?.PrimerNombre} {cliente.IdPersonaNavigation?.PrimerApellido}",
                EstaActivo = cliente.EstaActivo ?? true
            };
        }

        // POST: api/Clientes
        [HttpPost]
        public async Task<ActionResult<ClienteDto>> CrearCliente([FromBody] CrearClienteDto dto)
        {
            var cliente = new Cliente
            {
                IdPersona = dto.IdPersona,
                EstaActivo = true,
                FechaCreacion = DateTime.UtcNow
            };

            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCliente), new { id = cliente.IdCliente }, new ClienteDto
            {
                IdCliente = cliente.IdCliente,
                IdPersona = cliente.IdPersona,
                NombrePersona = _context.Personas.Find(dto.IdPersona)?.PrimerNombre,
                EstaActivo = true
            });
        }

        // PUT: api/Clientes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarCliente(int id, [FromBody] CrearClienteDto dto)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null) return NotFound();

            cliente.IdPersona = dto.IdPersona;
            cliente.FechaModificacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE lógico
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null) return NotFound();

            cliente.EstaActivo = false;
            cliente.FechaModificacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
