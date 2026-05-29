namespace NexKey.Api.Common;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string? Error { get; set; }
    public string? Code { get; set; }
    public PagedMeta? Meta { get; set; }

    public static ApiResponse<T> Ok(T data) => new() { Success = true, Data = data };

    public static ApiResponse<T> Paged(T data, int total, int page, int limit) => new()
    {
        Success = true,
        Data = data,
        Meta = new PagedMeta(total, page, limit)
    };

    public static ApiResponse<T> Fail(string error, string code = "SERVER_ERROR") => new()
    {
        Success = false,
        Error = error,
        Code = code
    };
}

public record PagedMeta(int Total, int Page, int Limit, int TotalPages)
{
    public PagedMeta(int total, int page, int limit)
        : this(total, page, limit, (int)Math.Ceiling((double)total / limit)) { }
}
