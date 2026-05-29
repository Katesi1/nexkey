using System.ComponentModel.DataAnnotations;
using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.DTOs.Banners;

public class BannerDto
{
    public string Id { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Image { get; set; } = null!;
    public string? Link { get; set; }
    public string Position { get; set; } = null!;
    public int SortOrder { get; set; }
    public string Status { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateBannerRequest
{
    [Required, MaxLength(200)] public string Title { get; set; } = null!;
    [Required, MaxLength(500)] public string Image { get; set; } = null!;
    [MaxLength(500)] public string? Link { get; set; }
    [Required] public BannerPosition Position { get; set; }
    public int SortOrder { get; set; } = 1;
    public BannerStatus Status { get; set; } = BannerStatus.HienThi;
}

public class UpdateBannerRequest
{
    [MaxLength(200)] public string? Title { get; set; }
    [MaxLength(500)] public string? Image { get; set; }
    [MaxLength(500)] public string? Link { get; set; }
    public BannerPosition? Position { get; set; }
    public int? SortOrder { get; set; }
    public BannerStatus? Status { get; set; }
}

public class ReorderBannerRequest
{
    [Required] public string Id { get; set; } = null!;
    [Required] public int SortOrder { get; set; }
}

public class BannerQueryParams
{
    public BannerPosition? Position { get; set; }
    public BannerStatus? Status { get; set; }
}
