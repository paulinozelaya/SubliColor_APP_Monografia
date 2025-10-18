namespace SubliColor.Server.Models.DTOs
{
    public class ProductoDto
    {
        public int IdProducto { get; set; }
        public string? Codigo { get; set; }
        public string? Nombre { get; set; }
        public string? Descripcion { get; set; }
        public decimal? PrecioVenta { get; set; }

        // 🔹 Relación con ProductoCategoria
        public int? IdCategoria { get; set; }
        public string? NombreCategoria { get; set; }

        // 🔹 Catálogos (Unidad Medida, Estado)
        public int? IdUnidadMedida { get; set; }
        public string? NombreUnidadMedida { get; set; }

        public int? IdEstado { get; set; }
        public string? NombreEstado { get; set; }

        public bool EstaActivo { get; set; }

        // 🔹 Existencias
        public int? CantidadActual { get; set; }
        public decimal? UltimoCosto { get; set; }
        public decimal? CostoPromedio { get; set; }
    }

    public class CrearProductoDto
    {
        public string Codigo { get; set; } = default!;
        public string Nombre { get; set; } = default!;
        public string? Descripcion { get; set; }
        public decimal PrecioVenta { get; set; }
        public int IdCategoria { get; set; } // tabla ProductoCategoria
        public int IdUnidadMedida { get; set; } // catálogo
        public int IdEstado { get; set; } // catálogo
    }

    public class ActualizarProductoDto : CrearProductoDto
    {
        public int IdProducto { get; set; }
    }
}
