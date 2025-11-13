using API_Farmacia.Models;

namespace API_Farmacia.Repositories.Interfaces
{
    public interface IClientesRepository
    {
        List<Cliente> GetAll();
        Cliente? GetById(int id);
        Cliente? GetClienteQueMasCompro();
        Cliente? GetClienteConCompraMasGrande();
        List<Cliente>? GetClientesTarjetaCredito();
    }
}
