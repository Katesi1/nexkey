using Microsoft.AspNetCore.Mvc;
using NexKey.Api.Models.DTOs.Customers;
using NexKey.Api.Interfaces;

namespace NexKey.Api.Controllers;

[Route("api/customers")]
public class CustomersController : BaseController
{
    private readonly ICustomerService _service;

    public CustomersController(ICustomerService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] CustomerQueryParams query)
    {
        var (items, total) = await _service.GetListAsync(query);
        return Paged(items, total, query.Page, query.Limit);
    }

    [HttpGet("export")]
    public async Task<IActionResult> Export([FromQuery] CustomerQueryParams query)
    {
        var bytes = await _service.ExportExcelAsync(query);
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "customers.xlsx");
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id) => Ok(await _service.GetByIdAsync(id));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCustomerRequest request) =>
        Ok(await _service.CreateAsync(request));

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateCustomerRequest request) =>
        Ok(await _service.UpdateAsync(id, request));

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _service.DeleteAsync(id);
        return Ok(new { message = "ÄÃ£ xÃ³a khÃ¡ch hÃ ng" });
    }

    [HttpPatch("{id}/lock")]
    public async Task<IActionResult> Lock(string id, [FromBody] LockCustomerRequest request) =>
        Ok(await _service.LockAsync(id, request.Locked));
}
