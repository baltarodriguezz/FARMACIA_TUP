namespace API_Farmacia.DTOs
{
    public class SuministroDTO
    {
        public int IdSuministro { get; set; }
        public int CodBarra { get; set; }
        public string Descripcion { get; set; }
        public double PrecioUnitario { get; set; }
        public int IdTipoSuministro { get; set; }
        public int IdTipoVenta { get; set; }
        public int Stock { get; set; }
        public string? UrlImagen { get; set; }
    }
}
