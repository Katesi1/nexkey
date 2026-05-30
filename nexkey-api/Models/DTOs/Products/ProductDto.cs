using System.ComponentModel.DataAnnotations;
using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.DTOs.Products;

public class ProductDto
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
}

public class CreateProductRequest
{
    [Required, MaxLength(200)] public string Name { get; set; } = null!;
    [Required, MaxLength(50)] public string Sku { get; set; } = null!;
    [Required] public string CategoryId { get; set; } = null!;
    [Required] public ProductType Type { get; set; }
    [Range(0, long.MaxValue)] public long Price { get; set; }
    public long? ComparePrice { get; set; }
    public int Stock { get; set; }
    public ProductStatus Status { get; set; } = ProductStatus.DangBan;
    public string? Image { get; set; }
    public string? Description { get; set; }
}

public class UpdateProductRequest
{
    [MaxLength(200)] public string? Name { get; set; }
    [MaxLength(50)] public string? Sku { get; set; }
    public string? CategoryId { get; set; }
    public ProductType? Type { get; set; }
    public long? Price { get; set; }
    public long? ComparePrice { get; set; }
    public int? Stock { get; set; }
    public ProductStatus? Status { get; set; }
    public string? Image { get; set; }
    public string? Description { get; set; }
}

public class UpdateStockRequest
{
    [Required] public int Quantity { get; set; }
    [Required] public string Action { get; set; } = null!; // "add" | "subtract"
}

public class ProductQueryParams
{
    public ProductStatus? Status { get; set; }
    public string? CategoryId { get; set; }
    public ProductType? Type { get; set; }
    public string? Search { get; set; }
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 10;
}
