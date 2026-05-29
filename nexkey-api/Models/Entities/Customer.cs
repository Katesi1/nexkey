using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.Entities;

public class Customer
{
    public string Id { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
    public CustomerStatus Status { get; set; }
    public DateTime JoinedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<LicenseKey> LicenseKeys { get; set; } = new List<LicenseKey>();
}
