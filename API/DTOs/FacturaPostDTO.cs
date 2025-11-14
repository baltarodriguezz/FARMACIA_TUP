namespace API_Farmacia.DTOs
{
    public class FacturaPostDTO
    {
        public int? IdCliente { get; set; }
        public int? IdSucursal { get; set; }
        public int? IdFormaPago { get; set; }
        public DateTime FechaEmision { get; set; }
        public ICollection<DetalleFacturaPostDTO> Detalles { get; set; }
    }
}
