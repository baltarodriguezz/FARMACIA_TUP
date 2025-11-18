namespace API_Farmacia.DTOs
{
    public class RegisterClienteDto
    {
        
        public string Nombre { get; set; }
        public string Apellido { get; set; }


        public string Pais { get; set; } = "Argentina";
        public string Ciudad { get; set; }    
        public string Barrio { get; set; }    
        public string Calle { get; set; }     
        public int Numero { get; set; }      

        
        public string Email { get; set; }
        public string Contrasena { get; set; }
    }


}
