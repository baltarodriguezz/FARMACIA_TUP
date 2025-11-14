namespace API_Farmacia.DTOs
{
    public class RegisterClienteDto
    {
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string Ciudad { get; set; } = null!;  
        public string Barrio { get; set; } = null!;   
        public string Calle { get; set; } = null!;
        public int Numero { get; set; }
        public string Email { get; set; } = null!;
        public string Contrasena { get; set; } = null!;
    }
}
