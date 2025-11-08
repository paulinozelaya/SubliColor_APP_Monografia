namespace SubliColor.Server.Models.DTOs
{
    public class ProductoDto
    {
        public int IdProducto { get; set; }
        public string Codigo { get; set; } = "";
        public string Nombre { get; set; } = "";
        public string? Descripcion { get; set; }
        public decimal? PrecioVenta { get; set; }
        public int? IdEstado { get; set; }
        public int? IdCategoria { get; set; }
        public string? NombreCategoria { get; set; }
        public int? IdUnidadMedida { get; set; }
        public string? NombreUnidadMedida { get; set; }
        public bool? EstaActivo { get; set; }

        // Existencia
        public decimal? CantidadActual { get; set; }
        public decimal? UltimoCosto { get; set; }
        public decimal? CostoPromedio { get; set; }
    }

    public class CrearProductoDto
    {
        public string Codigo { get; set; } = "";
        public string Nombre { get; set; } = "";
        public string? Descripcion { get; set; }
        public decimal? PrecioVenta { get; set; }
        public int? IdCategoria { get; set; }
        public int? IdUnidadMedida { get; set; }

        // === NUEVOS CAMPOS DE INVENTARIO INICIAL ===
        public int? CantidadInicial { get; set; } = 0;
        public decimal? PrecioCompra { get; set; } = 0;
        public decimal? UltimoCosto { get; set; } = 0;
    }


    public class ActualizarProductoDto : CrearProductoDto { }
}