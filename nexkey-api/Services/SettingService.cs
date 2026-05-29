using Microsoft.EntityFrameworkCore;
using NexKey.Api.Common;
using NexKey.Api.Models.DTOs.Settings;
using NexKey.Api.Interfaces;
using NexKey.Api.Models.Entities;
using NexKey.Api.Data;
using System.Net;
using System.Net.Mail;

namespace NexKey.Api.Services;

public class SettingService : ISettingService
{
    private readonly AppDbContext _db;

    public SettingService(AppDbContext db) => _db = db;

    public async Task<List<SettingsByGroupDto>> GetAllAsync()
    {
        var settings = await _db.Settings.OrderBy(s => s.Group).ThenBy(s => s.Key).ToListAsync();

        return settings.GroupBy(s => s.Group).Select(g => new SettingsByGroupDto
        {
            Group = g.Key,
            Settings = g.ToDictionary(s => s.Key, s => s.Value)
        }).ToList();
    }

    public async Task<SettingsByGroupDto> GetByGroupAsync(string group)
    {
        var settings = await _db.Settings.Where(s => s.Group == group).ToListAsync();

        return new SettingsByGroupDto
        {
            Group = group,
            Settings = settings.ToDictionary(s => s.Key, s => s.Value)
        };
    }

    public async Task UpdateAsync(Dictionary<string, string> updates)
    {
        foreach (var (key, value) in updates)
        {
            var existing = await _db.Settings.FindAsync(key);
            if (existing != null)
            {
                existing.Value = value;
                existing.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                _db.Settings.Add(new Setting { Key = key, Value = value, Group = "general", UpdatedAt = DateTime.UtcNow });
            }
        }

        await _db.SaveChangesAsync();
    }

    public async Task SendTestEmailAsync(string to)
    {
        var smtpHost = (await _db.Settings.FindAsync("smtp_host"))?.Value ?? throw new AppException("Chưa cấu hình SMTP");
        var smtpPortStr = (await _db.Settings.FindAsync("smtp_port"))?.Value ?? "587";
        var smtpUser = (await _db.Settings.FindAsync("smtp_username"))?.Value ?? "";
        var smtpPass = (await _db.Settings.FindAsync("smtp_password"))?.Value ?? "";

        if (!int.TryParse(smtpPortStr, out var smtpPort)) smtpPort = 587;

        using var client = new SmtpClient(smtpHost, smtpPort)
        {
            EnableSsl = true,
            Credentials = new NetworkCredential(smtpUser, smtpPass)
        };

        var mail = new MailMessage(smtpUser, to, "Test Email từ NexKey", "Email test thành công!");
        await client.SendMailAsync(mail);
    }
}
