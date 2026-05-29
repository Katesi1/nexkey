using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.Entities;

public class Article
{
    public string Id { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string Excerpt { get; set; } = null!;
    public string? Content { get; set; }
    public string Category { get; set; } = null!;
    public ArticleStatus Status { get; set; }
    public string Author { get; set; } = null!;
    public string? Thumbnail { get; set; }
    public string? Tags { get; set; }
    public int Views { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime? ScheduledAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
