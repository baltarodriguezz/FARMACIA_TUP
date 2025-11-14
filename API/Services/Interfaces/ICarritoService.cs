using API_Farmacia.DTOs;

namespace API_Farmacia.Services.Interfaces
{
    public interface ICarritoService
    {
        int CrearCarrito(CarritoCreateDTO dto);
        CarritoDTO GetCarritoByCliente(int idCliente);
        void AgregarItem(int idCarrito, CarritoItemCreateDTO dto);
        void ActualizarItem(int idItem, CarritoItemCreateDTO dto);
        void EliminarItem(int idItem);
        void VaciarCarrito(int idCarrito);
        int Checkout(int idCarrito, CheckoutDTO dto);
    }
}
