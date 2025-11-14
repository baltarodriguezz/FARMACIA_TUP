using API_Farmacia.DTOs;
using API_Farmacia.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API_Farmacia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IClienteService _service;
        private readonly IConfiguration _config;

        public LoginController(IClienteService service, IConfiguration config)
        {
            _service = service;
            _config = config;
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDto login)
        {
            bool existe = _service.Login(login);

            if (!existe)
                return Unauthorized("Email o contraseña incorrectos");

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, login.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new { token = tokenString });
        }
    }
}
