using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexKey.Api.Models.DTOs.Pages;
using NexKey.Api.Interfaces;

namespace NexKey.Api.Controllers;

[Route("v1/pages")]
public class PagesController : BaseController
{
    private readonly IPageService _service;

    public PagesController(IPageService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetList() => Ok(await _service.GetListAsync());

    [AllowAnonymous]
    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug) => Ok(await _service.GetBySlugAsync(slug));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id) => Ok(await _service.GetByIdAsync(id));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePageRequest request) =>
        Ok(await _service.CreateAsync(request));

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdatePageRequest request) =>
        Ok(await _service.UpdateAsync(id, request));

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _service.DeleteAsync(id);
        return Ok(new { message = "Đã xóa trang" });
    }
}
