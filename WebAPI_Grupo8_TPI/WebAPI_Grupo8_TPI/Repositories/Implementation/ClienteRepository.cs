using Microsoft.EntityFrameworkCore;
using WebAPI_Grupo8_TPI.DTOS;
using WebAPI_Grupo8_TPI.Models;
using WebAPI_Grupo8_TPI.Repositories.Interfaces;

namespace WebAPI_Grupo8_TPI.Repositories.Implementation
{
    public class ClienteRepository : IClienteRepository
    {
        private readonly tpi_prograIContext _context;
        public ClienteRepository(tpi_prograIContext context)
        {
            _context = context;
        }
        public async Task AgregarOAumentarAsync(int idCliente, int idSuministro, int cantidad)
        {
            var existeCliente = await _context.Clientes.AnyAsync(c => c.IdCliente == idCliente);
            if (!existeCliente)
                throw new Exception("El cliente especificado no existe.");

            var suministro = await _context.Suministros
                .FirstOrDefaultAsync(s => s.IdSuministro == idSuministro);

            if (suministro == null)
                throw new Exception("El suministro especificado no existe.");

            if (cantidad <= 0)
                throw new Exception("La cantidad debe ser mayor que cero.");

            await _context.Database.ExecuteSqlAsync(
                $"EXEC Agregar_o_Aumentar @id_cliente = {idCliente}, @id_suministro = {idSuministro}, @cantidad = {cantidad}");
        }
        
        public async Task<List<CarritoDTO>> ListarPorClienteAsync(int idCliente)
        {
            var lista = new List<CarritoDTO>();

            using (var connection = _context.Database.GetDbConnection())
            {
                await connection.OpenAsync();

                using (var command = connection.CreateCommand())
                {
                    command.CommandText = "ListarPorCliente";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var param = command.CreateParameter();
                    param.ParameterName = "@id_cliente";
                    param.Value = idCliente;
                    command.Parameters.Add(param);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var dto = new CarritoDTO
                            {
                                IdCarrito = reader.GetInt32(reader.GetOrdinal("id_carrito")),
                                IdCliente = reader.GetInt32(reader.GetOrdinal("id_cliente")),
                                IdSuministro = reader.GetInt32(reader.GetOrdinal("id_suministro")),
                                Descripcion = reader.GetString(reader.GetOrdinal("descripcion")),
                                Cantidad = reader.GetInt32(reader.GetOrdinal("cantidad")),
                                PrecioUnitario = Convert.ToDouble(reader["precio_unitario"]),
                                Subtotal = Convert.ToDouble(reader["subtotal"])
                            };

                            lista.Add(dto);
                        }
                    }
                }
            }

            return lista;
        }

        public async Task VaciarCarritoAsync(int idCliente)
        {
            await _context.Database.ExecuteSqlRawAsync("EXEC Vaciar_Carrito @p0", idCliente);
        }
    }
}
