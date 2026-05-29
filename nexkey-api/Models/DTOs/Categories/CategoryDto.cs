using System.ComponentModel.DataAnnotations;
using NexKey.Api.Models.Enums;

namespace NexKey.Api.Models.DTOs.Categories;

public class CategoryDto
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string Icon { get; set; } = null!;
    public string Color { get; set; } = null!;
    public int ProductCount { get; set; }
    public string Status { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateCategoryRequest
{
    [Required, MaxLength(100)] public string Name { get; set; } = null!;
    [Required, MaxLength(100)] public string Slug { get; set; } = null!;
    [Required, MaxLength(10)] public string Icon { get; set; } = null!;
    [Required, MaxLength(7)] public string Color { get; set; } = null!;
    public CategoryStatus Status { get; set; } = CategoryStatus.HienThi;
}

public class UpdateCategoryRequest
{
    [MaxLength(100)] public string? Name { get; set; }
    [MaxLength(100)] public string? Slug { get; set; }
    [MaxLength(10)] public string? Icon { get; set; }
    [MaxLength(7)] public string? Color { get; set; }
    public CategoryStatus? Status { get; set; }
}

public class CategoryQueryParams
{
    public CategoryStatus? Status { get; set; }
    public string? Search { get; set; }
}
