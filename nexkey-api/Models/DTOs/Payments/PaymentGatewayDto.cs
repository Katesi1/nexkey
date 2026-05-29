using System.ComponentModel.DataAnnotations;

namespace NexKey.Api.Models.DTOs.Payments;

public class PaymentGatewayDto
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public bool Enabled { get; set; }
    public bool TestMode { get; set; }
    public string? MerchantId { get; set; }
    public string? WebhookUrl { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class UpdatePaymentGatewayRequest
{
    public bool? Enabled { get; set; }
    public bool? TestMode { get; set; }
    public string? MerchantId { get; set; }
    public string? SecretKey { get; set; }
    public string? WebhookUrl { get; set; }
}

public class PaymentStatsDto
{
    public List<PaymentMethodStatDto> ByMethod { get; set; } = new();
    public long TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
}

public class PaymentMethodStatDto
{
    public string Method { get; set; } = null!;
    public int Count { get; set; }
    public long Revenue { get; set; }
}

public class PaymentTestResultDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = null!;
}
