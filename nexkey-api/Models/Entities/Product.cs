using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.Entities;

public class Product
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Sku { get; set; } = null!;
    public string CategoryId { get; set; } = null!;
    public string CategoryName { get; set; } = null!;
    public ProductType Type { get; set; }
    public long Price { get; set; }
    public long? ComparePrice { get; set; }
    public int Stock { get; set; }
    public int Sold { get; set; }
    public ProductStatus Status { get; set; }
    public string? Image { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Category Category { get; set; } = null!;
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public ICollection<WarehouseItem> WarehouseItems { get; set; } = new List<WarehouseItem>();
    public ICollection<LicenseKey> LicenseKeys { get; set; } = new List<LicenseKey>();
}
