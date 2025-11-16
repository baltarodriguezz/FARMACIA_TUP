using API_Farmacia.DTOs;
using API_Farmacia.Models;
using API_Farmacia.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API_Farmacia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacturaController : ControllerBase
    {
        private readonly IFacturaService _service;
        public FacturaController(IFacturaService service)
        {
            _service = service;
        }
        // GET: api/<FacturaController>
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

        // GET api/<FacturaController>/5
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            try
            {
                var factura = _service.GetById(id);
                if (factura == null)
                {
                    return NotFound($"No se encontró una factura con el ID {id}.");
                }
                else
                {
                    return Ok(factura);
                }
            }
            catch (Exception)
            {

                return StatusCode(500, "Error Interno");
            }
        }
        [HttpGet("RecaudacionTotal")]
        public IActionResult GetRecaudacion()
        {
            try
            {
                return Ok(_service.GetRecaudacionTotal());
            }
            catch (Exception)
            {

                return StatusCode(500, "Error Interno");
            }
        }
        [HttpGet("FacturaPorCliente/{idCliente}")]
        public IActionResult GetFacturasPorCliente(int idCliente)
        {
            try
            {
                return Ok(_service.GetFacturasPorCliente(idCliente));
            }
            catch (Exception)
            {

                return StatusCode(500, "Error Interno");
            }
        }
        [HttpGet("entre-fecha")]
        public IActionResult GetFacturasEntreFechas([FromQuery] DateTime fechaInicio, [FromQuery] DateTime fechaFin)
        {
            try
            {
                return Ok(_service.GetFacturasEntreFechas(fechaInicio, fechaFin));
            }
            catch (Exception)
            {

                return StatusCode(500, "Error Interno");
            }
        }
        [HttpPost]
        public IActionResult Post(FacturaPostDTO factura)
        { 
            try
            {
                _service.postFactura(factura);
                return Ok();
            }
            catch (Exception)
            {
                return StatusCode(500, "Error Interno");
            }
        }
        [HttpGet("sucursales")]
        public async Task<IActionResult> GetSucursales()
        {
            try
            {
                return Ok(await _service.GetAllSucs());
            }
            catch (Exception)
            {
                return StatusCode(500, "Error Interno");
            }
        }
        [HttpGet("formas-pago")]
        public async Task<IActionResult> GetFormasPago()
        {
            try
            {
                return Ok(await _service.GetAllFormasPago());
            }
            catch (Exception)
            {
                return StatusCode(500, "Error Interno");
            }
        }
    }
}
