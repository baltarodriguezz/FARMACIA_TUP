using FARMACIA.DTOs;

namespace FARMACIA.Services.Interfaces
{
    public interface ISuministroService
    {
        List<SuministroDTO>? GetSuministrosPorTipo(int idTipoSuministro);
    }
}
