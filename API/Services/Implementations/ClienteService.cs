using API_Farmacia.DTOs;
using API_Farmacia.Models;
using API_Farmacia.Repositories.Interfaces;
using API_Farmacia.Services.Interfaces;

namespace API_Farmacia.Services.Implementations
{
    public class ClienteService : IClienteService
    {
        private readonly IClientesRepository _repository;
        public ClienteService(IClientesRepository repository)
        {
            _repository = repository;
        }
        public List<ClienteDTO> GetAll()
        {
            List<ClienteDTO> clientesDTO = new List<ClienteDTO>();
            List<Cliente> clientes = _repository.GetAll();
            foreach (var cliente in clientes)
            {
                ClienteDTO clienteDTO = new ClienteDTO
                {
                    IdCliente = cliente.IdCliente,
                    Nombre = cliente.Nombre,
                    Apellido = cliente.Apellido,
                    IdDireccion = cliente.IdDireccion,
                    Email = cliente.Email,
                };
                clientesDTO.Add(clienteDTO);
            }
            return clientesDTO;
        }

        public ClienteDTO? GetById(int id)
        {
            ClienteDTO clienteDTO = new ClienteDTO();
            Cliente? cliente = _repository.GetById(id);
            if (cliente == null)
                return null;
            else
            {
                clienteDTO.IdCliente = cliente.IdCliente;
                clienteDTO.Nombre = cliente.Nombre;
                clienteDTO.Apellido = cliente.Apellido;
                clienteDTO.IdDireccion = cliente.IdDireccion;
                clienteDTO.Email = cliente.Email;
                return clienteDTO;
            }
        }

        public ClienteDTO? GetClienteConCompraMasGrande()
        {
            ClienteDTO clienteDTO = new ClienteDTO();
            Cliente? cliente = _repository.GetClienteConCompraMasGrande();
            if (cliente == null)
                return null;
            else
            {
                clienteDTO.IdCliente = cliente.IdCliente;
                clienteDTO.Nombre = cliente.Nombre;
                clienteDTO.Apellido = cliente.Apellido;
                clienteDTO.IdDireccion = cliente.IdDireccion;
                clienteDTO.Email = cliente.Email;
                return clienteDTO;
            }
        }

        public ClienteDTO? GetClienteQueMasCompro()
        {
            ClienteDTO clienteDTO = new ClienteDTO();
            Cliente? cliente = _repository.GetClienteQueMasCompro();
            if (cliente == null)
                return null;
            else
            {
                clienteDTO.IdCliente = cliente.IdCliente;
                clienteDTO.Nombre = cliente.Nombre;
                clienteDTO.Apellido = cliente.Apellido;
                clienteDTO.IdDireccion = cliente.IdDireccion;
                clienteDTO.Email = cliente.Email;
                return clienteDTO;
            }
        }

        public List<ClienteDTO>? GetClientesTarjetaCredito()
        {
            var clientesDTO = new List<ClienteDTO>();
            var clientes = _repository.GetClientesTarjetaCredito();
            if (clientes == null)
                return null;
            else
            {
                foreach (var cliente in clientes)
                {
                    ClienteDTO clienteDTO = new ClienteDTO
                    {
                        IdCliente = cliente.IdCliente,
                        Nombre = cliente.Nombre,
                        Apellido = cliente.Apellido,
                        IdDireccion = cliente.IdDireccion,
                        Email = cliente.Email,
                    };
                    clientesDTO.Add(clienteDTO);
                }
                return clientesDTO;
            }
        }
    }
}
