using NexKey.Api.Models.DTOs.Payments;

namespace NexKey.Api.Interfaces;

public interface IPaymentGatewayService
{
    Task<List<PaymentGatewayDto>> GetGatewaysAsync();
    Task<PaymentGatewayDto> UpdateGatewayAsync(string id, UpdatePaymentGatewayRequest request);
    Task<PaymentTestResultDto> TestConnectionAsync(string id);
    Task<PaymentStatsDto> GetStatsAsync();
}
