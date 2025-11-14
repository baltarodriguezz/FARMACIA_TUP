namespace API_Farmacia.DTOs
{
    public class DetalleFacturaDTO
    {
        public int IdDetalleFactura { get; set; }
        public int IdFactura { get; set; }
        public int IdSuministro { get; set; }
        public int Cantidad { get; set; }
        public decimal? PrecioUnitario { get; set; }
    }
}
