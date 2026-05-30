using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using NexKey.Api.Common;
using NexKey.Api.Models.DTOs.Customers;
using NexKey.Api.Interfaces;
using NexKey.Api.Models.Entities;
using NexKey.Api.Models.Enums;
using NexKey.Api.Data;

namespace NexKey.Api.Services;

public class CustomerService : ICustomerService
{
    private readonly AppDbContext _db;

    public CustomerService(AppDbContext db) => _db = db;

    public async Task<(List<CustomerDto> Items, int Total)> GetListAsync(CustomerQueryParams q)
    {
        var query = _db.Customers.AsQueryable();

        if (q.Status.HasValue) query = query.Where(c => c.Status == q.Status.Value);
        if (!string.IsNullOrWhiteSpace(q.Search))
        {
            var s = q.Search.ToLower();
            query = query.Where(c => c.FullName.ToLower().Contains(s)
                || c.Email.ToLower().Contains(s)
                || (c.Phone != null && c.Phone.Contains(s)));
        }

        // Nếu có filter spending thì cần tính trước khi paginate để count đúng
        if (q.MinSpending.HasValue || q.MaxSpending.HasValue)
        {
            var allIds = await query.Select(c => c.Id).ToListAsync();

            var spendingMap = await _db.Orders
                .Where(o => allIds.Contains(o.CustomerId) && o.Status == OrderStatus.HoanThanh)
                .GroupBy(o => o.CustomerId)
                .Select(g => new { Id = g.Key, Total = g.Sum(o => o.Total) })
                .ToDictionaryAsync(x => x.Id, x => x.Total);

            var filteredIds = allIds
                .Where(id => {
                    var s = spendingMap.GetValueOrDefault(id, 0);
                    if (q.MinSpending.HasValue && s < q.MinSpending.Value) return false;
                    if (q.MaxSpending.HasValue && s > q.MaxSpending.Value) return false;
                    return true;
                })
                .ToList();

            var total = filteredIds.Count;
            var pageIds = filteredIds.Skip((q.Page - 1) * q.Limit).Take(q.Limit).ToList();

            var customers = await _db.Customers
                .Where(c => pageIds.Contains(c.Id))
                .OrderByDescending(c => c.JoinedAt)
                .ToListAsync();

            var orderCountMap = await _db.Orders
                .Where(o => pageIds.Contains(o.CustomerId))
                .GroupBy(o => o.CustomerId)
                .Select(g => new { Id = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Id, x => x.Count);

            var dtos = customers.Select(c => {
                var dto = MapToDto(c);
                dto.TotalOrders = orderCountMap.GetValueOrDefault(c.Id, 0);
                dto.TotalSpending = spendingMap.GetValueOrDefault(c.Id, 0);
                return dto;
            }).ToList();

            return (dtos, total);
        }

        // Không filter spending → paginate thẳng ở DB
        var count = await query.CountAsync();
        var page = await query.OrderByDescending(c => c.JoinedAt)
            .Skip((q.Page - 1) * q.Limit).Take(q.Limit).ToListAsync();

        var pageCustomerIds = page.Select(c => c.Id).ToList();

        var completedOrderStats = await _db.Orders
            .Where(o => pageCustomerIds.Contains(o.CustomerId) && o.Status == OrderStatus.HoanThanh)
            .GroupBy(o => o.CustomerId)
            .Select(g => new { Id = g.Key, Total = g.Sum(o => o.Total) })
            .ToDictionaryAsync(x => x.Id, x => x.Total);

        var allOrderCounts = await _db.Orders
            .Where(o => pageCustomerIds.Contains(o.CustomerId))
            .GroupBy(o => o.CustomerId)
            .Select(g => new { Id = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Id, x => x.Count);

        var result = page.Select(c => {
            var dto = MapToDto(c);
            dto.TotalOrders = allOrderCounts.GetValueOrDefault(c.Id, 0);
            dto.TotalSpending = completedOrderStats.GetValueOrDefault(c.Id, 0);
            return dto;
        }).ToList();

        return (result, count);
    }

    public async Task<CustomerDetailDto> GetByIdAsync(string id)
    {
        var customer = await _db.Customers.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy khách hàng {id}");

        var orders = await _db.Orders.Where(o => o.CustomerId == id)
            .OrderByDescending(o => o.CreatedAt).Take(20).ToListAsync();

        var totalSpending = orders.Where(o => o.Status == OrderStatus.HoanThanh).Sum(o => o.Total);

        var dto = new CustomerDetailDto
        {
            Id = customer.Id, FullName = customer.FullName, Email = customer.Email,
            Phone = customer.Phone, Avatar = customer.Avatar,
            TotalOrders = orders.Count, TotalSpending = totalSpending,
            Status = customer.Status, JoinedAt = customer.JoinedAt, UpdatedAt = customer.UpdatedAt,
            Orders = orders.Select(o => new CustomerOrderDto
            {
                Id = o.Id, Total = o.Total, Status = o.Status,
                PaymentMethod = o.PaymentMethod, CreatedAt = o.CreatedAt
            }).ToList()
        };

        return dto;
    }

    public async Task<CustomerDto> CreateAsync(CreateCustomerRequest request)
    {
        if (await _db.Customers.AnyAsync(c => c.Email == request.Email))
            throw AppException.Conflict($"Email '{request.Email}' đã được sử dụng");

        var customer = new Customer
        {
            Id = Guid.NewGuid().ToString(),
            FullName = request.FullName,
            Email = request.Email,
            Phone = request.Phone,
            Avatar = request.Avatar,
            Status = request.Status,
            JoinedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Customers.Add(customer);
        await _db.SaveChangesAsync();
        return MapToDto(customer);
    }

    public async Task<CustomerDto> UpdateAsync(string id, UpdateCustomerRequest request)
    {
        var customer = await _db.Customers.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy khách hàng {id}");

        if (request.Email != null && request.Email != customer.Email)
        {
            if (await _db.Customers.AnyAsync(c => c.Email == request.Email && c.Id != id))
                throw AppException.Conflict($"Email '{request.Email}' đã được sử dụng");
            customer.Email = request.Email;
        }

        if (request.FullName != null) customer.FullName = request.FullName;
        if (request.Phone != null) customer.Phone = request.Phone;
        if (request.Avatar != null) customer.Avatar = request.Avatar;
        if (request.Status.HasValue) customer.Status = request.Status.Value;
        customer.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return MapToDto(customer);
    }

    public async Task DeleteAsync(string id)
    {
        var customer = await _db.Customers.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy khách hàng {id}");
        _db.Customers.Remove(customer);
        await _db.SaveChangesAsync();
    }

    public async Task<CustomerDto> LockAsync(string id, bool locked)
    {
        var customer = await _db.Customers.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy khách hàng {id}");

        customer.Status = locked ? CustomerStatus.BiKhoa : CustomerStatus.HoatDong;
        customer.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return MapToDto(customer);
    }

    public async Task<byte[]> ExportExcelAsync(CustomerQueryParams query)
    {
        var (items, _) = await GetListAsync(new CustomerQueryParams { Status = query.Status, Search = query.Search, Page = 1, Limit = 10000 });

        using var wb = new XLWorkbook();
        var ws = wb.Worksheets.Add("Khách hàng");
        ws.Cell(1, 1).Value = "Họ tên"; ws.Cell(1, 2).Value = "Email";
        ws.Cell(1, 3).Value = "Điện thoại"; ws.Cell(1, 4).Value = "Tổng đơn";
        ws.Cell(1, 5).Value = "Tổng chi tiêu"; ws.Cell(1, 6).Value = "Trạng thái";
        ws.Cell(1, 7).Value = "Ngày tham gia";

        for (int i = 0; i < items.Count; i++)
        {
            var c = items[i]; int row = i + 2;
            ws.Cell(row, 1).Value = c.FullName;
            ws.Cell(row, 2).Value = c.Email;
            ws.Cell(row, 3).Value = c.Phone;
            ws.Cell(row, 4).Value = c.TotalOrders;
            ws.Cell(row, 5).Value = c.TotalSpending;
            ws.Cell(row, 6).Value = c.Status.ToString();
            ws.Cell(row, 7).Value = c.JoinedAt.ToString("yyyy-MM-dd");
        }

        using var ms = new MemoryStream();
        wb.SaveAs(ms);
        return ms.ToArray();
    }

    private static CustomerDto MapToDto(Customer c) => new()
    {
        Id = c.Id, FullName = c.FullName, Email = c.Email, Phone = c.Phone, Avatar = c.Avatar,
        Status = c.Status, JoinedAt = c.JoinedAt, UpdatedAt = c.UpdatedAt
    };
}
