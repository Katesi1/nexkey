using Microsoft.AspNetCore.Mvc;
using NexKey.Api.Models.DTOs.Keys;
using NexKey.Api.Interfaces;

namespace NexKey.Api.Controllers;

[Route("api/keys")]
public class LicenseKeysController : BaseController
{
    private readonly ILicenseKeyService _service;

    public LicenseKeysController(ILicenseKeyService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] LicenseKeyQueryParams query)
    {
        var (items, total) = await _service.GetListAsync(query);
        return Paged(items, total, query.Page, query.Limit);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id) => Ok(await _service.GetByIdAsync(id));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateLicenseKeyRequest request) =>
        Ok(await _service.CreateAsync(request));

    [HttpPost("bulk")]
    public async Task<IActionResult> BulkCreate([FromBody] BulkCreateLicenseKeyRequest request) =>
        Ok(await _service.BulkCreateAsync(request));

    [HttpPost("assign")]
    public async Task<IActionResult> Assign([FromBody] AssignLicenseKeyRequest request) =>
        Ok(await _service.AssignAsync(request));

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateLicenseKeyRequest request) =>
        Ok(await _service.UpdateAsync(id, request));

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _service.DeleteAsync(id);
        return Ok(new { message = "ÄÃ£ xÃ³a key" });
    }

    [HttpPatch("{id}/lock")]
    public async Task<IActionResult> Lock(string id, [FromBody] LockLicenseKeyRequest request) =>
        Ok(await _service.LockAsync(id, request.Locked));
}
