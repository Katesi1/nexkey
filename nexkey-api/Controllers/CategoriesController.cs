using Microsoft.AspNetCore.Mvc;
using NexKey.Api.Models.DTOs.Categories;
using NexKey.Api.Interfaces;

namespace NexKey.Api.Controllers;

[Route("api/categories")]
public class CategoriesController : BaseController
{
    private readonly ICategoryService _service;

    public CategoriesController(ICategoryService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] CategoryQueryParams query) =>
        Ok(await _service.GetListAsync(query));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id) => Ok(await _service.GetByIdAsync(id));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryRequest request) =>
        Ok(await _service.CreateAsync(request));

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateCategoryRequest request) =>
        Ok(await _service.UpdateAsync(id, request));

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _service.DeleteAsync(id);
        return Ok(new { message = "ÄÃ£ xÃ³a danh má»¥c" });
    }

    [HttpPatch("{id}/toggle")]
    public async Task<IActionResult> Toggle(string id) => Ok(await _service.ToggleAsync(id));
}
