using System.ComponentModel.DataAnnotations;
using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.DTOs.Articles;

public class ArticleDto
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
    public List<string>? Tags { get; set; }
    public int Views { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime? ScheduledAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateArticleRequest
{
    [Required, MaxLength(300)] public string Title { get; set; } = null!;
    [Required, MaxLength(300)] public string Slug { get; set; } = null!;
    [Required] public string Excerpt { get; set; } = null!;
    public string? Content { get; set; }
    [Required] public string Category { get; set; } = null!;
    public ArticleStatus Status { get; set; } = ArticleStatus.Nhap;
    [Required, MaxLength(100)] public string Author { get; set; } = null!;
    public string? Thumbnail { get; set; }
    public List<string>? Tags { get; set; }
    public DateTime? ScheduledAt { get; set; }
}

public class UpdateArticleRequest
{
    [MaxLength(300)] public string? Title { get; set; }
    [MaxLength(300)] public string? Slug { get; set; }
    public string? Excerpt { get; set; }
    public string? Content { get; set; }
    public string? Category { get; set; }
    public ArticleStatus? Status { get; set; }
    [MaxLength(100)] public string? Author { get; set; }
    public string? Thumbnail { get; set; }
    public List<string>? Tags { get; set; }
    public DateTime? ScheduledAt { get; set; }
}

public class ArticleQueryParams
{
    public ArticleStatus? Status { get; set; }
    public string? Category { get; set; }
    public string? Search { get; set; }
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 10;
}
