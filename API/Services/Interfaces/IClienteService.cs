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

        ClienteDTO? GetByEmail(string email);
        bool Login(LoginDto loginDto);

        bool ActualizarPerfil(string emailFromToken, UpdateClienteDto dto);

        ClienteDTO RegistrarCliente(RegisterClienteDto dto);
    }
}
