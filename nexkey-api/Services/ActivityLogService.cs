using Microsoft.EntityFrameworkCore;
using NexKey.Api.Models.DTOs.Logs;
using NexKey.Api.Interfaces;
using NexKey.Api.Models.Entities;
using NexKey.Api.Models.Enums;
using NexKey.Api.Data;
using System.Text.Json;

namespace NexKey.Api.Services;

public class ActivityLogService : IActivityLogService
{
    private readonly AppDbContext _db;

    public ActivityLogService(AppDbContext db) => _db = db;

    public async Task<(List<ActivityLogDto> Items, int Total)> GetListAsync(ActivityLogQueryParams q)
    {
        var query = _db.ActivityLogs.Include(l => l.Admin).AsQueryable();

        if (q.Type.HasValue) query = query.Where(l => l.Type == q.Type.Value);
        if (q.IsRead.HasValue) query = query.Where(l => l.IsRead == q.IsRead.Value);
        if (!string.IsNullOrWhiteSpace(q.Search))
        {
            var s = q.Search.ToLower();
            query = query.Where(l => l.Title.ToLower().Contains(s) || l.Description.ToLower().Contains(s));
        }

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(l => l.CreatedAt)
            .Skip((q.Page - 1) * q.Limit).Take(q.Limit).ToListAsync();

        return (items.Select(MapToDto).ToList(), total);
    }

    public async Task MarkReadAsync(string id)
    {
        var log = await _db.ActivityLogs.FindAsync(id);
        if (log != null)
        {
            log.IsRead = true;
            await _db.SaveChangesAsync();
        }
    }

    public async Task MarkAllReadAsync()
    {
        await _db.ActivityLogs.Where(l => !l.IsRead)
            .ExecuteUpdateAsync(s => s.SetProperty(l => l.IsRead, true));
    }

    public async Task DeleteOldAsync(int beforeDays)
    {
        var cutoff = DateTime.UtcNow.AddDays(-beforeDays);
        await _db.ActivityLogs.Where(l => l.CreatedAt < cutoff).ExecuteDeleteAsync();
    }

    public async Task CreateAsync(ActivityLogType type, string title, string description, string? adminId = null, object? meta = null)
    {
        var log = new ActivityLog
        {
            Id = Guid.NewGuid().ToString(),
            Type = type,
            Title = title,
            Description = description,
            AdminId = adminId,
            Meta = meta != null ? JsonSerializer.Serialize(meta) : null,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        _db.ActivityLogs.Add(log);
        await _db.SaveChangesAsync();
    }

    private static ActivityLogDto MapToDto(ActivityLog l)
    {
        object? meta = null;
        if (!string.IsNullOrWhiteSpace(l.Meta))
        {
            try { meta = JsonSerializer.Deserialize<object>(l.Meta); }
            catch { meta = null; }
        }

        return new ActivityLogDto
        {
            Id = l.Id, Type = l.Type.ToString(), Title = l.Title, Description = l.Description,
            AdminId = l.AdminId, AdminName = l.Admin?.Name, Meta = meta,
            IsRead = l.IsRead, CreatedAt = l.CreatedAt
        };
    }
}
