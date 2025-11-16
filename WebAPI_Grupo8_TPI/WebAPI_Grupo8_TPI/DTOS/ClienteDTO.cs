using System.ComponentModel.DataAnnotations;

namespace WebAPI_Grupo8_TPI.DTOS
{
    public class ClienteCreateDTO
    {
        [Required]
        [StringLength(100)]
        public string Nombre { get; set; }

        [Required]
        public string Apellido { get; set; }

        [Required]
        public int IdDireccion { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Contrasena { get; set; }

        public int? IdTipoUsuario { get; set; }
    }
}
