using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexKey.Api.Common;
using NexKey.Api.Models.DTOs.Auth;
using NexKey.Api.Interfaces;

namespace NexKey.Api.Controllers;

[Route("v1/auth")]
public class AuthController : BaseController
{
    private readonly IAuthService _auth;

    public AuthController(IAuthService auth) => _auth = auth;

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _auth.LoginAsync(request);
        return Ok(result);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _auth.LogoutAsync(CurrentAdminId, "");
        return Ok(new { message = "Đăng xuất thành công" });
    }

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        await _auth.ChangePasswordAsync(CurrentAdminId, request);
        return Ok(new { message = "Đổi mật khẩu thành công" });
    }

    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var result = await _auth.GetMeAsync(CurrentAdminId);
        return Ok(result);
    }
}

[Route("v1/roles")]
public class RolesController : BaseController
{
    private readonly IAuthService _auth;

    public RolesController(IAuthService auth) => _auth = auth;

    [HttpGet]
    public async Task<IActionResult> GetList() => Ok(await _auth.GetRolesAsync());

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateRoleRequest request) =>
        Ok(await _auth.CreateRoleAsync(request));

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateRoleRequest request) =>
        Ok(await _auth.UpdateRoleAsync(id, request));

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _auth.DeleteRoleAsync(id);
        return Ok(new { message = "Đã xóa vai trò" });
    }
}

[Route("v1/admins")]
public class AdminsController : BaseController
{
    private readonly IAuthService _auth;

    public AdminsController(IAuthService auth) => _auth = auth;

    [HttpGet]
    public async Task<IActionResult> GetList() => Ok(await _auth.GetAdminsAsync());

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAdminRequest request) =>
        Ok(await _auth.CreateAdminAsync(request));

    [HttpPatch("{id}/role")]
    public async Task<IActionResult> AssignRole(string id, [FromBody] AssignRoleRequest request) =>
        Ok(await _auth.AssignRoleAsync(id, request.RoleId));

    [HttpPatch("{id}/lock")]
    public async Task<IActionResult> Lock(string id, [FromBody] LockAdminRequest request) =>
        Ok(await _auth.LockAdminAsync(id, request.Locked));

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _auth.DeleteAdminAsync(id);
        return Ok(new { message = "Đã xóa admin" });
    }
}
