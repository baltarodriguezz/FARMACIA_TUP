using API_Farmacia.DTOs;
using API_Farmacia.Models;
using API_Farmacia.Repositories.Implementations;
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

                    // --- AÑADIR ESTA LÍNEA AQUÍ TAMBIÉN ---
                    IdTipoUsuario = (int)cliente.IdTipoUsuario
                };
                clientesDTO.Add(clienteDTO);
            }
            return clientesDTO;
        }

        public ClienteDTO? GetByEmail(string email)
        {
            
            Cliente? cliente = _repository.GetByEmail(email);

            if (cliente == null)
                return null;


            ClienteDTO clienteDTO = new ClienteDTO
            {
                IdCliente = cliente.IdCliente,
                Nombre = cliente.Nombre,
                Apellido = cliente.Apellido,
                IdDireccion = cliente.IdDireccion,
                Email = cliente.Email,
                IdTipoUsuario = (int)cliente.IdTipoUsuario,
            };

            return clienteDTO;
        }

        public bool ActualizarPerfil(string emailFromToken, UpdateClienteDto dto)
        {
            
            var cliente = _repository.GetByEmail(emailFromToken);
            if (cliente == null) return false;

            
            if (!string.IsNullOrWhiteSpace(dto.Nombre))
                cliente.Nombre = dto.Nombre.Trim();

            if (!string.IsNullOrWhiteSpace(dto.Apellido))
                cliente.Apellido = dto.Apellido.Trim();

            if (!string.IsNullOrWhiteSpace(dto.Email))
                cliente.Email = dto.Email.Trim();

            _repository.Update(cliente);
            return true;
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
                clienteDTO.IdTipoUsuario = (int)cliente.IdTipoUsuario;
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
                clienteDTO.IdTipoUsuario = (int)cliente.IdTipoUsuario;
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
                clienteDTO.IdTipoUsuario = (int)cliente.IdTipoUsuario;
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
                        IdTipoUsuario = (int)cliente.IdTipoUsuario,
                    };
                    clientesDTO.Add(clienteDTO);
                }
                return clientesDTO;
            }
        }

        public bool Login(LoginDto loginDto)
        {
            var resultado = _repository.Login(loginDto.Email, loginDto.Password);
            if (resultado)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public ClienteDTO RegistrarCliente(RegisterClienteDto dto)
        {

            var existente = _repository.GetByEmail(dto.Email);
            if (existente != null)
            {
                throw new Exception("Ya existe un cliente registrado con ese email.");
            }


            var direccion = new Direccion
            {
                NomCalle = dto.Calle,
                NroCalle = dto.Numero,
                IdBarrio = 1 
            };
            direccion = _repository.CrearDireccion(direccion);

            var cliente = new Cliente
            {
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                Email = dto.Email,
                Contrasena = dto.Contrasena, 
                IdDireccion = direccion.IdDireccion,
                IdTipoUsuario = 1 
            };

            cliente = _repository.CrearCliente(cliente);


            return new ClienteDTO
            {
                IdCliente = cliente.IdCliente,
                Nombre = cliente.Nombre,
                Apellido = cliente.Apellido,
                Email = cliente.Email
            };
        }
    }
}
