namespace NexKey.Api.Models.Entities;

public class Setting
{
    public string Key { get; set; } = null!;
    public string Value { get; set; } = null!;
    public string Group { get; set; } = null!;
    public DateTime UpdatedAt { get; set; }
}
