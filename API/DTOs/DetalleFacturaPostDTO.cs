namespace API_Farmacia.DTOs
{
    public class DetalleFacturaPostDTO
    {
        public int IdSuministro { get; set; }
        public int Cantidad { get; set; }
        public decimal? PrecioUnitario { get; set; }
    }
}
