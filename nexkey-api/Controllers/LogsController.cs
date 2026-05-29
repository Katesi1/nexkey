using Microsoft.AspNetCore.Mvc;
using NexKey.Api.Models.DTOs.Logs;
using NexKey.Api.Interfaces;

namespace NexKey.Api.Controllers;

[Route("v1/logs")]
public class LogsController : BaseController
{
    private readonly IActivityLogService _service;

    public LogsController(IActivityLogService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] ActivityLogQueryParams query)
    {
        var (items, total) = await _service.GetListAsync(query);
        return Paged(items, total, query.Page, query.Limit);
    }

    [HttpPatch("{id}/read")]
    public async Task<IActionResult> MarkRead(string id)
    {
        await _service.MarkReadAsync(id);
        return Ok(new { message = "Đã đánh dấu đã đọc" });
    }

    [HttpPatch("read-all")]
    public async Task<IActionResult> MarkAllRead()
    {
        await _service.MarkAllReadAsync();
        return Ok(new { message = "Đã đánh dấu tất cả đã đọc" });
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteOld([FromBody] DeleteLogsRequest request)
    {
        await _service.DeleteOldAsync(request.BeforeDays);
        return Ok(new { message = $"Đã xóa log cũ hơn {request.BeforeDays} ngày" });
    }
}
