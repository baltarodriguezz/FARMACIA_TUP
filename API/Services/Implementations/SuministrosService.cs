using API_Farmacia.DTOs;
using API_Farmacia.Models;
using API_Farmacia.Repositories.Interfaces;
using API_Farmacia.Services.Interfaces;
<<<<<<< HEAD
using Microsoft.EntityFrameworkCore;
=======
>>>>>>> c2e6b9acb9943b6cc12f952f238aef53933e74a9

namespace API_Farmacia.Services.Implementations
{
    public class SuministrosService : ISuministrosService
    {
        private readonly ISuministrosRepository _repository;
        public SuministrosService(ISuministrosRepository repository)
        {
            _repository = repository;
        }
<<<<<<< HEAD
        public bool Add(SuministroDTO suministro)
        {
            if (!ValidateSuministroDTO(suministro))
                return false;
            Suministro newSuministro = new Suministro
                {
                IdSuministro = suministro.IdSuministro,
=======
        public bool Add(SuministroPostDTO suministro)
        {
            if (!ValidateSuministroPostDTO(suministro))
                return false;
            Suministro newSuministro = new Suministro
            {
>>>>>>> c2e6b9acb9943b6cc12f952f238aef53933e74a9
                CodBarra = (int)suministro.CodBarra,
                Descripcion = suministro.Descripcion,
                PrecioUnitario = (double)suministro.PrecioUnitario,
                IdTipoSuministro = (int)suministro.IdTipoSuministro,
                IdTipoVenta = (int)suministro.IdTipoVenta,
                Stock = (int)suministro.Stock,
                UrlImagen = suministro.UrlImagen
            };
            _repository.Add(newSuministro);
            return true;
        }

        public bool Delete(int id)
        {
<<<<<<< HEAD
            var item = GetById(id);
            if (item == null) return false;

            try
            {
                _repository.Delete(id);
                
                return true;
            }
            catch
            {
                return false; // Falla por foreign key
            }

=======
            if (_repository.GetById(id) == null)
                return false;
            else
            {
                _repository.Delete(id);
                return true;
            }
>>>>>>> c2e6b9acb9943b6cc12f952f238aef53933e74a9
        }

        public List<SuministroDTO> GetAll()
        {
            List<Suministro> suministros = _repository.GetAll();
            List<SuministroDTO> suministrosDTO = new List<SuministroDTO>();
            foreach (var suministro in suministros)
            {
                SuministroDTO suministroDTO = new SuministroDTO
                {
                    IdSuministro = suministro.IdSuministro,
                    CodBarra = suministro.CodBarra,
                    Descripcion = suministro.Descripcion,
                    PrecioUnitario = suministro.PrecioUnitario,
                    IdTipoSuministro = suministro.IdTipoSuministro,
                    IdTipoVenta = suministro.IdTipoVenta,
                    Stock = suministro.Stock,
                    UrlImagen = suministro.UrlImagen
                };
                suministrosDTO.Add(suministroDTO);
            }
            return suministrosDTO;
        }

        public SuministroDTO? GetById(int id)
        {
<<<<<<< HEAD
            Suministro suministro= _repository.GetById(id);
=======
            Suministro suministro = _repository.GetById(id);
>>>>>>> c2e6b9acb9943b6cc12f952f238aef53933e74a9
            if (suministro == null)
                return null;
            else
            {
<<<<<<< HEAD
                 SuministroDTO suministroDTO = new SuministroDTO
=======
                SuministroDTO suministroDTO = new SuministroDTO
>>>>>>> c2e6b9acb9943b6cc12f952f238aef53933e74a9
                {
                    IdSuministro = suministro.IdSuministro,
                    CodBarra = suministro.CodBarra,
                    Descripcion = suministro.Descripcion,
                    PrecioUnitario = suministro.PrecioUnitario,
                    IdTipoSuministro = suministro.IdTipoSuministro,
                    IdTipoVenta = suministro.IdTipoVenta,
                    Stock = suministro.Stock,
                    UrlImagen = suministro.UrlImagen
<<<<<<< HEAD
                 };
=======
                };
>>>>>>> c2e6b9acb9943b6cc12f952f238aef53933e74a9
                return suministroDTO;
            }
        }

        public List<SuministroDTO>? GetProductosMasVendidos()
        {
            List<Suministro> suministros = _repository.GetProductosMasVendido();
            List<SuministroDTO> suministrosDTO = new List<SuministroDTO>();
            foreach (var suministro in suministros)
            {
                SuministroDTO suministroDTO = new SuministroDTO
                {
                    IdSuministro = suministro.IdSuministro,
                    CodBarra = suministro.CodBarra,
                    Descripcion = suministro.Descripcion,
                    PrecioUnitario = suministro.PrecioUnitario,
                    IdTipoSuministro = suministro.IdTipoSuministro,
                    IdTipoVenta = suministro.IdTipoVenta,
                    Stock = suministro.Stock,
                    UrlImagen = suministro.UrlImagen
                };
                suministrosDTO.Add(suministroDTO);
            }
            return suministrosDTO;

        }

        public List<TipoSuministroDTO> tiposSuministros()
        {
            var tipos = _repository.tiposSuministros();
            var tiposDTO = tipos.Select(t => new TipoSuministroDTO
            {
                IdTipoSuministro = t.IdTipoSuministro,
                Tipo = t.Tipo
            }).ToList();
            return tiposDTO;
        }

<<<<<<< HEAD
        public bool Update(SuministroDTO suministro)
        {
            if (!ValidateSuministroDTO(suministro))
=======
        public bool Update(SuministroPostDTO suministro, int id)
        {
            if (!ValidateSuministroPostDTO(suministro))
>>>>>>> c2e6b9acb9943b6cc12f952f238aef53933e74a9
                return false;
            else
            {
                Suministro suministro1 = new Suministro()
                {
<<<<<<< HEAD
                    IdSuministro = suministro.IdSuministro,
=======
                    IdSuministro = id,
>>>>>>> c2e6b9acb9943b6cc12f952f238aef53933e74a9
                    CodBarra = suministro.CodBarra,
                    Descripcion = suministro.Descripcion,
                    PrecioUnitario = suministro.PrecioUnitario,
                    IdTipoSuministro = suministro.IdTipoSuministro,
                    IdTipoVenta = suministro.IdTipoVenta,
                    Stock = suministro.Stock,
                    UrlImagen = suministro.UrlImagen

                };
                _repository.Update(suministro1);
<<<<<<< HEAD
                return  true;
=======
                return true;
>>>>>>> c2e6b9acb9943b6cc12f952f238aef53933e74a9
            }
        }


        private bool ValidateSuministroDTO(SuministroDTO suministro)
        {
            if (suministro.CodBarra == null || suministro.CodBarra <= 0)
                return false;
            if (string.IsNullOrWhiteSpace(suministro.Descripcion))
                return false;
            if (suministro.PrecioUnitario == null || suministro.PrecioUnitario <= 0)
                return false;
            if (suministro.IdTipoSuministro == null || suministro.IdTipoSuministro <= 0)
                return false;
            if (suministro.IdTipoVenta == null || suministro.IdTipoVenta <= 0)
                return false;
            if (suministro.Stock == null || suministro.Stock < 0)
                return false;
            return true;
        }
<<<<<<< HEAD
=======

        private bool ValidateSuministroPostDTO(SuministroPostDTO suministro)
        {
            if (suministro.CodBarra == null || suministro.CodBarra <= 0)
                return false;
            if (string.IsNullOrWhiteSpace(suministro.Descripcion))
                return false;
            if (suministro.PrecioUnitario == null || suministro.PrecioUnitario <= 0)
                return false;
            if (suministro.IdTipoSuministro == null || suministro.IdTipoSuministro <= 0)
                return false;
            if (suministro.IdTipoVenta == null || suministro.IdTipoVenta <= 0)
                return false;
            if (suministro.Stock == null || suministro.Stock < 0)
                return false;
            return true;
        }

        public List<SuministroDTO>? GetSuministrosPorTipo(int idTipoSuministro)
        {
            if (idTipoSuministro <= 0)
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
>>>>>>> c2e6b9acb9943b6cc12f952f238aef53933e74a9
    }
}
