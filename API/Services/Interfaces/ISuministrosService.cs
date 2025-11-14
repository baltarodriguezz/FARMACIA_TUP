using API_Farmacia.DTOs;
using API_Farmacia.Models;

namespace API_Farmacia.Services.Interfaces
{
    public interface ISuministrosService
    {
        List<SuministroDTO> GetAll();
        SuministroDTO? GetById(int id);
        bool Add(SuministroDTO suministro);
        bool Update(SuministroDTO suministro);
        bool Delete(int id);
        List<SuministroDTO>? GetProductosMasVendidos();
        List<TipoSuministroDTO> tiposSuministros();
    }
}
