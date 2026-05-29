namespace NexKey.Api.Models.Entities;

public class PaymentGateway
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public bool Enabled { get; set; }
    public bool TestMode { get; set; }
    public string? MerchantId { get; set; }
    public string? SecretKey { get; set; }
    public string? WebhookUrl { get; set; }
    public DateTime UpdatedAt { get; set; }
}
