using API_Farmacia.Models;
using API_Farmacia.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace API_Farmacia.Repositories.Implementations
{
    public class FacturaRepository : IFacturaRepository
    {
        private readonly FarmaciaContext _context;
        public FacturaRepository(FarmaciaContext context)
        {
            _context = context;
        }
        public List<Factura> GetAll()
        {
            return _context.Facturas
                .Include(f => f.DetallesFacturas)
                .ToList();
        }

        public Factura? GetById(int id)
        {
            return _context.Facturas
                .Include(f => f.DetallesFacturas)
                .FirstOrDefault(f => f.NroFactura == id);
        }

        public List<Factura> GetFacturasEntreFechas(DateTime fechaInicio, DateTime fechaFin)
        {
            var facturas = _context.Facturas
                .Where(f => f.Fecha >= fechaInicio && f.Fecha <= fechaFin)
                .Include(f=>f.DetallesFacturas)
                .ToList();
            return facturas;
        }

        public List<Factura> GetFacturasPorCliente(int clienteId)
        {
            List<Factura> facturas = _context.Facturas
                .Where(f => f.IdCliente == clienteId)
                .Include(f=>f.DetallesFacturas)
                .ToList();
            return facturas;
        }

        public int GetNextFacturaNumber()
        {
            return _context.Facturas.Max(f => f.NroFactura) + 1;
        }

        public double GetRecaudacionTotal()
        {
            var query = _context.DetallesFacturas
                .Select(df => df.Cantidad * df.PreUnitario)
                .Sum();

            return (double)query;
        }

        public void postFactura(Factura factura)
        {
            _context.Facturas.Add(factura);
            _context.SaveChanges();
        }
        public async Task<List<Sucursale>> GetAllSucs()
        {
            return await _context.Sucursales.ToListAsync();
        }
        public async Task<List<FormaPago>> GetAllFormasPago()
        {
            return await _context.FormaPagos.ToListAsync();
        }
    }
}
