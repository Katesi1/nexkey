using System.ComponentModel.DataAnnotations;
using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.DTOs.Suppliers;

public class SupplierDto
{
    public string Id { get; set; } = null!;
    public string CompanyName { get; set; } = null!;
    public string TaxCode { get; set; } = null!;
    public string ContactPerson { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public int SuppliedProducts { get; set; }
    public long Debt { get; set; }
    public string Status { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateSupplierRequest
{
    [Required, MaxLength(200)] public string CompanyName { get; set; } = null!;
    [Required, MaxLength(20)] public string TaxCode { get; set; } = null!;
    [Required, MaxLength(100)] public string ContactPerson { get; set; } = null!;
    [Required, EmailAddress, MaxLength(150)] public string Email { get; set; } = null!;
    [Required, MaxLength(20)] public string Phone { get; set; } = null!;
    public SupplierStatus Status { get; set; } = SupplierStatus.ChoDuyet;
}

public class UpdateSupplierRequest
{
    [MaxLength(200)] public string? CompanyName { get; set; }
    [MaxLength(20)] public string? TaxCode { get; set; }
    [MaxLength(100)] public string? ContactPerson { get; set; }
    [EmailAddress, MaxLength(150)] public string? Email { get; set; }
    [MaxLength(20)] public string? Phone { get; set; }
    public SupplierStatus? Status { get; set; }
}

public class UpdateDebtRequest
{
    [Required] public long Amount { get; set; }
    [Required] public string Action { get; set; } = null!; // "add" | "subtract"
}

public class SupplierQueryParams
{
    public SupplierStatus? Status { get; set; }
    public string? Search { get; set; }
    public bool? HasDebt { get; set; }
}
