using System.ComponentModel.DataAnnotations;
using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.DTOs.Faqs;

public class FaqDto
{
    public string Id { get; set; } = null!;
    public string Question { get; set; } = null!;
    public string Answer { get; set; } = null!;
    public string Category { get; set; } = null!;
    public FaqStatus Status { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateFaqRequest
{
    [Required, MaxLength(500)] public string Question { get; set; } = null!;
    [Required] public string Answer { get; set; } = null!;
    [Required, MaxLength(50)] public string Category { get; set; } = null!;
    public FaqStatus Status { get; set; } = FaqStatus.HienThi;
    public int SortOrder { get; set; } = 1;
}

public class UpdateFaqRequest
{
    [MaxLength(500)] public string? Question { get; set; }
    public string? Answer { get; set; }
    [MaxLength(50)] public string? Category { get; set; }
    public FaqStatus? Status { get; set; }
    public int? SortOrder { get; set; }
}

public class ReorderFaqRequest
{
    [Required] public string Id { get; set; } = null!;
    [Required] public int SortOrder { get; set; }
}

public class FaqQueryParams
{
    public FaqStatus? Status { get; set; }
    public string? Category { get; set; }
    public string? Search { get; set; }
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 10;
}
