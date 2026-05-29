using System.ComponentModel.DataAnnotations;
using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.DTOs.Warehouse;

public class WarehouseItemDto
{
    public string Id { get; set; } = null!;
    public string ProductId { get; set; } = null!;
    public string ProductName { get; set; } = null!;
    public string Sku { get; set; } = null!;
    public string Warehouse { get; set; } = null!;
    public int Quantity { get; set; }
    public string Unit { get; set; } = null!;
    public long CostPrice { get; set; }
    public long InventoryValue { get; set; }
    public string Status { get; set; } = null!;
    public DateTime UpdatedAt { get; set; }
}

public class CreateWarehouseItemRequest
{
    [Required] public string ProductId { get; set; } = null!;
    [Required] public string Warehouse { get; set; } = null!;
    [Range(0, int.MaxValue)] public int Quantity { get; set; }
    [Required] public string Unit { get; set; } = null!;
    [Range(0, long.MaxValue)] public long CostPrice { get; set; }
}

public class ImportWarehouseRequest
{
    [Range(1, int.MaxValue)] public int Quantity { get; set; }
    [Range(0, long.MaxValue)] public long CostPrice { get; set; }
}

public class ExportWarehouseRequest
{
    [Range(1, int.MaxValue)] public int Quantity { get; set; }
}

public class WarehouseQueryParams
{
    public string? Warehouse { get; set; }
    public WarehouseStatus? Status { get; set; }
    public string? Search { get; set; }
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 10;
}

public class WarehouseSummaryDto
{
    public List<WarehouseGroupDto> ByWarehouse { get; set; } = new();
    public long TotalValue { get; set; }
    public int TotalQuantity { get; set; }
}

public class WarehouseGroupDto
{
    public string Warehouse { get; set; } = null!;
    public int Quantity { get; set; }
    public long Value { get; set; }
}
