namespace NexKey.Api.Common;

public class AppException : Exception
{
    public int StatusCode { get; }
    public string Code { get; }

    public AppException(string message, int statusCode = 400, string code = "VALIDATION_ERROR")
        : base(message)
    {
        StatusCode = statusCode;
        Code = code;
    }

    public static AppException NotFound(string message = "Không tìm thấy") =>
        new(message, 404, "NOT_FOUND");

    public static AppException Conflict(string message) =>
        new(message, 409, "CONFLICT");

    public static AppException Unprocessable(string message) =>
        new(message, 422, "UNPROCESSABLE");

    public static AppException Forbidden(string message = "Không có quyền truy cập") =>
        new(message, 403, "FORBIDDEN");
}
