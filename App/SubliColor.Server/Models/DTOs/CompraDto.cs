namespace SubliColor.Server.Models.DTOs
{
    public class CompraDto
    {
        public int IdCompra { get; set; }
        public int? IdProveedor { get; set; }
        public string? NombreProveedor { get; set; }
        public string? NumeroFactura { get; set; }
        public DateTime? FechaCompra { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? Descuento { get; set; }
        public decimal? Total { get; set; }
        public string? Observacion { get; set; }
        public bool? EstaActivo { get; set; }
        public List<DetalleCompraDto> Detalles { get; set; } = new();
    }

    public class DetalleCompraDto
    {
        public int IdProducto { get; set; }
        public string? NombreProducto { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal? Descuento { get; set; }
        public decimal Total => (PrecioUnitario - (Descuento ?? 0)) * Cantidad;
    }

    public class CrearCompraDto
    {
        public int? IdProveedor { get; set; }
        public string? NumeroFactura { get; set; }
        public DateTime? FechaCompra { get; set; }
        public decimal? Descuento { get; set; }
        public string? Observacion { get; set; }
        public List<DetalleCompraDto> Detalles { get; set; } = new();
    }
}
