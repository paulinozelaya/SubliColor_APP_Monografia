using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SubliColor.Server.Data;
using SubliColor.Server.Models;
using SubliColor.Server.Models.DTOs;

namespace SubliColor.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ValoresController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ValoresController(AppDbContext context)
        {
            _context = context;
        }

        // 🔹 Obtener todos los valores con su categoría asociada
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ValorDto>>> GetValores()
        {
            var valores = await _context.Valors
                .Include(v => v.IdCategoriaNavigation)
                .Select(v => new ValorDto
                {
                    IdValor = v.IdValor,
                    IdCategoria = v.IdCategoria ?? 0,
                    CodigoInterno = v.CodigoInterno ?? "",
                    Nombre = v.Nombre ?? "",
                    Descripcion = v.Descripcion,
                    EstaActivo = v.EstaActivo ?? true,
                    NombreCategoria = v.IdCategoriaNavigation != null
                        ? v.IdCategoriaNavigation.Nombre
                        : "(Sin categoría)"
                })
                .ToListAsync();

            return Ok(valores);
        }

        // 🔹 Obtener un valor por ID
        [HttpGet("{id}")]
        public async Task<ActionResult<ValorDto>> GetValor(int id)
        {
            var valor = await _context.Valors
                .Include(v => v.IdCategoriaNavigation)
                .FirstOrDefaultAsync(v => v.IdValor == id);

            if (valor == null)
                return NotFound("Valor no encontrado.");

            var dto = new ValorDto
            {
                IdValor = valor.IdValor,
                IdCategoria = valor.IdCategoria ?? 0,
                CodigoInterno = valor.CodigoInterno ?? "",
                Nombre = valor.Nombre ?? "",
                Descripcion = valor.Descripcion,
                EstaActivo = valor.EstaActivo ?? true,
                NombreCategoria = valor.IdCategoriaNavigation?.Nombre
            };

            return Ok(dto);
        }

        // 🔹 Crear un nuevo valor
        [HttpPost]
        public async Task<ActionResult> CrearValor([FromBody] ValorDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nombre))
                return BadRequest("El nombre del valor es obligatorio.");

            var valor = new Valor
            {
                IdCategoria = dto.IdCategoria,
                CodigoInterno = dto.CodigoInterno,
                Nombre = dto.Nombre,
                Descripcion = dto.Descripcion,
                EstaActivo = true,
                IdUsuarioCreacion = 1, // opcional: usuario logueado
                FechaCreacion = DateTime.Now
            };

            _context.Valors.Add(valor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetValor), new { id = valor.IdValor }, dto);
        }

        // 🔹 Actualizar un valor existente
        [HttpPut("{id}")]
        public async Task<ActionResult> ActualizarValor(int id, [FromBody] ValorDto dto)
        {
            var valor = await _context.Valors.FindAsync(id);
            if (valor == null)
                return NotFound("Valor no encontrado.");

            valor.IdCategoria = dto.IdCategoria;
            valor.CodigoInterno = dto.CodigoInterno;
            valor.Nombre = dto.Nombre;
            valor.Descripcion = dto.Descripcion;
            valor.IdUsuarioModificacion = 1; // opcional
            valor.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 🔹 Eliminación lógica (EstaActivo = false)
        [HttpDelete("{id}")]
        public async Task<ActionResult> EliminarValor(int id)
        {
            var valor = await _context.Valors.FindAsync(id);
            if (valor == null)
                return NotFound("Valor no encontrado.");

            valor.EstaActivo = false;
            valor.IdUsuarioModificacion = 1;
            valor.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
