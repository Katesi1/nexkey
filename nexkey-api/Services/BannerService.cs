using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using NexKey.Api.Common;
using NexKey.Api.Models.DTOs.Banners;
using NexKey.Api.Interfaces;
using NexKey.Api.Models.Entities;
using NexKey.Api.Models.Enums;
using NexKey.Api.Data;

namespace NexKey.Api.Services;

public class BannerService : IBannerService
{
    private readonly AppDbContext _db;
    private readonly string _uploadPath;

    public BannerService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _uploadPath = config["UploadPath"] ?? "wwwroot/uploads/banners";
    }

    public async Task<List<BannerDto>> GetListAsync(BannerQueryParams q)
    {
        var query = _db.Banners.AsQueryable();
        if (q.Position.HasValue) query = query.Where(b => b.Position == q.Position.Value);
        if (q.Status.HasValue) query = query.Where(b => b.Status == q.Status.Value);

        var banners = await query.OrderBy(b => b.SortOrder).ToListAsync();
        return banners.Select(MapToDto).ToList();
    }

    public async Task<BannerDto> GetByIdAsync(string id)
    {
        var banner = await _db.Banners.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy banner {id}");
        return MapToDto(banner);
    }

    public async Task<BannerDto> CreateAsync(CreateBannerRequest request)
    {
        var banner = new Banner
        {
            Id = Guid.NewGuid().ToString(),
            Title = request.Title, Image = request.Image, Link = request.Link,
            Position = request.Position, SortOrder = request.SortOrder, Status = request.Status,
            CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
        };

        _db.Banners.Add(banner);
        await _db.SaveChangesAsync();
        return MapToDto(banner);
    }

    public async Task<BannerDto> UpdateAsync(string id, UpdateBannerRequest request)
    {
        var banner = await _db.Banners.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy banner {id}");

        if (request.Title != null) banner.Title = request.Title;
        if (request.Image != null) banner.Image = request.Image;
        if (request.Link != null) banner.Link = request.Link;
        if (request.Position.HasValue) banner.Position = request.Position.Value;
        if (request.SortOrder.HasValue) banner.SortOrder = request.SortOrder.Value;
        if (request.Status.HasValue) banner.Status = request.Status.Value;
        banner.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return MapToDto(banner);
    }

    public async Task DeleteAsync(string id)
    {
        var banner = await _db.Banners.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy banner {id}");
        _db.Banners.Remove(banner);
        await _db.SaveChangesAsync();
    }

    public async Task<BannerDto> ToggleAsync(string id)
    {
        var banner = await _db.Banners.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy banner {id}");

        banner.Status = banner.Status == BannerStatus.HienThi ? BannerStatus.An : BannerStatus.HienThi;
        banner.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return MapToDto(banner);
    }

    public async Task ReorderAsync(List<ReorderBannerRequest> items)
    {
        foreach (var item in items)
        {
            var banner = await _db.Banners.FindAsync(item.Id);
            if (banner != null)
            {
                banner.SortOrder = item.SortOrder;
                banner.UpdatedAt = DateTime.UtcNow;
            }
        }
        await _db.SaveChangesAsync();
    }

    public async Task<string> UploadImageAsync(Stream stream, string fileName)
    {
        Directory.CreateDirectory(_uploadPath);
        var ext = Path.GetExtension(fileName);
        var uniqueName = $"{Guid.NewGuid()}{ext}";
        var path = Path.Combine(_uploadPath, uniqueName);

        using var file = File.Create(path);
        await stream.CopyToAsync(file);

        return $"/uploads/banners/{uniqueName}";
    }

    private static BannerDto MapToDto(Banner b) => new()
    {
        Id = b.Id, Title = b.Title, Image = b.Image, Link = b.Link,
        Position = b.Position, SortOrder = b.SortOrder, Status = b.Status,
        CreatedAt = b.CreatedAt, UpdatedAt = b.UpdatedAt
    };
}
