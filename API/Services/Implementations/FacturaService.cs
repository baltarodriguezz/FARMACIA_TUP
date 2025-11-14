using API_Farmacia.DTOs;
using API_Farmacia.Models;
using API_Farmacia.Repositories.Interfaces;
using API_Farmacia.Services.Interfaces;

namespace API_Farmacia.Services.Implementations
{
    public class FacturaService : IFacturaService
    {
        private readonly IFacturaRepository _repository;
        public FacturaService(IFacturaRepository repository)
        {
            _repository = repository;
        }

        public List<FacturaDTO> GetAll()
        {
            var facturas = _repository.GetAll();

            var facturasDTO = facturas.Select(f => new FacturaDTO
            {
                IdFactura = f.NroFactura,
                IdCliente = f.IdCliente,
                IdSucursal = f.IdSucursal,
                IdFormaPago = f.IdFormaPago,
                FechaEmision = f.Fecha,
                Total = (double)f.DetallesFacturas.Sum(d => d.Cantidad * d.PreUnitario),
                Detalles = f.DetallesFacturas.Select(d => new DetalleFacturaDTO
                {
                    IdDetalleFactura = d.NroDetalleFactura,
                    IdFactura = d.NroFactura,
                    IdSuministro = d.IdSuministro,
                    Cantidad = d.Cantidad,
                    PrecioUnitario = d.PreUnitario
                }).ToList()
            }).ToList();

            return facturasDTO;
        }

        public FacturaDTO? GetById(int id)
        {
            var factura = _repository.GetById(id);

            if (factura == null)
                return null;

            var facturaDTO = new FacturaDTO
            {
                IdFactura = factura.NroFactura,
                IdCliente = factura.IdCliente,
                IdSucursal = factura.IdSucursal,
                IdFormaPago = factura.IdFormaPago,
                FechaEmision = factura.Fecha,
                Total = (double)factura.DetallesFacturas.Sum(d => d.Cantidad * d.PreUnitario),
                Detalles = factura.DetallesFacturas.Select(d => new DetalleFacturaDTO
                {
                    IdDetalleFactura = d.NroDetalleFactura,
                    IdFactura = d.NroFactura,
                    IdSuministro = d.IdSuministro,
                    Cantidad = d.Cantidad,
                    PrecioUnitario = d.PreUnitario
                }).ToList()
            };

            return facturaDTO;
        }

        public List<FacturaDTO> GetFacturasEntreFechas(DateTime fechaInicio, DateTime fechaFin)
        {
            var facturas = _repository.GetFacturasEntreFechas(fechaInicio, fechaFin);
            var facturasDTO = facturas.Select(f => new FacturaDTO
            {
                IdFactura = f.NroFactura,
                IdCliente = f.IdCliente,
                IdSucursal = f.IdSucursal,
                IdFormaPago = f.IdFormaPago,
                FechaEmision = f.Fecha,
                Total = (double)f.DetallesFacturas.Sum(d => d.Cantidad * d.PreUnitario),
                Detalles = f.DetallesFacturas.Select(d => new DetalleFacturaDTO
                {
                    IdDetalleFactura = d.NroDetalleFactura,
                    IdFactura = d.NroFactura,
                    IdSuministro = d.IdSuministro,
                    Cantidad = d.Cantidad,
                    PrecioUnitario = d.PreUnitario
                }).ToList()
            }).ToList();
            return facturasDTO;
        }

        public List<FacturaDTO> GetFacturasPorCliente(int clienteId)
        {
            var facturas = _repository.GetFacturasPorCliente(clienteId);
            var facturasDTO = facturas.Select(f => new FacturaDTO
            {
                IdFactura = f.NroFactura,
                IdCliente = f.IdCliente,
                IdSucursal = f.IdSucursal,
                IdFormaPago = f.IdFormaPago,
                FechaEmision = f.Fecha,
                Total = (double)f.DetallesFacturas.Sum(d => d.Cantidad * d.PreUnitario),
                Detalles = f.DetallesFacturas.Select(d => new DetalleFacturaDTO
                {
                    IdDetalleFactura = d.NroDetalleFactura,
                    IdFactura = d.NroFactura,
                    IdSuministro = d.IdSuministro,
                    Cantidad = d.Cantidad,
                    PrecioUnitario = d.PreUnitario
                }).ToList()
            }).ToList();
            return facturasDTO;
        }

        public double GetRecaudacionTotal()
        {
            return _repository.GetRecaudacionTotal();
        }

        public void postFactura(FacturaPostDTO factura)
        {
            var facturaModel = new Factura
            {
                IdCliente = (int)factura.IdCliente,
                IdFormaPago = (int)factura.IdFormaPago,
                Fecha = factura.FechaEmision,
                IdSucursal = (int)factura.IdSucursal,
                DetallesFacturas = factura.Detalles.Select(d => new DetallesFactura
                {
                    NroFactura =_repository.GetNextFacturaNumber(),
                    IdSuministro = d.IdSuministro,
                    Cantidad = d.Cantidad,
                    PreUnitario = d.PrecioUnitario
                }).ToList()
            };
            _repository.postFactura(facturaModel);
        }
    }
}
