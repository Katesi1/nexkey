using Microsoft.EntityFrameworkCore;
using NexKey.Api.Common;
using NexKey.Api.Models.DTOs.Articles;
using NexKey.Api.Interfaces;
using NexKey.Api.Models.Entities;
using NexKey.Api.Models.Enums;
using NexKey.Api.Data;
using System.Text.Json;

namespace NexKey.Api.Services;

public class ArticleService : IArticleService
{
    private readonly AppDbContext _db;

    public ArticleService(AppDbContext db) => _db = db;

    public async Task<(List<ArticleDto> Items, int Total)> GetListAsync(ArticleQueryParams q)
    {
        var query = _db.Articles.AsQueryable();
        if (q.Status.HasValue) query = query.Where(a => a.Status == q.Status.Value);
        if (!string.IsNullOrWhiteSpace(q.Category)) query = query.Where(a => a.Category == q.Category);
        if (!string.IsNullOrWhiteSpace(q.Search))
        {
            var s = q.Search.ToLower();
            query = query.Where(a => a.Title.ToLower().Contains(s) || a.Author.ToLower().Contains(s));
        }

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(a => a.CreatedAt)
            .Skip((q.Page - 1) * q.Limit).Take(q.Limit).ToListAsync();

        return (items.Select(MapToDto).ToList(), total);
    }

    public async Task<ArticleDto> GetByIdAsync(string id)
    {
        var article = await _db.Articles.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy bài viết {id}");
        return MapToDto(article);
    }

    public async Task<ArticleDto> GetBySlugAsync(string slug)
    {
        var article = await _db.Articles.FirstOrDefaultAsync(a => a.Slug == slug)
            ?? throw AppException.NotFound($"Không tìm thấy bài viết");
        article.Views++;
        await _db.SaveChangesAsync();
        return MapToDto(article);
    }

    public async Task<ArticleDto> CreateAsync(CreateArticleRequest request)
    {
        if (await _db.Articles.AnyAsync(a => a.Slug == request.Slug))
            throw AppException.Conflict($"Slug '{request.Slug}' đã tồn tại");

        var article = new Article
        {
            Id = Guid.NewGuid().ToString(),
            Title = request.Title, Slug = request.Slug, Excerpt = request.Excerpt,
            Content = request.Content, Category = request.Category, Status = request.Status,
            Author = request.Author, Thumbnail = request.Thumbnail,
            Tags = request.Tags != null ? JsonSerializer.Serialize(request.Tags) : null,
            ScheduledAt = request.ScheduledAt,
            PublishedAt = request.Status == ArticleStatus.DaXuatBan ? DateTime.UtcNow : null,
            CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
        };

        _db.Articles.Add(article);
        await _db.SaveChangesAsync();
        return MapToDto(article);
    }

    public async Task<ArticleDto> UpdateAsync(string id, UpdateArticleRequest request)
    {
        var article = await _db.Articles.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy bài viết {id}");

        if (request.Slug != null && request.Slug != article.Slug)
        {
            if (await _db.Articles.AnyAsync(a => a.Slug == request.Slug && a.Id != id))
                throw AppException.Conflict($"Slug '{request.Slug}' đã tồn tại");
            article.Slug = request.Slug;
        }

        if (request.Title != null) article.Title = request.Title;
        if (request.Excerpt != null) article.Excerpt = request.Excerpt;
        if (request.Content != null) article.Content = request.Content;
        if (request.Category != null) article.Category = request.Category;
        if (request.Author != null) article.Author = request.Author;
        if (request.Thumbnail != null) article.Thumbnail = request.Thumbnail;
        if (request.Tags != null) article.Tags = JsonSerializer.Serialize(request.Tags);
        if (request.ScheduledAt.HasValue) article.ScheduledAt = request.ScheduledAt;
        if (request.Status.HasValue)
        {
            article.Status = request.Status.Value;
            if (request.Status.Value == ArticleStatus.DaXuatBan && article.PublishedAt == null)
                article.PublishedAt = DateTime.UtcNow;
        }
        article.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return MapToDto(article);
    }

    public async Task DeleteAsync(string id)
    {
        var article = await _db.Articles.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy bài viết {id}");
        _db.Articles.Remove(article);
        await _db.SaveChangesAsync();
    }

    public async Task<ArticleDto> PublishAsync(string id)
    {
        var article = await _db.Articles.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy bài viết {id}");

        article.Status = ArticleStatus.DaXuatBan;
        article.PublishedAt = DateTime.UtcNow;
        article.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return MapToDto(article);
    }

    private static ArticleDto MapToDto(Article a)
    {
        List<string>? tags = null;
        if (!string.IsNullOrWhiteSpace(a.Tags))
        {
            try { tags = JsonSerializer.Deserialize<List<string>>(a.Tags); }
            catch { tags = null; }
        }

        return new ArticleDto
        {
            Id = a.Id, Title = a.Title, Slug = a.Slug, Excerpt = a.Excerpt,
            Content = a.Content, Category = a.Category, Status = a.Status,
            Author = a.Author, Thumbnail = a.Thumbnail, Tags = tags,
            Views = a.Views, PublishedAt = a.PublishedAt, ScheduledAt = a.ScheduledAt,
            CreatedAt = a.CreatedAt, UpdatedAt = a.UpdatedAt
        };
    }
}
