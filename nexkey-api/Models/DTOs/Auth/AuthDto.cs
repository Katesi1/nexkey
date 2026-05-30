using System.ComponentModel.DataAnnotations;
using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.DTOs.Auth;

public class LoginRequest
{
    [Required, EmailAddress] public string Email { get; set; } = null!;
    [Required] public string Password { get; set; } = null!;
}

public class LoginResponse
{
    public string Token { get; set; } = null!;
}

public class AdminInfo
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public AdminStatus Status { get; set; }
    public RoleInfo Role { get; set; } = null!;
}

public class RoleInfo
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Color { get; set; } = null!;
    public List<string> Permissions { get; set; } = new();
}

public class ChangePasswordRequest
{
    [Required] public string CurrentPassword { get; set; } = null!;
    [Required, MinLength(6)] public string NewPassword { get; set; } = null!;
}

public class CreateRoleRequest
{
    [Required, MaxLength(50)] public string Name { get; set; } = null!;
    [MaxLength(200)] public string? Description { get; set; }
    [Required, MaxLength(7)] public string Color { get; set; } = null!;
    [Required] public List<string> Permissions { get; set; } = new();
}

public class UpdateRoleRequest
{
    [MaxLength(50)] public string? Name { get; set; }
    [MaxLength(200)] public string? Description { get; set; }
    [MaxLength(7)] public string? Color { get; set; }
    public List<string>? Permissions { get; set; }
}

public class RoleDto
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string Color { get; set; } = null!;
    public List<string> Permissions { get; set; } = new();
    public bool IsSystem { get; set; }
    public int AdminCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AdminDto
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string RoleId { get; set; } = null!;
    public string RoleName { get; set; } = null!;
    public AdminStatus Status { get; set; }
    public DateTime? LastLogin { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateAdminRequest
{
    [Required, MaxLength(100)] public string Name { get; set; } = null!;
    [Required, EmailAddress, MaxLength(150)] public string Email { get; set; } = null!;
    [Required, MinLength(6)] public string Password { get; set; } = null!;
    [Required] public string RoleId { get; set; } = null!;
}

public class AssignRoleRequest
{
    [Required] public string RoleId { get; set; } = null!;
}

public class LockAdminRequest
{
    public bool Locked { get; set; }
}
