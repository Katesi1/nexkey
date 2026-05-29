using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.Entities;

public class Banner
{
    public string Id { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Image { get; set; } = null!;
    public string? Link { get; set; }
    public BannerPosition Position { get; set; }
    public int SortOrder { get; set; }
    public BannerStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
