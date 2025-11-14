using API_Farmacia.Models;
using API_Farmacia.Repositories.Implementations;
using API_Farmacia.Repositories.Interfaces;
using API_Farmacia.Services.Implementations;
using API_Farmacia.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ------------------------------
// 🔥 CORS: permitir frontend en 127.0.0.1:5500
// ------------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevPolicy", policy =>
    {
        policy
            .AllowAnyOrigin()        // Permite solicitudes desde cualquier origen
            .AllowAnyHeader()        // Permite todos los headers
            .AllowAnyMethod();       // Permite GET, POST, PUT, DELETE
    });
});

// ------------------------------
// DB Context
// ------------------------------
builder.Services.AddDbContext<FarmaciaContext>(o =>
    o.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ------------------------------
// Inyección de dependencias
// ------------------------------
builder.Services.AddScoped<IClienteService, ClienteService>();
builder.Services.AddScoped<IClientesRepository, ClientesRepository>();
builder.Services.AddScoped<IFacturaService, FacturaService>();
builder.Services.AddScoped<IFacturaRepository, FacturaRepository>();
builder.Services.AddScoped<ISuministrosService, SuministrosService>();
builder.Services.AddScoped<ISuministrosRepository, SuministroRepository>();
builder.Services.AddScoped<ICarritoService, CarritoService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ------------------------------
// JWT
// ------------------------------
var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]);

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// ------------------------------
// PIPELINE
// ------------------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ❗ CORRE SIEMPRE ANTES DE Authentication & Authorization
app.UseCors("DevPolicy");

// Si usás HTTP, podés comentar esta línea (solo desarrollo):
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
