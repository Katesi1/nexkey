using NexKey.Api.Models.DTOs.Warehouse;

namespace NexKey.Api.Interfaces;

public interface IWarehouseService
{
    Task<(List<WarehouseItemDto> Items, int Total)> GetListAsync(WarehouseQueryParams query);
    Task<WarehouseItemDto> GetByIdAsync(string id);
    Task<WarehouseItemDto> CreateAsync(CreateWarehouseItemRequest request);
    Task<WarehouseItemDto> ImportAsync(string id, ImportWarehouseRequest request);
    Task<WarehouseItemDto> ExportAsync(string id, ExportWarehouseRequest request);
    Task<WarehouseSummaryDto> GetSummaryAsync();
}
