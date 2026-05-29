using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.Entities;

public class ActivityLog
{
    public string Id { get; set; } = null!;
    public ActivityLogType Type { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string? AdminId { get; set; }
    public string? Meta { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }

    public Admin? Admin { get; set; }
}
