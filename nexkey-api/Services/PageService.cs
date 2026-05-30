using Microsoft.EntityFrameworkCore;
using NexKey.Api.Common;
using NexKey.Api.Models.DTOs.Pages;
using NexKey.Api.Interfaces;
using NexKey.Api.Models.Entities;
using NexKey.Api.Data;

namespace NexKey.Api.Services;

public class PageService : IPageService
{
    private readonly AppDbContext _db;

    public PageService(AppDbContext db) => _db = db;

    public async Task<List<PageDto>> GetListAsync()
    {
        var pages = await _db.StaticPages.OrderBy(p => p.Title).ToListAsync();
        return pages.Select(MapToDto).ToList();
    }

    public async Task<PageDto> GetByIdAsync(string id)
    {
        var page = await _db.StaticPages.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy trang {id}");
        return MapToDto(page);
    }

    public async Task<PageDto> GetBySlugAsync(string slug)
    {
        var page = await _db.StaticPages.FirstOrDefaultAsync(p => p.Slug == slug)
            ?? throw AppException.NotFound("Không tìm thấy trang");
        return MapToDto(page);
    }

    public async Task<PageDto> CreateAsync(CreatePageRequest request)
    {
        if (await _db.StaticPages.AnyAsync(p => p.Slug == request.Slug))
            throw AppException.Conflict($"Slug '{request.Slug}' đã tồn tại");

        var page = new StaticPage
        {
            Id = Guid.NewGuid().ToString(),
            Title = request.Title, Slug = request.Slug, Description = request.Description,
            Content = request.Content, Status = request.Status,
            IsSystem = false, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
        };

        _db.StaticPages.Add(page);
        await _db.SaveChangesAsync();
        return MapToDto(page);
    }

    public async Task<PageDto> UpdateAsync(string id, UpdatePageRequest request)
    {
        var page = await _db.StaticPages.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy trang {id}");

        if (request.Slug != null && request.Slug != page.Slug)
        {
            if (await _db.StaticPages.AnyAsync(p => p.Slug == request.Slug && p.Id != id))
                throw AppException.Conflict($"Slug '{request.Slug}' đã tồn tại");
            page.Slug = request.Slug;
        }

        if (request.Title != null) page.Title = request.Title;
        if (request.Description != null) page.Description = request.Description;
        if (request.Content != null) page.Content = request.Content;
        if (request.Status.HasValue) page.Status = request.Status.Value;
        page.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return MapToDto(page);
    }

    public async Task DeleteAsync(string id)
    {
        var page = await _db.StaticPages.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy trang {id}");

        if (page.IsSystem)
            throw AppException.Unprocessable("Không thể xóa trang hệ thống");

        _db.StaticPages.Remove(page);
        await _db.SaveChangesAsync();
    }

    private static PageDto MapToDto(StaticPage p) => new()
    {
        Id = p.Id, Title = p.Title, Slug = p.Slug, Description = p.Description,
        Content = p.Content, Status = p.Status, IsSystem = p.IsSystem,
        WordCount = p.WordCount, CreatedAt = p.CreatedAt, UpdatedAt = p.UpdatedAt
    };
}
