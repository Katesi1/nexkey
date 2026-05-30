using System.ComponentModel.DataAnnotations;
using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.DTOs.Pages;

public class PageDto
{
    public string Id { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string? Content { get; set; }
    public PageStatus Status { get; set; }
    public bool IsSystem { get; set; }
    public int WordCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreatePageRequest
{
    [Required, MaxLength(200)] public string Title { get; set; } = null!;
    [Required, MaxLength(200)] public string Slug { get; set; } = null!;
    [Required, MaxLength(300)] public string Description { get; set; } = null!;
    public string? Content { get; set; }
    public PageStatus Status { get; set; } = PageStatus.HienThi;
}

public class UpdatePageRequest
{
    [MaxLength(200)] public string? Title { get; set; }
    [MaxLength(200)] public string? Slug { get; set; }
    [MaxLength(300)] public string? Description { get; set; }
    public string? Content { get; set; }
    public PageStatus? Status { get; set; }
}
