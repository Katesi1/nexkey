using Microsoft.AspNetCore.Mvc;
using NexKey.Api.Models.DTOs.Orders;
using NexKey.Api.Interfaces;

namespace NexKey.Api.Controllers;

[Route("api/orders")]
public class OrdersController : BaseController
{
    private readonly IOrderService _service;

    public OrdersController(IOrderService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] OrderQueryParams query)
    {
        var (items, total) = await _service.GetListAsync(query);
        return Paged(items, total, query.Page, query.Limit);
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats() => Ok(await _service.GetStatsAsync());

    [HttpGet("revenue")]
    public async Task<IActionResult> GetRevenue([FromQuery] string period = "7d") =>
        Ok(await _service.GetRevenueAsync(period));

    [HttpGet("export")]
    public async Task<IActionResult> Export([FromQuery] OrderQueryParams query)
    {
        var bytes = await _service.ExportExcelAsync(query);
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "orders.xlsx");
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id) => Ok(await _service.GetByIdAsync(id));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderRequest request) =>
        Ok(await _service.CreateAsync(request));

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateOrderRequest request) =>
        Ok(await _service.UpdateAsync(id, request));

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _service.DeleteAsync(id);
        return Ok(new { message = "ÄÃ£ xÃ³a Ä‘Æ¡n hÃ ng" });
    }

    [HttpPost("{id}/refund")]
    public async Task<IActionResult> Refund(string id) => Ok(await _service.RefundAsync(id));
}
