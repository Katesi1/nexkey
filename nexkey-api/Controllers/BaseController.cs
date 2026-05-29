using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexKey.Api.Common;
using System.Security.Claims;

namespace NexKey.Api.Controllers;

[ApiController]
[Authorize]
[Route("v1/[controller]")]
public abstract class BaseController : ControllerBase
{
    protected string CurrentAdminId =>
        User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

    protected IActionResult Ok<T>(T data) =>
        base.Ok(ApiResponse<T>.Ok(data));

    protected IActionResult Paged<T>(List<T> data, int total, int page, int limit) =>
        base.Ok(ApiResponse<List<T>>.Paged(data, total, page, limit));
}
