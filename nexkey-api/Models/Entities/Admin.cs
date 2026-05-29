using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.Entities;

public class Admin
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string RoleId { get; set; } = null!;
    public AdminStatus Status { get; set; }
    public DateTime? LastLogin { get; set; }
    public DateTime CreatedAt { get; set; }

    public Role Role { get; set; } = null!;
    public ICollection<ActivityLog> ActivityLogs { get; set; } = new List<ActivityLog>();
}

public class Role
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string Color { get; set; } = null!;
    public string Permissions { get; set; } = null!;
    public bool IsSystem { get; set; }
    public DateTime CreatedAt { get; set; }

    public ICollection<Admin> Admins { get; set; } = new List<Admin>();
}
