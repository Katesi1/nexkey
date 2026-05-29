using NexKey.Api.Models.DTOs.Logs;
using NexKey.Api.Models.Enums;

namespace NexKey.Api.Interfaces;

public interface IActivityLogService
{
    Task<(List<ActivityLogDto> Items, int Total)> GetListAsync(ActivityLogQueryParams query);
    Task MarkReadAsync(string id);
    Task MarkAllReadAsync();
    Task DeleteOldAsync(int beforeDays);
    Task CreateAsync(ActivityLogType type, string title, string description, string? adminId = null, object? meta = null);
}
