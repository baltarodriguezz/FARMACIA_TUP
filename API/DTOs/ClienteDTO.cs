namespace API_Farmacia.DTOs
{
    public class ClienteDTO
    {
        public int IdCliente { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public int IdDireccion { get; set; }
        public string Email { get; set; }
        public int IdTipoUsuario { get; set; }
    }
}
