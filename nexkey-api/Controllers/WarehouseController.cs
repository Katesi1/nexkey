using Microsoft.AspNetCore.Mvc;
using NexKey.Api.Models.DTOs.Warehouse;
using NexKey.Api.Interfaces;

namespace NexKey.Api.Controllers;

[Route("api/warehouse")]
public class WarehouseController : BaseController
{
    private readonly IWarehouseService _service;

    public WarehouseController(IWarehouseService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] WarehouseQueryParams query)
    {
        var (items, total) = await _service.GetListAsync(query);
        return Paged(items, total, query.Page, query.Limit);
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary() => Ok(await _service.GetSummaryAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id) => Ok(await _service.GetByIdAsync(id));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateWarehouseItemRequest request) =>
        Ok(await _service.CreateAsync(request));

    [HttpPatch("{id}/import")]
    public async Task<IActionResult> Import(string id, [FromBody] ImportWarehouseRequest request) =>
        Ok(await _service.ImportAsync(id, request));

    [HttpPatch("{id}/export")]
    public async Task<IActionResult> Export(string id, [FromBody] ExportWarehouseRequest request) =>
        Ok(await _service.ExportAsync(id, request));
}
