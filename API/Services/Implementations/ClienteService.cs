using API_Farmacia.DTOs;
using API_Farmacia.Models;
<<<<<<< HEAD
=======
using API_Farmacia.Repositories.Implementations;
>>>>>>> c2e6b9acb9943b6cc12f952f238aef53933e74a9
using API_Farmacia.Repositories.Interfaces;
using API_Farmacia.Services.Interfaces;

namespace API_Farmacia.Services.Implementations
{
    public class ClienteService : IClienteService
    {
        private readonly IClientesRepository _repository;
<<<<<<< HEAD

=======
>>>>>>> c2e6b9acb9943b6cc12f952f238aef53933e74a9
        public ClienteService(IClientesRepository repository)
        {
            _repository = repository;
        }
<<<<<<< HEAD

        private ClienteDTO MapCliente(Cliente c)
        {
            return new ClienteDTO
            {
                IdCliente = c.IdCliente,

                NombreCompleto = $"{c.Nombre} {c.Apellido}",

              

                Email = c.Email,

                // Teléfono = primer contacto de tipo teléfono
                Telefono = c.Contactos
                    .FirstOrDefault(ct => ct.IdTipoContacto == 1)?.Valor,

                // Obra Social = primera que tenga
                ObraSocial = c.ClienteObraSocials
                    .FirstOrDefault()?.IdObraSocialNavigation?.Nombre,

                // Forma de pago de la última factura
                FormaPago = c.Facturas
                    .OrderByDescending(f => f.Fecha)
                    .FirstOrDefault()?.IdFormaPagoNavigation?.Descripcion,

                // Total de compras
                TotalCompras = c.Facturas
                    .Sum(f => f.DetallesFacturas.Sum(d => d.Cantidad * (double)d.PreUnitario))
            };
        }

        // ---------------- GET ALL ----------------
        public List<ClienteDTO> GetAll()
        {
            var clientes = _repository.GetAll();
            return clientes.Select(c => MapCliente(c)).ToList();
        }

        // ---------------- GET BY ID ----------------
        public ClienteDTO? GetById(int id)
        {
            var cliente = _repository.GetById(id);
            return cliente == null ? null : MapCliente(cliente);
        }

        // ---------------- CLIENTE COMPRA MAS GRANDE ----------------
        public ClienteDTO? GetClienteConCompraMasGrande()
        {
            var cliente = _repository.GetClienteConCompraMasGrande();
            return cliente == null ? null : MapCliente(cliente);
        }

        // ---------------- CLIENTE QUE MÁS COMPRÓ ----------------
        public ClienteDTO? GetClienteQueMasCompro()
        {
            var cliente = _repository.GetClienteQueMasCompro();
            return cliente == null ? null : MapCliente(cliente);
        }

        // ---------------- TARJETA DE CRÉDITO ----------------
        public List<ClienteDTO>? GetClientesTarjetaCredito()
        {
            var clientes = _repository.GetClientesTarjetaCredito();
            return clientes?.Select(c => MapCliente(c)).ToList();
        }

        // ---------------- LOGIN ----------------
        public bool Login(LoginDto loginDto)
        {
            return _repository.Login(loginDto.Email, loginDto.Password);
=======
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
                Email = cliente.Email
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
>>>>>>> c2e6b9acb9943b6cc12f952f238aef53933e74a9
        }
    }
}
