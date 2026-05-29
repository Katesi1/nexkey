using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.Entities;

public class Supplier
{
    public string Id { get; set; } = null!;
    public string CompanyName { get; set; } = null!;
    public string TaxCode { get; set; } = null!;
    public string ContactPerson { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public long Debt { get; set; }
    public SupplierStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
