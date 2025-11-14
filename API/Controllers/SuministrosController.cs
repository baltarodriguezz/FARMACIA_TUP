using API_Farmacia.DTOs;
using API_Farmacia.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

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

}
