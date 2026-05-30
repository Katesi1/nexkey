using Microsoft.AspNetCore.Mvc;
using NexKey.Api.Models.DTOs.Banners;
using NexKey.Api.Interfaces;

namespace NexKey.Api.Controllers;

[Route("api/banners")]
public class BannersController : BaseController
{
    private readonly IBannerService _service;

    public BannersController(IBannerService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] BannerQueryParams query) =>
        Ok(await _service.GetListAsync(query));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id) => Ok(await _service.GetByIdAsync(id));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBannerRequest request) =>
        Ok(await _service.CreateAsync(request));

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateBannerRequest request) =>
        Ok(await _service.UpdateAsync(id, request));

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _service.DeleteAsync(id);
        return Ok(new { message = "ÄÃ£ xÃ³a banner" });
    }

    [HttpPatch("{id}/toggle")]
    public async Task<IActionResult> Toggle(string id) => Ok(await _service.ToggleAsync(id));

    [HttpPatch("reorder")]
    public async Task<IActionResult> Reorder([FromBody] List<ReorderBannerRequest> items)
    {
        await _service.ReorderAsync(items);
        return Ok(new { message = "ÄÃ£ cáº­p nháº­t thá»© tá»±" });
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { success = false, error = "KhÃ´ng cÃ³ file", code = "VALIDATION_ERROR" });

        using var stream = file.OpenReadStream();
        var url = await _service.UploadImageAsync(stream, file.FileName);
        return Ok(new { url });
    }
}
