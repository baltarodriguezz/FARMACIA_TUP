using Microsoft.Identity.Client;
using Microsoft.VisualBasic;
using WebAPI_Grupo8_TPI.DTOS;
using WebAPI_Grupo8_TPI.Repositories.Interfaces;
using WebAPI_Grupo8_TPI.Services.Interfaces;

namespace WebAPI_Grupo8_TPI.Services.Implementation
{
    public class ClienteService : IClienteService
    {
        private readonly IClienteRepository _repository;
        public ClienteService(IClienteRepository repository)
        {
            _repository = repository;
        }
        public async Task AgregarOAumentarAsync(int idCliente, int idSuministro, int cantidad)
        {
            await _repository.AgregarOAumentarAsync(idCliente, idSuministro, cantidad);
        }

        public async Task<List<CarritoDTO>> ListarPorClienteAsync(int idCliente)
        {
            return await _repository.ListarPorClienteAsync(idCliente);
        }

        public async Task VaciarCarritoAsync(int idCliente)
        {
            await _repository.VaciarCarritoAsync(idCliente);
        }
    }
}
