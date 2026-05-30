using Microsoft.AspNetCore.Mvc;
using NexKey.Api.Models.DTOs.Suppliers;
using NexKey.Api.Interfaces;

namespace NexKey.Api.Controllers;

[Route("api/suppliers")]
public class SuppliersController : BaseController
{
    private readonly ISupplierService _service;

    public SuppliersController(ISupplierService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] SupplierQueryParams query) =>
        Ok(await _service.GetListAsync(query));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id) => Ok(await _service.GetByIdAsync(id));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSupplierRequest request) =>
        Ok(await _service.CreateAsync(request));

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateSupplierRequest request) =>
        Ok(await _service.UpdateAsync(id, request));

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _service.DeleteAsync(id);
        return Ok(new { message = "ÄÃ£ xÃ³a nhÃ  cung cáº¥p" });
    }

    [HttpPatch("{id}/debt")]
    public async Task<IActionResult> UpdateDebt(string id, [FromBody] UpdateDebtRequest request) =>
        Ok(await _service.UpdateDebtAsync(id, request));
}
