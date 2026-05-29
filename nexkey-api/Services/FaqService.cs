using Microsoft.EntityFrameworkCore;
using NexKey.Api.Common;
using NexKey.Api.Models.DTOs.Faqs;
using NexKey.Api.Interfaces;
using NexKey.Api.Models.Entities;
using NexKey.Api.Models.Enums;
using NexKey.Api.Data;

namespace NexKey.Api.Services;

public class FaqService : IFaqService
{
    private readonly AppDbContext _db;

    public FaqService(AppDbContext db) => _db = db;

    public async Task<(List<FaqDto> Items, int Total)> GetListAsync(FaqQueryParams q)
    {
        var query = _db.Faqs.AsQueryable();
        if (q.Status.HasValue) query = query.Where(f => f.Status == q.Status.Value);
        if (!string.IsNullOrWhiteSpace(q.Category)) query = query.Where(f => f.Category == q.Category);
        if (!string.IsNullOrWhiteSpace(q.Search))
        {
            var s = q.Search.ToLower();
            query = query.Where(f => f.Question.ToLower().Contains(s));
        }

        var total = await query.CountAsync();
        var items = await query.OrderBy(f => f.Category).ThenBy(f => f.SortOrder)
            .Skip((q.Page - 1) * q.Limit).Take(q.Limit).ToListAsync();

        return (items.Select(MapToDto).ToList(), total);
    }

    public async Task<FaqDto> GetByIdAsync(string id)
    {
        var faq = await _db.Faqs.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy FAQ {id}");
        return MapToDto(faq);
    }

    public async Task<FaqDto> CreateAsync(CreateFaqRequest request)
    {
        var faq = new Faq
        {
            Id = Guid.NewGuid().ToString(),
            Question = request.Question, Answer = request.Answer, Category = request.Category,
            Status = request.Status, SortOrder = request.SortOrder,
            CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
        };

        _db.Faqs.Add(faq);
        await _db.SaveChangesAsync();
        return MapToDto(faq);
    }

    public async Task<FaqDto> UpdateAsync(string id, UpdateFaqRequest request)
    {
        var faq = await _db.Faqs.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy FAQ {id}");

        if (request.Question != null) faq.Question = request.Question;
        if (request.Answer != null) faq.Answer = request.Answer;
        if (request.Category != null) faq.Category = request.Category;
        if (request.Status.HasValue) faq.Status = request.Status.Value;
        if (request.SortOrder.HasValue) faq.SortOrder = request.SortOrder.Value;
        faq.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return MapToDto(faq);
    }

    public async Task DeleteAsync(string id)
    {
        var faq = await _db.Faqs.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy FAQ {id}");
        _db.Faqs.Remove(faq);
        await _db.SaveChangesAsync();
    }

    public async Task<FaqDto> ToggleAsync(string id)
    {
        var faq = await _db.Faqs.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy FAQ {id}");

        faq.Status = faq.Status == FaqStatus.HienThi ? FaqStatus.An : FaqStatus.HienThi;
        faq.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return MapToDto(faq);
    }

    public async Task ReorderAsync(List<ReorderFaqRequest> items)
    {
        foreach (var item in items)
        {
            var faq = await _db.Faqs.FindAsync(item.Id);
            if (faq != null)
            {
                faq.SortOrder = item.SortOrder;
                faq.UpdatedAt = DateTime.UtcNow;
            }
        }
        await _db.SaveChangesAsync();
    }

    private static FaqDto MapToDto(Faq f) => new()
    {
        Id = f.Id, Question = f.Question, Answer = f.Answer, Category = f.Category,
        Status = f.Status.ToString(), SortOrder = f.SortOrder,
        CreatedAt = f.CreatedAt, UpdatedAt = f.UpdatedAt
    };
}
