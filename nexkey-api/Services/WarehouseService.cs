using Microsoft.EntityFrameworkCore;
using NexKey.Api.Common;
using NexKey.Api.Models.DTOs.Warehouse;
using NexKey.Api.Interfaces;
using NexKey.Api.Models.Entities;
using NexKey.Api.Data;

namespace NexKey.Api.Services;

public class WarehouseService : IWarehouseService
{
    private readonly AppDbContext _db;

    public WarehouseService(AppDbContext db) => _db = db;

    public async Task<(List<WarehouseItemDto> Items, int Total)> GetListAsync(WarehouseQueryParams q)
    {
        var query = _db.WarehouseItems.AsQueryable();

        if (!string.IsNullOrWhiteSpace(q.Warehouse)) query = query.Where(w => w.Warehouse == q.Warehouse);
        if (!string.IsNullOrWhiteSpace(q.Search))
        {
            var s = q.Search.ToLower();
            query = query.Where(w => w.ProductName.ToLower().Contains(s) || w.Sku.ToLower().Contains(s));
        }

        var all = await query.OrderByDescending(w => w.UpdatedAt).ToListAsync();

        if (q.Status.HasValue)
            all = all.Where(w => w.Status == q.Status.Value).ToList();

        var total = all.Count;
        var items = all.Skip((q.Page - 1) * q.Limit).Take(q.Limit).ToList();

        return (items.Select(MapToDto).ToList(), total);
    }

    public async Task<WarehouseItemDto> GetByIdAsync(string id)
    {
        var item = await _db.WarehouseItems.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy mặt hàng kho {id}");
        return MapToDto(item);
    }

    public async Task<WarehouseItemDto> CreateAsync(CreateWarehouseItemRequest request)
    {
        var product = await _db.Products.FindAsync(request.ProductId)
            ?? throw AppException.NotFound("Không tìm thấy sản phẩm");

        var item = new WarehouseItem
        {
            Id = Guid.NewGuid().ToString(),
            ProductId = request.ProductId,
            ProductName = product.Name,
            Sku = product.Sku,
            Warehouse = request.Warehouse,
            Quantity = request.Quantity,
            Unit = request.Unit,
            CostPrice = request.CostPrice,
            UpdatedAt = DateTime.UtcNow
        };

        _db.WarehouseItems.Add(item);
        await _db.SaveChangesAsync();
        return MapToDto(item);
    }

    public async Task<WarehouseItemDto> ImportAsync(string id, ImportWarehouseRequest request)
    {
        var item = await _db.WarehouseItems.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy mặt hàng kho {id}");

        item.Quantity += request.Quantity;
        item.CostPrice = request.CostPrice > 0 ? request.CostPrice : item.CostPrice;
        item.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return MapToDto(item);
    }

    public async Task<WarehouseItemDto> ExportAsync(string id, ExportWarehouseRequest request)
    {
        var item = await _db.WarehouseItems.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy mặt hàng kho {id}");

        if (item.Quantity < request.Quantity)
            throw AppException.Unprocessable($"Số lượng tồn ({item.Quantity}) không đủ để xuất ({request.Quantity})");

        item.Quantity -= request.Quantity;
        item.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return MapToDto(item);
    }

    public async Task<WarehouseSummaryDto> GetSummaryAsync()
    {
        var items = await _db.WarehouseItems.ToListAsync();

        var byWarehouse = items.GroupBy(w => w.Warehouse).Select(g => new WarehouseGroupDto
        {
            Warehouse = g.Key,
            Quantity = g.Sum(w => w.Quantity),
            Value = g.Sum(w => w.InventoryValue)
        }).ToList();

        return new WarehouseSummaryDto
        {
            ByWarehouse = byWarehouse,
            TotalValue = items.Sum(w => w.InventoryValue),
            TotalQuantity = items.Sum(w => w.Quantity)
        };
    }

    private static WarehouseItemDto MapToDto(WarehouseItem w) => new()
    {
        Id = w.Id, ProductId = w.ProductId, ProductName = w.ProductName, Sku = w.Sku,
        Warehouse = w.Warehouse, Quantity = w.Quantity, Unit = w.Unit,
        CostPrice = w.CostPrice, InventoryValue = w.InventoryValue,
        Status = w.Status.ToString(), UpdatedAt = w.UpdatedAt
    };
}
