using FARMACIA.Models;
using FARMACIA.Repositories.Interfaces;

namespace FARMACIA.Repositories.Implementations
{
    public class SuministroRepository : ISuministrosRepository
    {
        private readonly tpi_farmaciaContext _context;
        public SuministroRepository(tpi_farmaciaContext context)
        {
            _context = context;
        }

        public List<Suministro> GetSuministrosPorTipo(int idTipoSuministro)
        {
            List<Suministro> suministros = _context.Suministros
                .Where(s => s.IdTipoSuministro == idTipoSuministro)
                .ToList();
            return suministros;
        }
    }
}
