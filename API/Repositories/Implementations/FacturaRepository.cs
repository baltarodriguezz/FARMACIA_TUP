using API_Farmacia.Models;
using API_Farmacia.Repositories.Interfaces;
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
            return _context.Facturas.ToList();
        }

        public Factura? GetById(int id)
        {
            return _context.Facturas.Find(id);
        }

        public List<Factura> GetFacturasEntreFechas(DateTime fechaInicio, DateTime fechaFin)
        {
            var facturas = _context.Facturas
                .Where(f => f.Fecha >= fechaInicio && f.Fecha <= fechaFin)
                .ToList();
            return facturas;
        }

        public List<Factura> GetFacturasPorCliente(int clienteId)
        {
            List<Factura> facturas = _context.Facturas
                .Where(f => f.IdCliente == clienteId)
                .ToList();
            return facturas;
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
    }
}
