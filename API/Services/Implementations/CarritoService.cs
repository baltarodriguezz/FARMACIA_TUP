using API_Farmacia.DTOs;
using API_Farmacia.Models;
using API_Farmacia.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API_Farmacia.Services.Implementations
{
    public class CarritoService : ICarritoService
    {
        private readonly FarmaciaContext _context;

        public CarritoService(FarmaciaContext context)
        {
            _context = context;
        }

        public int CrearCarrito(CarritoCreateDTO dto)
        {
            var carrito = new Carrito
            {
                IdCliente = dto.IdCliente,
                Estado = "Abierto",
                FechaCreacion = DateTime.Now
            };

            _context.Carritos.Add(carrito);
            _context.SaveChanges();

            return carrito.IdCarrito;
        }

        public CarritoDTO GetCarritoByCliente(int idCliente)
        {
            var carrito = _context.Carritos
                .Include(c => c.CarritoItems)
                .ThenInclude(i => i.IdSuministroNavigation)
                .FirstOrDefault(c => c.IdCliente == idCliente && c.Estado == "Abierto");

            if (carrito == null) return null;

            return new CarritoDTO
            {
                IdCarrito = carrito.IdCarrito,
                IdCliente = carrito.IdCliente,
                Estado = carrito.Estado,
                FechaCreacion = carrito.FechaCreacion,
                Items = carrito.CarritoItems.Select(i => new CarritoItemDTO
                {
                    IdItem = i.IdItem,
                    IdSuministro = i.IdSuministro,
                    Descripcion = i.IdSuministroNavigation.Descripcion,
                    Cantidad = i.Cantidad,
                    PrecioUnitario = i.PrecioUnitario
                }).ToList()
            };
        }

        public void AgregarItem(int idCarrito, CarritoItemCreateDTO dto)
        {
            // 1. Buscamos si el item (mismo suministro) YA EXISTE en ese carrito
            var itemExistente = _context.CarritoItems.FirstOrDefault(
                i => i.IdCarrito == idCarrito && i.IdSuministro == dto.IdSuministro
            );

            if (itemExistente != null)
            {
                // 2. Si existe, solo actualizamos la cantidad
                itemExistente.Cantidad += dto.Cantidad;
            }
            else
            {
                // 3. Si no existe, lo creamos (como antes)
                //    (Usamos el precio de la BD, no el del DTO, por seguridad)
                var suministro = _context.Suministros.Find(dto.IdSuministro);
                if (suministro == null)
                    throw new Exception("Suministro no encontrado"); // Agregamos un control

                var item = new CarritoItem
                {
                    IdCarrito = idCarrito,
                    IdSuministro = dto.IdSuministro,
                    Cantidad = dto.Cantidad,
                    PrecioUnitario = (decimal)suministro.PrecioUnitario
                };
                _context.CarritoItems.Add(item);
            }

            // 4. Guardamos los cambios
            _context.SaveChanges();
        }

        public void ActualizarItem(int idItem, CarritoItemCreateDTO dto)
        {
            var item = _context.CarritoItems.Find(idItem);
            item.Cantidad = dto.Cantidad;
            _context.SaveChanges();
        }

        public void EliminarItem(int idItem)
        {
            var item = _context.CarritoItems.Find(idItem);
            _context.CarritoItems.Remove(item);
            _context.SaveChanges();
        }

        public void VaciarCarrito(int idCarrito)
        {
            var items = _context.CarritoItems.Where(i => i.IdCarrito == idCarrito);
            _context.CarritoItems.RemoveRange(items);
            _context.SaveChanges();
        }

        public int Checkout(int idCarrito, CheckoutDTO dto)
        {
            var carrito = _context.Carritos
                .Include(c => c.CarritoItems)
                .ThenInclude(i => i.IdSuministroNavigation)
                .FirstOrDefault(c => c.IdCarrito == idCarrito && c.Estado == "Abierto");

            if (carrito == null)
                throw new Exception("Carrito no encontrado o ya cerrado.");

            if (!carrito.CarritoItems.Any())
                throw new Exception("El carrito está vacío.");

            // 1. Crear factura
            var factura = new Factura
            {
                IdCliente = carrito.IdCliente,
                IdSucursal = 1, // si querés, podés parametrizar esto
                IdFormaPago = dto.IdFormaPago,
                Fecha = DateTime.Now,
                DetallesFacturas = new List<DetallesFactura>()
            };

            // 2. Crear detalles
            foreach (var item in carrito.CarritoItems)
            {
                factura.DetallesFacturas.Add(new DetallesFactura
                {
                    IdSuministro = item.IdSuministro,
                    Cantidad = item.Cantidad,
                    PreUnitario = item.PrecioUnitario
                });
            }

            _context.Facturas.Add(factura);

            // 3. Cerrar carrito
            carrito.Estado = "Cerrado";

            // 4. Guardar factura + cerrar carrito + eliminar items
            _context.SaveChanges();

            return factura.NroFactura;
        }

    }

}
