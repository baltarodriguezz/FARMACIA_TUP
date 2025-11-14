using API_Farmacia.DTOs;
using API_Farmacia.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API_Farmacia.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarritoController : ControllerBase
    {
        private readonly ICarritoService _service;

        public CarritoController(ICarritoService service)
        {
            _service = service;
        }

        [HttpPost]
        public IActionResult CrearCarrito(CarritoCreateDTO dto)
        {
            var id = _service.CrearCarrito(dto);
            return Ok(id);
        }

        [HttpGet("cliente/{idCliente}")]
        public IActionResult GetCarrito(int idCliente)
        {
            var carrito = _service.GetCarritoByCliente(idCliente);
            return Ok(carrito);
        }

        [HttpPost("{idCarrito}/items")]
        public IActionResult AddItem(int idCarrito, CarritoItemCreateDTO dto)
        {
            _service.AgregarItem(idCarrito, dto);
            return Ok();
        }

        [HttpPut("items/{idItem}")]
        public IActionResult UpdateItem(int idItem, CarritoItemCreateDTO dto)
        {
            _service.ActualizarItem(idItem, dto);
            return Ok();
        }

        [HttpDelete("items/{idItem}")]
        public IActionResult DeleteItem(int idItem)
        {
            _service.EliminarItem(idItem);
            return Ok();
        }

        [HttpDelete("{idCarrito}")]
        public IActionResult Vaciar(int idCarrito)
        {
            _service.VaciarCarrito(idCarrito);
            return Ok();
        }

        [HttpPost("{idCarrito}/checkout")]
        public IActionResult Checkout(int idCarrito, CheckoutDTO dto)
        {
            try
            {
                var facturaId = _service.Checkout(idCarrito, dto);
                return Ok(new { facturaId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
