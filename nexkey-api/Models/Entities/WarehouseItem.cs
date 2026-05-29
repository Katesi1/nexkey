using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.Entities;

public class WarehouseItem
{
    public string Id { get; set; } = null!;
    public string ProductId { get; set; } = null!;
    public string ProductName { get; set; } = null!;
    public string Sku { get; set; } = null!;
    public string Warehouse { get; set; } = null!;
    public int Quantity { get; set; }
    public string Unit { get; set; } = null!;
    public long CostPrice { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Product Product { get; set; } = null!;

    public long InventoryValue => (long)CostPrice * Quantity;

    public WarehouseStatus Status => Quantity == 0
        ? WarehouseStatus.HetHang
        : Quantity < 20
            ? WarehouseStatus.SapHet
            : WarehouseStatus.ConHang;
}
