using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using WebAPI_Grupo8_TPI.Services.Interfaces;

[ApiController]
[Route("api/[controller]")]
public class CarritoController : ControllerBase
{
    private readonly IClienteService _service;

    public CarritoController(IClienteService service)
    {
        _service = service;
    }

    [HttpDelete("vaciar/{idCliente}")]
    public async Task<IActionResult> VaciarCarrito(int idCliente)
    {
        try
        {
            await _service.VaciarCarritoAsync(idCliente);
            return NoContent(); // 204
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { mensaje = "Error al vaciar el carrito.", detalle = ex.Message });
        }
    }

    [HttpPost("agregar")]
    public async Task<IActionResult> AgregarOAumentar(
        [FromQuery] int idCliente,
        [FromQuery] int idSuministro,
        [FromQuery] int cantidad)
    {
        if (cantidad <= 0)
            return BadRequest(new { mensaje = "La cantidad debe ser mayor que cero." });

        try
        {
            await _service.AgregarOAumentarAsync(idCliente, idSuministro, cantidad);
            return Ok(new { mensaje = "Producto agregado o cantidad actualizada correctamente." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { mensaje = "Error al agregar o aumentar producto en el carrito.", detalle = ex.Message });
        }
    }

    [HttpGet("listar/{idCliente}")]
    public async Task<IActionResult> ListarPorCliente(int idCliente)
    {
        try
        {
            var lista = await _service.ListarPorClienteAsync(idCliente);

            if (lista == null || lista.Count == 0)
                return NotFound(new { mensaje = "El carrito está vacío o el cliente no existe." });

            return Ok(lista);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { mensaje = "Error al listar el carrito del cliente.", detalle = ex.Message });
        }
    }
}
