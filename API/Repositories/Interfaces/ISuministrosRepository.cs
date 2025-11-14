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
<<<<<<< HEAD
=======
        List<Suministro> GetSuministrosPorTipo(int idTipoSuministro);
>>>>>>> c2e6b9acb9943b6cc12f952f238aef53933e74a9
    }
}
