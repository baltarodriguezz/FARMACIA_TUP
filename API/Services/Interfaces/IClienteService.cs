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
    }
}
