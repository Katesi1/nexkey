using Microsoft.EntityFrameworkCore;
using NexKey.Api.Common;
using NexKey.Api.Models.DTOs.Suppliers;
using NexKey.Api.Interfaces;
using NexKey.Api.Models.Entities;
using NexKey.Api.Data;

namespace NexKey.Api.Services;

public class SupplierService : ISupplierService
{
    private readonly AppDbContext _db;

    public SupplierService(AppDbContext db) => _db = db;

    public async Task<List<SupplierDto>> GetListAsync(SupplierQueryParams q)
    {
        var query = _db.Suppliers.AsQueryable();
        if (q.Status.HasValue) query = query.Where(s => s.Status == q.Status.Value);
        if (q.HasDebt == true) query = query.Where(s => s.Debt > 0);
        if (q.HasDebt == false) query = query.Where(s => s.Debt == 0);
        if (!string.IsNullOrWhiteSpace(q.Search))
        {
            var s = q.Search.ToLower();
            query = query.Where(sup => sup.CompanyName.ToLower().Contains(s)
                || sup.TaxCode.Contains(s) || sup.Email.ToLower().Contains(s));
        }

        var suppliers = await query.OrderBy(s => s.CompanyName).ToListAsync();
        return suppliers.Select(s => MapToDto(s, 0)).ToList();
    }

    public async Task<SupplierDto> GetByIdAsync(string id)
    {
        var supplier = await _db.Suppliers.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy nhà cung cấp {id}");
        return MapToDto(supplier, 0);
    }

    public async Task<SupplierDto> CreateAsync(CreateSupplierRequest request)
    {
        if (await _db.Suppliers.AnyAsync(s => s.TaxCode == request.TaxCode))
            throw AppException.Conflict($"Mã số thuế '{request.TaxCode}' đã tồn tại");

        var supplier = new Supplier
        {
            Id = Guid.NewGuid().ToString(),
            CompanyName = request.CompanyName,
            TaxCode = request.TaxCode,
            ContactPerson = request.ContactPerson,
            Email = request.Email,
            Phone = request.Phone,
            Status = request.Status,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Suppliers.Add(supplier);
        await _db.SaveChangesAsync();
        return MapToDto(supplier, 0);
    }

    public async Task<SupplierDto> UpdateAsync(string id, UpdateSupplierRequest request)
    {
        var supplier = await _db.Suppliers.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy nhà cung cấp {id}");

        if (request.TaxCode != null && request.TaxCode != supplier.TaxCode)
        {
            if (await _db.Suppliers.AnyAsync(s => s.TaxCode == request.TaxCode && s.Id != id))
                throw AppException.Conflict($"Mã số thuế '{request.TaxCode}' đã tồn tại");
            supplier.TaxCode = request.TaxCode;
        }

        if (request.CompanyName != null) supplier.CompanyName = request.CompanyName;
        if (request.ContactPerson != null) supplier.ContactPerson = request.ContactPerson;
        if (request.Email != null) supplier.Email = request.Email;
        if (request.Phone != null) supplier.Phone = request.Phone;
        if (request.Status.HasValue) supplier.Status = request.Status.Value;
        supplier.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return MapToDto(supplier, 0);
    }

    public async Task DeleteAsync(string id)
    {
        var supplier = await _db.Suppliers.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy nhà cung cấp {id}");
        _db.Suppliers.Remove(supplier);
        await _db.SaveChangesAsync();
    }

    public async Task<SupplierDto> UpdateDebtAsync(string id, UpdateDebtRequest request)
    {
        var supplier = await _db.Suppliers.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy nhà cung cấp {id}");

        if (request.Action == "add")
            supplier.Debt += request.Amount;
        else if (request.Action == "subtract")
        {
            if (supplier.Debt < request.Amount)
                throw AppException.Unprocessable("Số tiền trừ lớn hơn công nợ hiện tại");
            supplier.Debt -= request.Amount;
        }
        else
            throw new AppException("Action phải là 'add' hoặc 'subtract'");

        supplier.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return MapToDto(supplier, 0);
    }

    private static SupplierDto MapToDto(Supplier s, int suppliedProducts) => new()
    {
        Id = s.Id, CompanyName = s.CompanyName, TaxCode = s.TaxCode,
        ContactPerson = s.ContactPerson, Email = s.Email, Phone = s.Phone,
        SuppliedProducts = suppliedProducts, Debt = s.Debt,
        Status = s.Status, CreatedAt = s.CreatedAt, UpdatedAt = s.UpdatedAt
    };
}
