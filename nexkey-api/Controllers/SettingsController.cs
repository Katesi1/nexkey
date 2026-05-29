using Microsoft.AspNetCore.Mvc;
using NexKey.Api.Models.DTOs.Settings;
using NexKey.Api.Interfaces;

namespace NexKey.Api.Controllers;

[Route("v1/settings")]
public class SettingsController : BaseController
{
    private readonly ISettingService _service;

    public SettingsController(ISettingService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("{group}")]
    public async Task<IActionResult> GetByGroup(string group) => Ok(await _service.GetByGroupAsync(group));

    [HttpPatch]
    public async Task<IActionResult> Update([FromBody] Dictionary<string, string> settings)
    {
        await _service.UpdateAsync(settings);
        return Ok(new { message = "Đã cập nhật cài đặt" });
    }

    [HttpPost("email/test")]
    public async Task<IActionResult> TestEmail([FromBody] SendTestEmailRequest request)
    {
        await _service.SendTestEmailAsync(request.To);
        return Ok(new { message = "Đã gửi email test thành công" });
    }
}
