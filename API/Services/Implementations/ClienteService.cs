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
        }
    }
}
