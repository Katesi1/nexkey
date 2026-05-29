using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.Entities;

public class LicenseKey
{
    public string Id { get; set; } = null!;
    public string Key { get; set; } = null!;
    public string ProductId { get; set; } = null!;
    public string ProductName { get; set; } = null!;
    public string? CustomerId { get; set; }
    public string? CustomerName { get; set; }
    public string? OrderId { get; set; }
    public DateTime? ActivatedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public LicenseKeyStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }

    public Product Product { get; set; } = null!;
    public Customer? Customer { get; set; }
    public Order? Order { get; set; }
}
