using API_Farmacia.Models;
using API_Farmacia.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API_Farmacia.Repositories.Implementations
{
    public class ClientesRepository : IClientesRepository
    {
        private readonly FarmaciaContext _context;
        public ClientesRepository(FarmaciaContext context)
        {
            _context = context;
        }

        public List<Cliente> GetAll()
        {
            return _context.Clientes.ToList();
        }

        public Cliente? GetById(int id)
        {
            return _context.Clientes.FirstOrDefault(c => c.IdCliente == id);
        }

        public Cliente? GetClienteConCompraMasGrande()
        {
            var query = _context.DetallesFacturas
                .Join(_context.Facturas,
                      df => df.NroFactura,
                      f => f.NroFactura,
                      (df, f) => new
                      {
                          f.IdCliente,
                          f.NroFactura,
                          TotalFactura = df.Cantidad * df.PreUnitario
                      })
                .GroupBy(x => new { x.IdCliente, x.NroFactura })
                .Select(g => new
                {
                    g.Key.IdCliente,
                    TotalFactura = g.Sum(x => x.TotalFactura)
                })
                .OrderByDescending(x => x.TotalFactura)
                .FirstOrDefault();

            if (query == null)
                return null;

            return GetById(query.IdCliente);
        }

        public Cliente? GetClienteQueMasCompro()
        {
            var query = _context.Facturas
                .GroupBy(f => f.IdCliente)
                .Select(g => new
                {
                    IdCliente = g.Key,
                    CantidadCompras = g.Count()
                })
                .OrderByDescending(x => x.CantidadCompras)
                .FirstOrDefault();

            if (query == null)
                return null;

            return GetById(query.IdCliente);

        }
        public Cliente? GetByEmail(string email)
        {
            return _context.Clientes
                           .FirstOrDefault(c => c.Email == email);
        }

        public List<Cliente> GetClientesTarjetaCredito()
        {
            var formas = new[] { 3, 4, 5 };

            var ids = _context.Facturas
                .Where(f => formas.Contains(f.IdFormaPago))
                .Select(f => f.IdCliente)
                .Distinct()
                .ToList();

            var clientes = _context.Clientes
                .AsNoTracking()
                .Where(c => ids.Contains(c.IdCliente))
                .ToList();

            return clientes;
        }

        public bool Login(string email, string password)
        {
            var cliente = _context.Clientes
                .FirstOrDefault(c => c.Email == email && c.Contrasena == password);
            if (cliente != null)
            {
                return true;
            }
            else  
            {
                return false;
            }
        }

        public void Update(Cliente cliente)
        {
            _context.Clientes.Update(cliente);
            _context.SaveChanges();
        }

        public Direccion CrearDireccion(Direccion direccion)
        {
            _context.Direccions.Add(direccion);
            _context.SaveChanges();
            return direccion;
        }

        public Cliente CrearCliente(Cliente cliente)
        {
            _context.Clientes.Add(cliente);
            _context.SaveChanges();
            return cliente;
        }
    }
}
