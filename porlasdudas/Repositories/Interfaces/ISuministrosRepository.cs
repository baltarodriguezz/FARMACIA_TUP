using FARMACIA.Models;

namespace FARMACIA.Repositories.Interfaces
{
    public interface ISuministrosRepository
    {
        List<Suministro> GetSuministrosPorTipo(int idTipoSuministro);
    }
}
