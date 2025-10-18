using Microsoft.AspNetCore.Mvc;
using SubliColor.Server.Data;

[ApiController]
[Route("api/[controller]")]
public class CatalogosController : ControllerBase
{
    private readonly AppDbContext _context;

    public CatalogosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{codigoCategoria}")]
    public IActionResult ObtenerValoresPorCategoria(string codigoCategoria)
    {
        var categoria = _context.Categoria
            .FirstOrDefault(c => c.CodigoInterno == codigoCategoria && c.EstaActivo == true);

        if (categoria == null) return NotFound("Categoría no encontrada.");

        var valores = _context.Valors
            .Where(v => v.IdCategoria == categoria.IdCategoria && v.EstaActivo == true)
            .Select(v => new
            {
                v.IdValor,
                v.Nombre,
                v.CodigoInterno
            })
            .ToList();

        return Ok(valores);
    }
}
