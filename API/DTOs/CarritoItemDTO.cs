namespace API_Farmacia.DTOs
{
    public class CarritoItemDTO
    {
        public int IdItem { get; set; }
        public int IdSuministro { get; set; }
        public string Descripcion { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
    }
}
