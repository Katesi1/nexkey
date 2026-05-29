using NexKey.Api.Common;
using NexKey.Api.Models.DTOs.Orders;

namespace NexKey.Api.Interfaces;

public interface IOrderService
{
    Task<(List<OrderDto> Items, int Total)> GetListAsync(OrderQueryParams query);
    Task<OrderDto> GetByIdAsync(string id);
    Task<OrderDto> CreateAsync(CreateOrderRequest request);
    Task<OrderDto> UpdateAsync(string id, UpdateOrderRequest request);
    Task DeleteAsync(string id);
    Task<OrderStatsDto> GetStatsAsync();
    Task<byte[]> ExportExcelAsync(OrderQueryParams query);
    Task<OrderDto> RefundAsync(string id);
    Task<List<RevenuePointDto>> GetRevenueAsync(string period);
}
