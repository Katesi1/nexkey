using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.Entities;

public class Faq
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
