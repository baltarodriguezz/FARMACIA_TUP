using FARMACIA.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FARMACIA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuministroController : ControllerBase
    {
        private readonly ISuministroService _service;
        public SuministroController(ISuministroService service)
        {
            _service = service;
        }
        // GET api/<SuministroController>/5
        [HttpGet("tipo/{id}")]
        public IActionResult GetTipoSuministro(int id)
        {
            try
            {
                var suministros = _service.GetSuministrosPorTipo(id);

                if (suministros == null || !suministros.Any())
                    return BadRequest("El ID del tipo de suministro no es válido o no tiene suministros asociados.");

                return Ok(suministros);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

    }
}
