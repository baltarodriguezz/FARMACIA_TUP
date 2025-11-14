namespace API_Farmacia.DTOs
{
    public class FacturaDTO
    {
        public int IdFactura { get; set; }
        public int? IdCliente { get; set; }
        public int? IdSucursal { get; set; }
        public int? IdFormaPago { get; set; }
        public DateTime FechaEmision { get; set; }
        public double? Total { get; set; }
        public ICollection<DetalleFacturaDTO> Detalles { get; set; }
    }
}
