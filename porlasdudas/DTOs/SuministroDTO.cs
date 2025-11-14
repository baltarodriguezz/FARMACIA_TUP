namespace FARMACIA.DTOs
{
    public class SuministroDTO
    {
        public int IdSuministro { get; set; }
        public int CodBarra { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public double PrecioUnitario { get; set; }
        public int IdTipoSuministro { get; set; }
        public int IdTipoVenta { get; set; }
        public string UrlImagen { get; set; } = string.Empty;
        public int Stock { get; set; }
    }
}
