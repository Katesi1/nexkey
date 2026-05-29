using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexKey.Api.Models.DTOs.Articles;
using NexKey.Api.Interfaces;

namespace NexKey.Api.Controllers;

[Route("v1/articles")]
public class ArticlesController : BaseController
{
    private readonly IArticleService _service;

    public ArticlesController(IArticleService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] ArticleQueryParams query)
    {
        var (items, total) = await _service.GetListAsync(query);
        return Paged(items, total, query.Page, query.Limit);
    }

    [AllowAnonymous]
    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug) => Ok(await _service.GetBySlugAsync(slug));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id) => Ok(await _service.GetByIdAsync(id));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateArticleRequest request) =>
        Ok(await _service.CreateAsync(request));

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateArticleRequest request) =>
        Ok(await _service.UpdateAsync(id, request));

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _service.DeleteAsync(id);
        return Ok(new { message = "Đã xóa bài viết" });
    }

    [HttpPost("{id}/publish")]
    public async Task<IActionResult> Publish(string id) => Ok(await _service.PublishAsync(id));
}
