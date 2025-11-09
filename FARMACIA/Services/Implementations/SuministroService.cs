using FARMACIA.DTOs;
using FARMACIA.Repositories.Interfaces;
using FARMACIA.Services.Interfaces;

namespace FARMACIA.Services.Implementations
{
    public class SuministroService : ISuministroService
    {
        private readonly ISuministrosRepository _repository;
        public SuministroService(ISuministrosRepository repository)
        {
            _repository = repository;
        }

        public List<SuministroDTO>? GetSuministrosPorTipo(int idTipoSuministro)
        {
            if (idTipoSuministro <= 0 )
                return null;
            var suministros = _repository.GetSuministrosPorTipo(idTipoSuministro);
            var suministroDTOs = suministros.Select(s => new SuministroDTO
            {
                IdSuministro = s.IdSuministro,
                CodBarra = s.CodBarra,
                Descripcion = s.Descripcion,
                PrecioUnitario = s.PrecioUnitario,
                IdTipoSuministro = s.IdTipoSuministro,
                IdTipoVenta = s.IdTipoVenta,
                UrlImagen = s.UrlImagen,
                Stock = s.Stock
            }).ToList();
            return suministroDTOs;
        }
    }
}
