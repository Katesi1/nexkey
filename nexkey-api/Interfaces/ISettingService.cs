using NexKey.Api.Models.DTOs.Settings;

namespace NexKey.Api.Interfaces;

public interface ISettingService
{
    Task<List<SettingsByGroupDto>> GetAllAsync();
    Task<SettingsByGroupDto> GetByGroupAsync(string group);
    Task UpdateAsync(Dictionary<string, string> settings);
    Task SendTestEmailAsync(string to);
}
