using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using NexKey.Api.Common;
using NexKey.Api.Models.DTOs.Auth;
using NexKey.Api.Interfaces;
using NexKey.Api.Models.Entities;
using NexKey.Api.Models.Enums;
using NexKey.Api.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace NexKey.Api.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var admin = await _db.Admins.Include(a => a.Role)
            .FirstOrDefaultAsync(a => a.Email == request.Email)
            ?? throw new AppException("Email hoặc mật khẩu không đúng", 401, "UNAUTHORIZED");

        if (admin.Status == AdminStatus.BiKhoa)
            throw new AppException("Tài khoản đã bị khóa", 403, "FORBIDDEN");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, admin.PasswordHash))
            throw new AppException("Email hoặc mật khẩu không đúng", 401, "UNAUTHORIZED");

        admin.LastLogin = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        var token = GenerateToken(admin);
        return new LoginResponse { Token = token };
    }

    public Task LogoutAsync(string adminId, string token) => Task.CompletedTask;

    public async Task ChangePasswordAsync(string adminId, ChangePasswordRequest request)
    {
        var admin = await _db.Admins.FindAsync(adminId)
            ?? throw AppException.NotFound("Không tìm thấy admin");

        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, admin.PasswordHash))
            throw new AppException("Mật khẩu hiện tại không đúng");

        admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _db.SaveChangesAsync();
    }

    public async Task<AdminInfo> GetMeAsync(string adminId)
    {
        var admin = await _db.Admins.Include(a => a.Role).FirstOrDefaultAsync(a => a.Id == adminId)
            ?? throw AppException.NotFound("Không tìm thấy admin");
        return MapAdminInfo(admin);
    }

    public async Task<List<RoleDto>> GetRolesAsync()
    {
        var roles = await _db.Roles.ToListAsync();
        var adminCounts = await _db.Admins.GroupBy(a => a.RoleId)
            .Select(g => new { g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Key, x => x.Count);

        return roles.Select(r => MapRoleDto(r, adminCounts.GetValueOrDefault(r.Id, 0))).ToList();
    }

    public async Task<RoleDto> CreateRoleAsync(CreateRoleRequest request)
    {
        if (await _db.Roles.AnyAsync(r => r.Name == request.Name))
            throw AppException.Conflict($"Vai trò '{request.Name}' đã tồn tại");

        var role = new Role
        {
            Id = Guid.NewGuid().ToString(),
            Name = request.Name, Description = request.Description, Color = request.Color,
            Permissions = JsonSerializer.Serialize(request.Permissions),
            IsSystem = false, CreatedAt = DateTime.UtcNow
        };

        _db.Roles.Add(role);
        await _db.SaveChangesAsync();
        return MapRoleDto(role, 0);
    }

    public async Task<RoleDto> UpdateRoleAsync(string id, UpdateRoleRequest request)
    {
        var role = await _db.Roles.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy vai trò {id}");

        if (request.Name != null && request.Name != role.Name)
        {
            if (await _db.Roles.AnyAsync(r => r.Name == request.Name && r.Id != id))
                throw AppException.Conflict($"Vai trò '{request.Name}' đã tồn tại");
            role.Name = request.Name;
        }

        if (request.Description != null) role.Description = request.Description;
        if (request.Color != null) role.Color = request.Color;
        if (request.Permissions != null) role.Permissions = JsonSerializer.Serialize(request.Permissions);

        await _db.SaveChangesAsync();
        var count = await _db.Admins.CountAsync(a => a.RoleId == id);
        return MapRoleDto(role, count);
    }

    public async Task DeleteRoleAsync(string id)
    {
        var role = await _db.Roles.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy vai trò {id}");

        if (role.IsSystem)
            throw AppException.Unprocessable("Không thể xóa vai trò hệ thống");

        if (await _db.Admins.AnyAsync(a => a.RoleId == id))
            throw AppException.Unprocessable("Vai trò đang được sử dụng bởi admin khác");

        _db.Roles.Remove(role);
        await _db.SaveChangesAsync();
    }

    public async Task<List<AdminDto>> GetAdminsAsync()
    {
        var admins = await _db.Admins.Include(a => a.Role).OrderBy(a => a.Name).ToListAsync();
        return admins.Select(MapAdminDto).ToList();
    }

    public async Task<AdminDto> CreateAdminAsync(CreateAdminRequest request)
    {
        if (await _db.Admins.AnyAsync(a => a.Email == request.Email))
            throw AppException.Conflict($"Email '{request.Email}' đã được sử dụng");

        var role = await _db.Roles.FindAsync(request.RoleId)
            ?? throw AppException.NotFound("Không tìm thấy vai trò");

        var admin = new Admin
        {
            Id = Guid.NewGuid().ToString(),
            Name = request.Name, Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            RoleId = request.RoleId, Status = AdminStatus.HoatDong,
            CreatedAt = DateTime.UtcNow
        };

        _db.Admins.Add(admin);
        await _db.SaveChangesAsync();

        admin.Role = role;
        return MapAdminDto(admin);
    }

    public async Task<AdminDto> AssignRoleAsync(string id, string roleId)
    {
        var admin = await _db.Admins.Include(a => a.Role).FirstOrDefaultAsync(a => a.Id == id)
            ?? throw AppException.NotFound($"Không tìm thấy admin {id}");

        var role = await _db.Roles.FindAsync(roleId)
            ?? throw AppException.NotFound("Không tìm thấy vai trò");

        admin.RoleId = roleId;
        admin.Role = role;
        await _db.SaveChangesAsync();
        return MapAdminDto(admin);
    }

    public async Task<AdminDto> LockAdminAsync(string id, bool locked)
    {
        var admin = await _db.Admins.Include(a => a.Role).FirstOrDefaultAsync(a => a.Id == id)
            ?? throw AppException.NotFound($"Không tìm thấy admin {id}");

        admin.Status = locked ? AdminStatus.BiKhoa : AdminStatus.HoatDong;
        await _db.SaveChangesAsync();
        return MapAdminDto(admin);
    }

    public async Task DeleteAdminAsync(string id)
    {
        var admin = await _db.Admins.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy admin {id}");

        var isFirstSuperAdmin = await _db.Admins
            .Join(_db.Roles, a => a.RoleId, r => r.Id, (a, r) => new { a, r })
            .Where(x => x.r.IsSystem)
            .OrderBy(x => x.a.CreatedAt)
            .Select(x => x.a.Id)
            .FirstOrDefaultAsync() == id;

        if (isFirstSuperAdmin)
            throw AppException.Unprocessable("Không thể xóa Super Admin đầu tiên");

        _db.Admins.Remove(admin);
        await _db.SaveChangesAsync();
    }

    private string GenerateToken(Admin admin)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, admin.Id),
            new Claim(ClaimTypes.Email, admin.Email),
            new Claim(ClaimTypes.Name, admin.Name),
            new Claim("roleId", admin.RoleId)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static AdminInfo MapAdminInfo(Admin a)
    {
        List<string> permissions;
        try { permissions = JsonSerializer.Deserialize<List<string>>(a.Role.Permissions) ?? new(); }
        catch { permissions = new(); }

        return new AdminInfo
        {
            Id = a.Id, Name = a.Name, Email = a.Email, Status = a.Status,
            Role = new RoleInfo { Id = a.Role.Id, Name = a.Role.Name, Color = a.Role.Color, Permissions = permissions }
        };
    }

    private static RoleDto MapRoleDto(Role r, int adminCount)
    {
        List<string> permissions;
        try { permissions = JsonSerializer.Deserialize<List<string>>(r.Permissions) ?? new(); }
        catch { permissions = new(); }

        return new RoleDto
        {
            Id = r.Id, Name = r.Name, Description = r.Description, Color = r.Color,
            Permissions = permissions, IsSystem = r.IsSystem, AdminCount = adminCount, CreatedAt = r.CreatedAt
        };
    }

    private static AdminDto MapAdminDto(Admin a) => new()
    {
        Id = a.Id, Name = a.Name, Email = a.Email, RoleId = a.RoleId,
        RoleName = a.Role?.Name ?? "", Status = a.Status,
        LastLogin = a.LastLogin, CreatedAt = a.CreatedAt
    };
}
