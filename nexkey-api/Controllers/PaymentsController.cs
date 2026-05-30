using Microsoft.AspNetCore.Mvc;
using NexKey.Api.Models.DTOs.Payments;
using NexKey.Api.Interfaces;

namespace NexKey.Api.Controllers;

[Route("api/payments")]
public class PaymentsController : BaseController
{
    private readonly IPaymentGatewayService _service;

    public PaymentsController(IPaymentGatewayService service) => _service = service;

    [HttpGet("gateways")]
    public async Task<IActionResult> GetGateways() => Ok(await _service.GetGatewaysAsync());

    [HttpPatch("gateways/{id}")]
    public async Task<IActionResult> UpdateGateway(string id, [FromBody] UpdatePaymentGatewayRequest request) =>
        Ok(await _service.UpdateGatewayAsync(id, request));

    [HttpPost("gateways/{id}/test")]
    public async Task<IActionResult> TestConnection(string id) =>
        Ok(await _service.TestConnectionAsync(id));

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats() => Ok(await _service.GetStatsAsync());
}
