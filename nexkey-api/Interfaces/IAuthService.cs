using NexKey.Api.Models.DTOs.Auth;

namespace NexKey.Api.Interfaces;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
    Task LogoutAsync(string adminId, string token);
    Task ChangePasswordAsync(string adminId, ChangePasswordRequest request);
    Task<AdminInfo> GetMeAsync(string adminId);
    Task<List<RoleDto>> GetRolesAsync();
    Task<RoleDto> CreateRoleAsync(CreateRoleRequest request);
    Task<RoleDto> UpdateRoleAsync(string id, UpdateRoleRequest request);
    Task DeleteRoleAsync(string id);
    Task<List<AdminDto>> GetAdminsAsync();
    Task<AdminDto> CreateAdminAsync(CreateAdminRequest request);
    Task<AdminDto> AssignRoleAsync(string id, string roleId);
    Task<AdminDto> LockAdminAsync(string id, bool locked);
    Task DeleteAdminAsync(string id);
}
