using Microsoft.EntityFrameworkCore;
using NexKey.Api.Common;
using NexKey.Api.Models.DTOs.Payments;
using NexKey.Api.Interfaces;
using NexKey.Api.Models.Enums;
using NexKey.Api.Data;

namespace NexKey.Api.Services;

public class PaymentGatewayService : IPaymentGatewayService
{
    private readonly AppDbContext _db;

    public PaymentGatewayService(AppDbContext db) => _db = db;

    public async Task<List<PaymentGatewayDto>> GetGatewaysAsync()
    {
        var gateways = await _db.PaymentGateways.OrderBy(g => g.Id).ToListAsync();
        return gateways.Select(g => new PaymentGatewayDto
        {
            Id = g.Id, Name = g.Name, Enabled = g.Enabled, TestMode = g.TestMode,
            MerchantId = g.MerchantId, WebhookUrl = g.WebhookUrl, UpdatedAt = g.UpdatedAt
        }).ToList();
    }

    public async Task<PaymentGatewayDto> UpdateGatewayAsync(string id, UpdatePaymentGatewayRequest request)
    {
        var gateway = await _db.PaymentGateways.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy cổng thanh toán {id}");

        if (request.Enabled.HasValue) gateway.Enabled = request.Enabled.Value;
        if (request.TestMode.HasValue) gateway.TestMode = request.TestMode.Value;
        if (request.MerchantId != null) gateway.MerchantId = request.MerchantId;
        if (request.SecretKey != null) gateway.SecretKey = request.SecretKey;
        if (request.WebhookUrl != null) gateway.WebhookUrl = request.WebhookUrl;
        gateway.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return new PaymentGatewayDto
        {
            Id = gateway.Id, Name = gateway.Name, Enabled = gateway.Enabled,
            TestMode = gateway.TestMode, MerchantId = gateway.MerchantId,
            WebhookUrl = gateway.WebhookUrl, UpdatedAt = gateway.UpdatedAt
        };
    }

    public async Task<PaymentTestResultDto> TestConnectionAsync(string id)
    {
        var gateway = await _db.PaymentGateways.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy cổng thanh toán {id}");

        if (!gateway.Enabled)
            return new PaymentTestResultDto { Success = false, Message = $"{gateway.Name} chưa được bật" };

        if (string.IsNullOrWhiteSpace(gateway.MerchantId))
            return new PaymentTestResultDto { Success = false, Message = "Chưa cấu hình Merchant ID" };

        if (string.IsNullOrWhiteSpace(gateway.SecretKey))
            return new PaymentTestResultDto { Success = false, Message = "Chưa cấu hình Secret Key" };

        return new PaymentTestResultDto
        {
            Success = true,
            Message = $"Cấu hình {gateway.Name} hợp lệ. Sẵn sàng nhận thanh toán."
        };
    }

    public async Task<PaymentStatsDto> GetStatsAsync()
    {
        var orders = await _db.Orders.Where(o => o.Status == OrderStatus.HoanThanh).ToListAsync();

        var byMethod = orders.GroupBy(o => o.PaymentMethod)
            .Select(g => new PaymentMethodStatDto
            {
                Method = g.Key,
                Count = g.Count(),
                Revenue = g.Sum(o => o.Total)
            }).ToList();

        return new PaymentStatsDto
        {
            ByMethod = byMethod,
            TotalRevenue = orders.Sum(o => o.Total),
            TotalOrders = orders.Count
        };
    }
}
