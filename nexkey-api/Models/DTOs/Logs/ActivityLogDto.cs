using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.DTOs.Logs;

public class ActivityLogDto
{
    public string Id { get; set; } = null!;
    public ActivityLogType Type { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string? AdminId { get; set; }
    public string? AdminName { get; set; }
    public object? Meta { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ActivityLogQueryParams
{
    public ActivityLogType? Type { get; set; }
    public bool? IsRead { get; set; }
    public string? Search { get; set; }
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 10;
}

public class DeleteLogsRequest
{
    public int BeforeDays { get; set; } = 30;
}
