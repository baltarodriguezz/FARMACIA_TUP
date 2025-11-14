using API_Farmacia.Models;

namespace API_Farmacia.Repositories.Interfaces
{
    public interface ISuministrosRepository
    {
        List<Suministro> GetAll();
        Suministro? GetById(int id);
        void Add(Suministro suministro);
        void Update(Suministro suministro);
        void Delete(int id);
        List<Suministro>? GetProductosMasVendido();
        List<TiposSuministro> tiposSuministros();
        List<Suministro> GetSuministrosPorTipo(int idTipoSuministro);
    }
}
