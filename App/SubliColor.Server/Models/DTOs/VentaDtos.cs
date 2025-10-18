namespace SubliColor.Server.Models.DTOs
{
    public class DetalleVentaDto
    {
        public int IdProducto { get; set; }
        public string? NombreProducto { get; set; }
        public int CantidadProducto { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Descuento { get; set; }
        public decimal PrecioTotal { get; set; }
    }

    public class VentaDto
    {
        public int IdVenta { get; set; }
        public int IdCliente { get; set; }
        public string? NombreCliente { get; set; }
        public string NumeroFactura { get; set; } = string.Empty;
        public decimal SubTotal { get; set; }
        public decimal Descuento { get; set; }
        public decimal Total { get; set; }
        public string? IdMetodoPago { get; set; }
        public string? Observacion { get; set; }
        public bool? EstaPagado { get; set; }
        public bool? EstaActivo { get; set; }
        public DateTime? FechaCreacion { get; set; }

        public List<DetalleVentaDto> Detalles { get; set; } = new();
    }

    public class CrearDetalleVentaDto
    {
        public int IdProducto { get; set; }
        public int CantidadProducto { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Descuento { get; set; }
    }

    public class CrearVentaDto
    {
        public int IdCliente { get; set; }
        public string NumeroFactura { get; set; } = string.Empty;
        public string? IdMetodoPago { get; set; }
        public string? Observacion { get; set; }
        public List<CrearDetalleVentaDto> Detalles { get; set; } = new();
    }
}
