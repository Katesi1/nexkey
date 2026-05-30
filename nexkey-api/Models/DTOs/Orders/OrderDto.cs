using System.ComponentModel.DataAnnotations;
using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.DTOs.Orders;

public class OrderDto
{
    public string Id { get; set; } = null!;
    public string CustomerId { get; set; } = null!;
    public string CustomerName { get; set; } = null!;
    public string CustomerEmail { get; set; } = null!;
    public string CustomerPhone { get; set; } = null!;
    public long Total { get; set; }
    public long Discount { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public OrderStatus Status { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderItemDto
{
    public long Id { get; set; }
    public string ProductId { get; set; } = null!;
    public string Name { get; set; } = null!;
    public long Price { get; set; }
    public int Quantity { get; set; }
    public string? LicenseKey { get; set; }
}

public class CreateOrderRequest
{
    [Required] public string CustomerId { get; set; } = null!;
    [Required] public PaymentMethod PaymentMethod { get; set; }
    public string? Note { get; set; }
    public long Discount { get; set; }
    [Required, MinLength(1)] public List<CreateOrderItemRequest> Items { get; set; } = new();
}

public class CreateOrderItemRequest
{
    [Required] public string ProductId { get; set; } = null!;
    [Range(1, int.MaxValue)] public int Quantity { get; set; }
}

public class UpdateOrderRequest
{
    public OrderStatus? Status { get; set; }
    public string? Note { get; set; }
}

public class OrderQueryParams
{
    public OrderStatus? Status { get; set; }
    public PaymentMethod? PaymentMethod { get; set; }
    public string? Search { get; set; }
    public long? MinAmount { get; set; }
    public long? MaxAmount { get; set; }
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 10;
}

public class OrderStatsDto
{
    public int DangXuLy { get; set; }
    public int HoanThanh { get; set; }
    public int DaHuy { get; set; }
    public int HoanTien { get; set; }
    public int ChoThanhToan { get; set; }
    public long TongDoanhThu { get; set; }
}

public class RevenuePointDto
{
    public string Label { get; set; } = null!;
    public long Revenue { get; set; }
    public int Orders { get; set; }
}
