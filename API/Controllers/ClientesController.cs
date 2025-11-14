using API_Farmacia.DTOs;
using API_Farmacia.Services.Implementations;
using API_Farmacia.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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

        [HttpGet("me")]
        [Authorize]  
        public IActionResult GetMe()
        {
            try
            {

                var email = User.FindFirst(ClaimTypes.Email)?.Value;

                if (string.IsNullOrEmpty(email))
                    return Unauthorized("No se pudo obtener el email del token.");


                var cliente = _service.GetByEmail(email);

                if (cliente == null)
                    return NotFound($"No se encontró un cliente con el email {email}.");


                return Ok(cliente);
            }
            catch (Exception)
            {
                return StatusCode(500, "Error Interno");
            }
        }

        [HttpPut("me")]
        [Authorize]
        public IActionResult UpdateMe([FromBody] UpdateClienteDto dto)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
                return Unauthorized();

            var ok = _service.ActualizarPerfil(email, dto);

            if (!ok)
                return NotFound("No se encontró el cliente logueado.");

            return NoContent(); 
        }

        [HttpPost("register")]
        [AllowAnonymous] 
        public IActionResult Register([FromBody] RegisterClienteDto dto)
        {
            try
            {
                var nuevo = _service.RegistrarCliente(dto);
                return Ok(nuevo);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
