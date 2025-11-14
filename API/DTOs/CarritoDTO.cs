namespace API_Farmacia.DTOs
{
    public class CarritoDTO
    {
        public int IdCarrito { get; set; }
        public int IdCliente { get; set; }
        public string Estado { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public List<CarritoItemDTO> Items { get; set; }
    }
}
