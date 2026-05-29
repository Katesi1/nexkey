using System.ComponentModel.DataAnnotations;

namespace NexKey.Api.Models.DTOs.Settings;

public class SettingDto
{
    public string Key { get; set; } = null!;
    public string Value { get; set; } = null!;
    public string Group { get; set; } = null!;
    public DateTime UpdatedAt { get; set; }
}

public class SettingsByGroupDto
{
    public string Group { get; set; } = null!;
    public Dictionary<string, string> Settings { get; set; } = new();
}

public class SendTestEmailRequest
{
    [Required, EmailAddress] public string To { get; set; } = null!;
}
