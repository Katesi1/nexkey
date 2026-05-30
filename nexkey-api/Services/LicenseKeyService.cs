using Microsoft.EntityFrameworkCore;
using NexKey.Api.Common;
using NexKey.Api.Models.DTOs.Keys;
using NexKey.Api.Interfaces;
using NexKey.Api.Models.Entities;
using NexKey.Api.Models.Enums;
using NexKey.Api.Data;

namespace NexKey.Api.Services;

public class LicenseKeyService : ILicenseKeyService
{
    private readonly AppDbContext _db;

    public LicenseKeyService(AppDbContext db) => _db = db;

    public async Task<(List<LicenseKeyDto> Items, int Total)> GetListAsync(LicenseKeyQueryParams q)
    {
        var query = _db.LicenseKeys.AsQueryable();

        if (q.Status.HasValue) query = query.Where(k => k.Status == q.Status.Value);
        if (!string.IsNullOrWhiteSpace(q.ProductId)) query = query.Where(k => k.ProductId == q.ProductId);
        if (!string.IsNullOrWhiteSpace(q.Search))
        {
            var s = q.Search.ToLower();
            query = query.Where(k => k.Key.ToLower().Contains(s)
                || k.ProductName.ToLower().Contains(s)
                || (k.CustomerName != null && k.CustomerName.ToLower().Contains(s)));
        }

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(k => k.CreatedAt)
            .Skip((q.Page - 1) * q.Limit).Take(q.Limit).ToListAsync();

        return (items.Select(MapToDto).ToList(), total);
    }

    public async Task<LicenseKeyDto> GetByIdAsync(string id)
    {
        var key = await _db.LicenseKeys.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy key {id}");
        return MapToDto(key);
    }

    public async Task<LicenseKeyDto> CreateAsync(CreateLicenseKeyRequest request)
    {
        if (await _db.LicenseKeys.AnyAsync(k => k.Key == request.Key))
            throw AppException.Conflict($"Key '{request.Key}' đã tồn tại");

        var product = await _db.Products.FindAsync(request.ProductId)
            ?? throw AppException.NotFound("Không tìm thấy sản phẩm");

        var key = new LicenseKey
        {
            Id = Guid.NewGuid().ToString(),
            Key = request.Key,
            ProductId = request.ProductId,
            ProductName = product.Name,
            Status = request.Status,
            ExpiresAt = request.ExpiresAt,
            CreatedAt = DateTime.UtcNow
        };

        _db.LicenseKeys.Add(key);
        await _db.SaveChangesAsync();
        return MapToDto(key);
    }

    public async Task<List<LicenseKeyDto>> BulkCreateAsync(BulkCreateLicenseKeyRequest request)
    {
        var product = await _db.Products.FindAsync(request.ProductId)
            ?? throw AppException.NotFound("Không tìm thấy sản phẩm");

        var keys = new List<LicenseKey>();
        for (int i = 0; i < request.Quantity; i++)
        {
            var rawKey = Guid.NewGuid().ToString("N").ToUpper();
            var keyValue = string.IsNullOrWhiteSpace(request.Prefix)
                ? rawKey
                : $"{request.Prefix}-{rawKey}";

            keys.Add(new LicenseKey
            {
                Id = Guid.NewGuid().ToString(),
                Key = keyValue,
                ProductId = request.ProductId,
                ProductName = product.Name,
                Status = request.Status,
                ExpiresAt = request.ExpiresAt,
                CreatedAt = DateTime.UtcNow
            });
        }

        _db.LicenseKeys.AddRange(keys);
        await _db.SaveChangesAsync();
        return keys.Select(MapToDto).ToList();
    }

    public async Task<LicenseKeyDto> UpdateAsync(string id, UpdateLicenseKeyRequest request)
    {
        var key = await _db.LicenseKeys.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy key {id}");

        if (request.Status.HasValue) key.Status = request.Status.Value;
        if (request.ExpiresAt.HasValue) key.ExpiresAt = request.ExpiresAt;

        await _db.SaveChangesAsync();
        return MapToDto(key);
    }

    public async Task DeleteAsync(string id)
    {
        var key = await _db.LicenseKeys.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy key {id}");
        _db.LicenseKeys.Remove(key);
        await _db.SaveChangesAsync();
    }

    public async Task<LicenseKeyDto> LockAsync(string id, bool locked)
    {
        var key = await _db.LicenseKeys.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy key {id}");

        key.Status = locked ? LicenseKeyStatus.BiKhoa : LicenseKeyStatus.HoatDong;
        await _db.SaveChangesAsync();
        return MapToDto(key);
    }

    public async Task<LicenseKeyDto> AssignAsync(AssignLicenseKeyRequest request)
    {
        var key = await _db.LicenseKeys.FindAsync(request.KeyId)
            ?? throw AppException.NotFound("Không tìm thấy key");

        if (key.Status == LicenseKeyStatus.BiKhoa)
            throw AppException.Unprocessable("Key đang bị khóa");

        var customer = await _db.Customers.FindAsync(request.CustomerId)
            ?? throw AppException.NotFound("Không tìm thấy khách hàng");

        var order = await _db.Orders.FindAsync(request.OrderId)
            ?? throw AppException.NotFound("Không tìm thấy đơn hàng");

        key.CustomerId = request.CustomerId;
        key.CustomerName = customer.FullName;
        key.OrderId = request.OrderId;
        key.ActivatedAt = DateTime.UtcNow;
        key.Status = LicenseKeyStatus.HoatDong;

        await _db.SaveChangesAsync();
        return MapToDto(key);
    }

    public async Task UpdateExpiredKeysAsync()
    {
        var now = DateTime.UtcNow;
        var soon = now.AddDays(7);

        var expiredKeys = await _db.LicenseKeys
            .Where(k => k.ExpiresAt.HasValue && k.ExpiresAt < now && k.Status != LicenseKeyStatus.DaHetHan)
            .ToListAsync();

        foreach (var key in expiredKeys)
            key.Status = LicenseKeyStatus.DaHetHan;

        var soonKeys = await _db.LicenseKeys
            .Where(k => k.ExpiresAt.HasValue && k.ExpiresAt >= now && k.ExpiresAt < soon
                && k.Status == LicenseKeyStatus.HoatDong)
            .ToListAsync();

        foreach (var key in soonKeys)
            key.Status = LicenseKeyStatus.SapHetHan;

        await _db.SaveChangesAsync();
    }

    private static LicenseKeyDto MapToDto(LicenseKey k) => new()
    {
        Id = k.Id, Key = k.Key, ProductId = k.ProductId, ProductName = k.ProductName,
        CustomerId = k.CustomerId, CustomerName = k.CustomerName, OrderId = k.OrderId,
        ActivatedAt = k.ActivatedAt, ExpiresAt = k.ExpiresAt,
        Status = k.Status, CreatedAt = k.CreatedAt
    };
}
