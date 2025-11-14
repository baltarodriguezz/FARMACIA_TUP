namespace API_Farmacia.DTOs
{
    public class SuministroPostDTO
    {
        public int CodBarra { get; set; }
        public string Descripcion { get; set; }
        public double PrecioUnitario { get; set; }
        public int IdTipoSuministro { get; set; }
        public int IdTipoVenta { get; set; }
        public int Stock { get; set; }
        public string? UrlImagen { get; set; }
    }
}
