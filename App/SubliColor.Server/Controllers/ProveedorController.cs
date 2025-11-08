using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SubliColor.Server.Data;
using SubliColor.Server.Models;
using SubliColor.Server.Models.DTOs;

namespace SubliColor.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProveedoresController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProveedoresController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProveedorDto>>> GetAll()
        {
            var proveedores = await _context.Proveedors.ToListAsync();

            return Ok(proveedores.Select(p => new ProveedorDto
            {
                IdProveedor = p.IdProveedor,
                NombreProveedor = p.NombreProveedor,
                RUC = p.RUC,
                Telefono = p.Telefono,
                Correo = p.Correo,
                Direccion = p.Direccion,
                EstaActivo = p.EstaActivo
            }));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProveedorDto>> GetById(int id)
        {
            var p = await _context.Proveedors.FindAsync(id);
            if (p == null) return NotFound();

            return Ok(new ProveedorDto
            {
                IdProveedor = p.IdProveedor,
                NombreProveedor = p.NombreProveedor,
                RUC = p.RUC,
                Telefono = p.Telefono,
                Correo = p.Correo,
                Direccion = p.Direccion,
                EstaActivo = p.EstaActivo
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProveedorDto dto)
        {
            var proveedor = new Proveedor
            {
                NombreProveedor = dto.NombreProveedor,
                RUC = dto.RUC,
                Telefono = dto.Telefono,
                Correo = dto.Correo,
                Direccion = dto.Direccion,
                EstaActivo = true,
                FechaCreacion = DateTime.Now
            };

            _context.Proveedors.Add(proveedor);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProveedorDto dto)
        {
            var proveedor = await _context.Proveedors.FindAsync(id);
            if (proveedor == null) return NotFound();

            proveedor.NombreProveedor = dto.NombreProveedor;
            proveedor.RUC = dto.RUC;
            proveedor.Telefono = dto.Telefono;
            proveedor.Correo = dto.Correo;
            proveedor.Direccion = dto.Direccion;
            proveedor.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var proveedor = await _context.Proveedors.FindAsync(id);
            if (proveedor == null) return NotFound();

            proveedor.EstaActivo = false;
            proveedor.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}