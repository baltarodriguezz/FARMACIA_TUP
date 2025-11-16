using API_Farmacia.Models;

namespace API_Farmacia.Repositories.Interfaces
{
    public interface IFacturaRepository
    {
        List<Factura> GetAll();
        Factura? GetById(int id);
        double GetRecaudacionTotal();
        List<Factura> GetFacturasPorCliente(int clienteId);
        List<Factura> GetFacturasEntreFechas(DateTime fechaInicio, DateTime fechaFin);
        void postFactura(Factura factura);
        int GetNextFacturaNumber();
        Task<List<Sucursale>> GetAllSucs();
        Task<List<FormaPago>> GetAllFormasPago();
    }
}
