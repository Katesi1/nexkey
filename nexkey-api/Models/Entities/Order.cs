using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.Entities;

public class Order
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

    public Customer Customer { get; set; } = null!;
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}

public class OrderItem
{
    public long Id { get; set; }
    public string OrderId { get; set; } = null!;
    public string ProductId { get; set; } = null!;
    public string Name { get; set; } = null!;
    public long Price { get; set; }
    public int Quantity { get; set; }
    public string? LicenseKey { get; set; }

    public Order Order { get; set; } = null!;
    public Product Product { get; set; } = null!;
}
