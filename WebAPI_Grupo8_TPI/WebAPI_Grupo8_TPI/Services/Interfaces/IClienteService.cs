using WebAPI_Grupo8_TPI.DTOS;

namespace WebAPI_Grupo8_TPI.Services.Interfaces
{
    public interface IClienteService
    {
        Task VaciarCarritoAsync(int idCliente);
        Task AgregarOAumentarAsync(int idCliente, int idSuministro, int cantidad);
        Task<List<CarritoDTO>> ListarPorClienteAsync(int idCliente);
    }
}
