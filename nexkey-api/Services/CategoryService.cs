using Microsoft.EntityFrameworkCore;
using NexKey.Api.Common;
using NexKey.Api.Models.DTOs.Categories;
using NexKey.Api.Interfaces;
using NexKey.Api.Models.Entities;
using NexKey.Api.Models.Enums;
using NexKey.Api.Data;

namespace NexKey.Api.Services;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _db;

    public CategoryService(AppDbContext db) => _db = db;

    public async Task<List<CategoryDto>> GetListAsync(CategoryQueryParams q)
    {
        var query = _db.Categories.AsQueryable();
        if (q.Status.HasValue) query = query.Where(c => c.Status == q.Status.Value);
        if (!string.IsNullOrWhiteSpace(q.Search))
        {
            var s = q.Search.ToLower();
            query = query.Where(c => c.Name.ToLower().Contains(s) || c.Slug.ToLower().Contains(s));
        }

        var categories = await query.OrderBy(c => c.Name).ToListAsync();
        var counts = await _db.Products.GroupBy(p => p.CategoryId)
            .Select(g => new { g.Key, Count = g.Count() }).ToDictionaryAsync(x => x.Key, x => x.Count);

        return categories.Select(c => MapToDto(c, counts.GetValueOrDefault(c.Id, 0))).ToList();
    }

    public async Task<CategoryDto> GetByIdAsync(string id)
    {
        var cat = await _db.Categories.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy danh mục {id}");
        var count = await _db.Products.CountAsync(p => p.CategoryId == id);
        return MapToDto(cat, count);
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryRequest request)
    {
        if (await _db.Categories.AnyAsync(c => c.Slug == request.Slug))
            throw AppException.Conflict($"Slug '{request.Slug}' đã tồn tại");
        if (await _db.Categories.AnyAsync(c => c.Name == request.Name))
            throw AppException.Conflict($"Danh mục '{request.Name}' đã tồn tại");

        var cat = new Category
        {
            Id = Guid.NewGuid().ToString(),
            Name = request.Name,
            Slug = request.Slug,
            Icon = request.Icon,
            Color = request.Color,
            Status = request.Status,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Categories.Add(cat);
        await _db.SaveChangesAsync();
        return MapToDto(cat, 0);
    }

    public async Task<CategoryDto> UpdateAsync(string id, UpdateCategoryRequest request)
    {
        var cat = await _db.Categories.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy danh mục {id}");

        if (request.Slug != null && request.Slug != cat.Slug)
        {
            if (await _db.Categories.AnyAsync(c => c.Slug == request.Slug && c.Id != id))
                throw AppException.Conflict($"Slug '{request.Slug}' đã tồn tại");
            cat.Slug = request.Slug;
        }

        if (request.Name != null) cat.Name = request.Name;
        if (request.Icon != null) cat.Icon = request.Icon;
        if (request.Color != null) cat.Color = request.Color;
        if (request.Status.HasValue) cat.Status = request.Status.Value;
        cat.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        var count = await _db.Products.CountAsync(p => p.CategoryId == id);
        return MapToDto(cat, count);
    }

    public async Task DeleteAsync(string id)
    {
        var cat = await _db.Categories.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy danh mục {id}");

        if (await _db.Products.AnyAsync(p => p.CategoryId == id))
            throw AppException.Unprocessable("Không thể xóa danh mục đang có sản phẩm");

        _db.Categories.Remove(cat);
        await _db.SaveChangesAsync();
    }

    public async Task<CategoryDto> ToggleAsync(string id)
    {
        var cat = await _db.Categories.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy danh mục {id}");

        cat.Status = cat.Status == CategoryStatus.HienThi ? CategoryStatus.An : CategoryStatus.HienThi;
        cat.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        var count = await _db.Products.CountAsync(p => p.CategoryId == id);
        return MapToDto(cat, count);
    }

    private static CategoryDto MapToDto(Category c, int productCount) => new()
    {
        Id = c.Id, Name = c.Name, Slug = c.Slug, Icon = c.Icon, Color = c.Color,
        ProductCount = productCount, Status = c.Status.ToString(),
        CreatedAt = c.CreatedAt, UpdatedAt = c.UpdatedAt
    };
}
