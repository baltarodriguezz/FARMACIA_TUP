using API_Farmacia.Models;
using API_Farmacia.Repositories.Interfaces;

namespace API_Farmacia.Repositories.Implementations
{
    public class SuministroRepository : ISuministrosRepository
    {
        private readonly FarmaciaContext _context;
        public SuministroRepository(FarmaciaContext context)
        {
            _context = context;
        }
        public void Add(Suministro suministro)
        {
            _context.Suministros.Add(suministro);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            _context.Suministros.Remove(GetById(id));
            _context.SaveChanges();
        }

        public List<Suministro> GetAll()
        {
            return _context.Suministros.ToList();
        }

        public Suministro? GetById(int id)
        {
            Suministro suministro = _context.Suministros.Find(id);
            return suministro;
        }

        public void Update(Suministro suministro)
        {
            _context.Suministros.Update(suministro);
            _context.SaveChanges();
        }
        public List<Suministro>? GetProductosMasVendido()
        {
            var query = _context.DetallesFacturas
               .GroupBy(df => df.IdSuministro)
               .Select(g => new
               {
                   IdSuministro = g.Key,
                   CantidadVendida = g.Sum(x => x.Cantidad)
               })
               .OrderByDescending(x => x.CantidadVendida)
               .Take(10)
               .ToList();
            var suministrosMasVendidos = new List<Suministro>();
            foreach (var item in query)
            {
                var suministro = GetById(item.IdSuministro); 
                if (suministro != null)
                    suministrosMasVendidos.Add(suministro);
            }
            if (query == null)
                return null;

            return suministrosMasVendidos;
        }

        public List<TiposSuministro> tiposSuministros()
        {
            return _context.TiposSuministros.ToList();
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
