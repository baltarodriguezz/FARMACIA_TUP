using API_Farmacia.DTOs;
using API_Farmacia.Models;

namespace API_Farmacia.Services.Interfaces
{
    public interface ISuministrosService
    {
        List<SuministroDTO> GetAll();
        SuministroDTO? GetById(int id);
<<<<<<< HEAD
        bool Add(SuministroDTO suministro);
        bool Update(SuministroDTO suministro);
        bool Delete(int id);
        List<SuministroDTO>? GetProductosMasVendidos();
        List<TipoSuministroDTO> tiposSuministros();
=======
        bool Add(SuministroPostDTO suministro);
        bool Update(SuministroPostDTO suministro, int id);
        bool Delete(int id);
        List<SuministroDTO>? GetProductosMasVendidos();
        List<TipoSuministroDTO> tiposSuministros();
        List<SuministroDTO>? GetSuministrosPorTipo(int idTipoSuministro);
>>>>>>> c2e6b9acb9943b6cc12f952f238aef53933e74a9
    }
}
