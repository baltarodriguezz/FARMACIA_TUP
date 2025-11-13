using API_Farmacia.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API_Farmacia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly IClienteService _service;
        public ClientesController(IClienteService service)
        {
            _service = service;
        }
        // GET: api/<ClientesController>
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

        // GET api/<ClientesController>/5
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            try
            {
                var cliete = _service.GetById(id);
                if (cliete == null)
                {
                    return NotFound($"No se encontró un cliente con el ID {id}.");
                }
                else
                {
                    return Ok(cliete);
                }
                    
            }
            catch (Exception)
            {

                return StatusCode(500, "Error Interno");
            }
        }
        [HttpGet ("CompraMasGrande")]
        public IActionResult GetClienteCompraMasGrande()
        {
            try
            {
                return Ok(_service.GetClienteConCompraMasGrande());
            }
            catch (Exception)
            {

                return StatusCode(500, "Error Interno");
            }
        }
        [HttpGet ("ClienteQueMasCompro")]
        public IActionResult GetClienteQueMasCompro()
        {
            try
            {
                return Ok(_service.GetClienteQueMasCompro());
            }
            catch (Exception)
            {

                return StatusCode(500, "Error Interno");
            }
        }
        [HttpGet("ClientesCredito")]
        public IActionResult GetClienteCredito()
        {
            try
            {
                return Ok(_service.GetClientesTarjetaCredito());
            }
            catch (Exception)
            {

                return StatusCode(500, "Error Interno");
            }
        }
    }
}
