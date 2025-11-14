using API_Farmacia.DTOs;
using API_Farmacia.Models;

namespace API_Farmacia.Services.Interfaces
{
    public interface IFacturaService
    {
        List<FacturaDTO> GetAll();
        FacturaDTO? GetById(int id);
        double GetRecaudacionTotal();
        List<FacturaDTO> GetFacturasPorCliente(int clienteId);
        List<FacturaDTO> GetFacturasEntreFechas(DateTime fechaInicio, DateTime fechaFin);
        void postFactura(FacturaPostDTO factura);
    }
}
