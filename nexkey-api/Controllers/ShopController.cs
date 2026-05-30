using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexKey.Api.Interfaces;
using NexKey.Api.Models.DTOs.Customers;
using NexKey.Api.Models.DTOs.Orders;
using NexKey.Api.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace NexKey.Api.Controllers;

/// <summary>
/// Public endpoints dành cho web storefront (không cần JWT admin).
/// </summary>
[Route("api/shop")]
public class ShopController : BaseController
{
    private readonly ICustomerService _customers;
    private readonly IOrderService _orders;

    public ShopController(ICustomerService customers, IOrderService orders)
    {
        _customers = customers;
        _orders = orders;
    }

    /// <summary>
    /// Guest checkout: tìm hoặc tạo khách hàng rồi tạo đơn hàng.
    /// </summary>
    [AllowAnonymous]
    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout([FromBody] ShopCheckoutRequest req)
    {
        // Tìm khách hàng theo email
        var (existing, _) = await _customers.GetListAsync(
            new CustomerQueryParams { Search = req.Email, Limit = 5 });

        var customer = existing.FirstOrDefault(c =>
            c.Email.Equals(req.Email, StringComparison.OrdinalIgnoreCase));

        string customerId;
        if (customer != null)
        {
            customerId = customer.Id;
        }
        else
        {
            var created = await _customers.CreateAsync(new CreateCustomerRequest
            {
                FullName = req.FullName,
                Email    = req.Email,
                Phone    = req.Phone ?? "",
                Status   = CustomerStatus.HoatDong,
            });
            customerId = created.Id;
        }

        var order = await _orders.CreateAsync(new CreateOrderRequest
        {
            CustomerId    = customerId,
            PaymentMethod = req.PaymentMethod,
            Note          = req.Note,
            Discount      = req.Discount,
            Items         = req.Items.Select(i => new CreateOrderItemRequest
            {
                ProductId = i.ProductId,
                Quantity  = i.Quantity,
            }).ToList(),
        });

        return Ok(order);
    }

    /// <summary>
    /// Xem chi tiết đơn hàng theo ID (public — ai có ID đều xem được).
    /// </summary>
    [AllowAnonymous]
    [HttpGet("orders/{id}")]
    public async Task<IActionResult> GetOrder(string id) =>
        Ok(await _orders.GetByIdAsync(id));
}

// ── Request DTOs ───────────────────────────────────────────────────────────

public class ShopCheckoutRequest
{
    [Required, MaxLength(100)]          public string FullName      { get; set; } = null!;
    [Required, EmailAddress, MaxLength(150)] public string Email    { get; set; } = null!;
    [MaxLength(20)]                     public string? Phone        { get; set; }
    [Required]                          public PaymentMethod PaymentMethod { get; set; }
    public string? Note    { get; set; }
    public long    Discount { get; set; }
    [Required, MinLength(1)] public List<ShopItemRequest> Items { get; set; } = new();
}

public class ShopItemRequest
{
    [Required]               public string ProductId { get; set; } = null!;
    [Range(1, int.MaxValue)] public int    Quantity  { get; set; }
}
