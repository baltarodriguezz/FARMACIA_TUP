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
        Cliente? GetByEmail(string email);
        bool Login(string email, string password);
        void Update(Cliente cliente);

        Direccion CrearDireccion(Direccion direccion);
        Cliente CrearCliente(Cliente cliente);

        public Barrio GetBarrioByNombre(string nombre);
        public Barrio CrearBarrio(Barrio barrio);

        Localidad GetLocalidadByNombre(string nombre);
        Localidad CrearLocalidad(Localidad localidad);
        Ciudad GetCiudadByNombre(string nombre);
        Ciudad CrearCiudad(Ciudad ciudad);

        Pai GetPaisByNombre(string nombre);
        Pai CrearPais(Pai pais);
    }
}
