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
<<<<<<< HEAD
        bool Login(string email, string password);
=======
        Cliente? GetByEmail(string email);
        bool Login(string email, string password);
        void Update(Cliente cliente);

        Direccion CrearDireccion(Direccion direccion);
        Cliente CrearCliente(Cliente cliente);
>>>>>>> c2e6b9acb9943b6cc12f952f238aef53933e74a9
    }
}
