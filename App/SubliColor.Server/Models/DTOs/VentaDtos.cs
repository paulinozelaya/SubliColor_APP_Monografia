namespace SubliColor.Server.Models.DTOs
{
    public class VentaDto
    {
        public int IdVenta { get; set; }
        public int? IdCliente { get; set; }
        public string NombreCliente { get; set; }
        public string NumeroFactura { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? Descuento { get; set; }
        public decimal? Total { get; set; }
        public string MetodoPago { get; set; }
        public bool? EstaActivo { get; set; }
    }

    public class CrearVentaDto
    {
        public int? IdCliente { get; set; }
        public string? NumeroFactura { get; set; }
        public DateTime FechaVenta { get; set; } = DateTime.Now;
        public int? IdMetodoPago { get; set; }
        public decimal? Descuento { get; set; }
        public string? Observacion { get; set; }
        public List<DetalleVentaDto> Detalles { get; set; } = new();
    }

    public class DetalleVentaDto
    {
        public int? IdProducto { get; set; }
        public string? NombreProducto { get; set; }
        public int? Cantidad { get; set; }
        public decimal? PrecioUnitario { get; set; }
        public decimal? Descuento { get; set; }
    }


    public class VentaDetalleDto
    {
        public int IdVenta { get; set; }
        public string NumeroFactura { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? Descuento { get; set; }
        public decimal? Total { get; set; }
        public string MetodoPago { get; set; }
        public string NombreCliente { get; set; }
        public string Observacion { get; set; }
        public bool? EstaActivo { get; set; }
        public List<DetalleVentaDto> Detalles { get; set; }
    }

}
