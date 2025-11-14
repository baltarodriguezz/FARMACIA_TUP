using FARMACIA.Models;
using FARMACIA.Repositories.Implementations;
using FARMACIA.Repositories.Interfaces;
using FARMACIA.Services.Implementations;
using FARMACIA.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// DB
builder.Services.AddDbContext<tpi_farmaciaContext>(o =>
    o.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ========== CORS PARA PERMITIR FRONTEND (LIVE SERVER) ==========
const string CORS_POLICY = "PermitirFrontend";

builder.Services.AddCors(options =>
{
    options.AddPolicy(CORS_POLICY, policy =>
    {
        policy
            .WithOrigins(
                "http://127.0.0.1:5500",
                "http://localhost:5500"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// SERVICES
builder.Services.AddControllers();
builder.Services.AddScoped<ISuministroService, SuministroService>();
builder.Services.AddScoped<ISuministrosRepository, SuministroRepository>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ========== ACTIVAR CORS ANTES DE TODO ==========
app.UseCors(CORS_POLICY);

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
