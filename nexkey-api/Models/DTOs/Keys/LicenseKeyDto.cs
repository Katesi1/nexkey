using System.ComponentModel.DataAnnotations;
using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.DTOs.Keys;

public class LicenseKeyDto
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
}

public class CreateLicenseKeyRequest
{
    [Required, MaxLength(100)] public string Key { get; set; } = null!;
    [Required] public string ProductId { get; set; } = null!;
    public LicenseKeyStatus Status { get; set; } = LicenseKeyStatus.ChuaKichHoat;
    public DateTime? ExpiresAt { get; set; }
}

public class BulkCreateLicenseKeyRequest
{
    [Required] public string ProductId { get; set; } = null!;
    [Range(1, 1000)] public int Quantity { get; set; }
    public string? Prefix { get; set; }
    public LicenseKeyStatus Status { get; set; } = LicenseKeyStatus.ChuaKichHoat;
    public DateTime? ExpiresAt { get; set; }
}

public class UpdateLicenseKeyRequest
{
    public LicenseKeyStatus? Status { get; set; }
    public DateTime? ExpiresAt { get; set; }
}

public class LockLicenseKeyRequest
{
    public bool Locked { get; set; }
}

public class AssignLicenseKeyRequest
{
    [Required] public string KeyId { get; set; } = null!;
    [Required] public string OrderId { get; set; } = null!;
    [Required] public string CustomerId { get; set; } = null!;
}

public class LicenseKeyQueryParams
{
    public LicenseKeyStatus? Status { get; set; }
    public string? ProductId { get; set; }
    public string? Search { get; set; }
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 10;
}
