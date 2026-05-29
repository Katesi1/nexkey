using System.ComponentModel.DataAnnotations;
using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.DTOs.Customers;

public class CustomerDto
{
    public string Id { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
    public int TotalOrders { get; set; }
    public long TotalSpending { get; set; }
    public string Status { get; set; } = null!;
    public DateTime JoinedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CustomerDetailDto : CustomerDto
{
    public List<CustomerOrderDto> Orders { get; set; } = new();
}

public class CustomerOrderDto
{
    public string Id { get; set; } = null!;
    public long Total { get; set; }
    public string Status { get; set; } = null!;
    public string PaymentMethod { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}

public class CreateCustomerRequest
{
    [Required, MaxLength(100)] public string FullName { get; set; } = null!;
    [Required, EmailAddress, MaxLength(150)] public string Email { get; set; } = null!;
    [MaxLength(20)] public string? Phone { get; set; }
    public string? Avatar { get; set; }
    public CustomerStatus Status { get; set; } = CustomerStatus.HoatDong;
}

public class UpdateCustomerRequest
{
    [MaxLength(100)] public string? FullName { get; set; }
    [EmailAddress, MaxLength(150)] public string? Email { get; set; }
    [MaxLength(20)] public string? Phone { get; set; }
    public string? Avatar { get; set; }
    public CustomerStatus? Status { get; set; }
}

public class LockCustomerRequest
{
    public bool Locked { get; set; }
}

public class CustomerQueryParams
{
    public CustomerStatus? Status { get; set; }
    public string? Search { get; set; }
    public long? MinSpending { get; set; }
    public long? MaxSpending { get; set; }
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 10;
}
