using Microsoft.AspNetCore.Mvc;
using NexKey.Api.Models.DTOs.Faqs;
using NexKey.Api.Interfaces;

namespace NexKey.Api.Controllers;

[Route("api/faq")]
public class FaqController : BaseController
{
    private readonly IFaqService _service;

    public FaqController(IFaqService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] FaqQueryParams query)
    {
        var (items, total) = await _service.GetListAsync(query);
        return Paged(items, total, query.Page, query.Limit);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id) => Ok(await _service.GetByIdAsync(id));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateFaqRequest request) =>
        Ok(await _service.CreateAsync(request));

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateFaqRequest request) =>
        Ok(await _service.UpdateAsync(id, request));

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _service.DeleteAsync(id);
        return Ok(new { message = "ÄÃ£ xÃ³a FAQ" });
    }

    [HttpPatch("{id}/toggle")]
    public async Task<IActionResult> Toggle(string id) => Ok(await _service.ToggleAsync(id));

    [HttpPatch("reorder")]
    public async Task<IActionResult> Reorder([FromBody] List<ReorderFaqRequest> items)
    {
        await _service.ReorderAsync(items);
        return Ok(new { message = "ÄÃ£ cáº­p nháº­t thá»© tá»±" });
    }
}
