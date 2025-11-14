namespace API_Farmacia.DTOs
{
    public class ClienteDTO
    {
        public int IdCliente { get; set; }
        public string NombreCompleto { get; set; }
        public string ObraSocial { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string FormaPago { get; set; }
        public double TotalCompras { get; set; }
    }
}
