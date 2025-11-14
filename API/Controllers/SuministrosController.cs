using API_Farmacia.DTOs;
using API_Farmacia.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

<<<<<<< HEAD
[Route("api/[controller]")]
[ApiController]
public class SuministrosController : ControllerBase
{
    private readonly ISuministrosService _service;
    public SuministrosController(ISuministrosService service)
    {
        _service = service;
    }

    [HttpGet]
    public IActionResult Get() => Ok(_service.GetAll());

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var item = _service.GetById(id);
        if (item == null) return NotFound();
        return Ok(item);
    }

    // ----------------------------
    //
    // ----------------------------


    [HttpPost]
    public IActionResult Post([FromBody] SuministroDTO suministro)
    {
        try
        {
            var result = _service.Add(suministro);
            if (result)
                return Ok("Agregado con éxito");
            else
                return BadRequest("Error al agregar");
        }
        catch (Exception)
        {
            return StatusCode(500, "Error Interno");
        }
    }

    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromBody] SuministroDTO suministro)
    {
        try
        {
            suministro.IdSuministro = id;

            var result = _service.Update(suministro);
            if (result)
                return Ok("Suministro actualizado con éxito");
            else
                return BadRequest("Error al actualizar el suministro");
        }
        catch (Exception)
        {
            return StatusCode(500, "Error Interno");
        }
    }

    // ----------------------------
    //
    // ----------------------------
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        try
        {
            var ok = _service.Delete(id);
            return ok ? Ok("Eliminado OK")
                      : BadRequest("No se puede eliminar: el producto tiene registros asociados.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, "No se puede eliminar porque el producto está asociado a ventas o movimientos.");
        }
    }

=======
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API_Farmacia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuministrosController : ControllerBase
    {
        private readonly ISuministrosService _service;
        public SuministrosController(ISuministrosService service)
        {
            _service = service;
        }

        // GET: api/<SuministrosController>
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(_service.GetAll());
            }
            catch (Exception)
            {
                return StatusCode(500, "Error Interno");
            }
        }

        // GET api/<SuministrosController>/5
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            try
            {
                var suministro = _service.GetById(id);
                if (suministro == null)
                {
                    return NotFound($"No se encontró un suministro con el ID {id}.");
                }
                else
                {
                    return Ok(suministro);
                }
            }
            catch (Exception)
            {

                return StatusCode(500, "Error Interno");
            }
        }

        [HttpGet ("MasVendidos")]
        public IActionResult GetMasVendido()
        {
            try
            {
                return Ok(_service.GetProductosMasVendidos());
            }
            catch (Exception)
            {
                return StatusCode(500, "Error Interno");
            }
        }
        // POST api/<SuministrosController>
        [HttpPost]
        public IActionResult Post(SuministroPostDTO suministro)
        {
            
            try
            {
                var result = _service.Add(suministro);
                if (result)
                    return Ok("Suministro agregado con exito");
                else
                    return BadRequest("Error al agregar el suministro");
            }
            catch (Exception)
            {
                return StatusCode(500, "Error Interno");
            }
        }

        // PUT api/<SuministrosController>/5
        [HttpPut("{id}")]
        public IActionResult Put(SuministroPostDTO suministro , int id)
        {
            try
            {
                var result = _service.Update(suministro , id);
                if (result)
                    return Ok("Suministro actualizado con exito");
                else
                    return BadRequest("Error al actualizar el suministro");
            }
            catch (Exception)
            {
                return StatusCode(500, "Error Interno");
            }
        }
        
        // DELETE api/<SuministrosController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            try
            {
                var result = _service.Delete(id);
                if (result)
                    Ok("Suministro eliminado con exito");
                else
                    BadRequest("Error al eliminar el suministro");
            }
            catch (Exception)
            {
                StatusCode(500, "Error Interno");
            }
        }
        [HttpGet("TiposSuministros")]
        public IActionResult GetTiposSuministros()
        {
            try
            {
                return Ok(_service.tiposSuministros());
            }
            catch (Exception)
            {
                return StatusCode(500, "Error Interno");
            }
        }

        // GET api/<SuministroController>/5
        [HttpGet("tipo/{id}")]
        public IActionResult GetSuministrosPorTipo(int id)
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
>>>>>>> c2e6b9acb9943b6cc12f952f238aef53933e74a9
}
