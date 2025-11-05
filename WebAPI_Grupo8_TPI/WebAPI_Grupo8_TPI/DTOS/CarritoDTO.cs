namespace WebAPI_Grupo8_TPI.DTOS
{
    public class CarritoDTO
    {
        public int IdCarrito { get; set; }
        public int IdCliente { get; set; }
        public int IdSuministro { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public int Cantidad { get; set; }
        public double PrecioUnitario { get; set; }
        public double Subtotal { get; set; }
    }
}
