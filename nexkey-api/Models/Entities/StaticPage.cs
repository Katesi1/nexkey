using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.Entities;

public class StaticPage
{
    public string Id { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string? Content { get; set; }
    public PageStatus Status { get; set; }
    public bool IsSystem { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public int WordCount => string.IsNullOrWhiteSpace(Content)
        ? 0
        : Content.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;
}
