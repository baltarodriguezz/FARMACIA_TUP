using API_Farmacia.DTOs;

namespace API_Farmacia.Services.Interfaces
{
    public interface IClienteService
    {
        List<ClienteDTO> GetAll();
        ClienteDTO? GetById(int id);
        ClienteDTO? GetClienteQueMasCompro();
        ClienteDTO? GetClienteConCompraMasGrande();
        List<ClienteDTO>? GetClientesTarjetaCredito();
<<<<<<< HEAD
        bool Login(LoginDto loginDto);
=======

        ClienteDTO? GetByEmail(string email);
        bool Login(LoginDto loginDto);

        bool ActualizarPerfil(string emailFromToken, UpdateClienteDto dto);

        ClienteDTO RegistrarCliente(RegisterClienteDto dto);
>>>>>>> c2e6b9acb9943b6cc12f952f238aef53933e74a9
    }
}
