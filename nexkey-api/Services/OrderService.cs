using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using NexKey.Api.Common;
using NexKey.Api.Models.DTOs.Orders;
using NexKey.Api.Interfaces;
using NexKey.Api.Models.Entities;
using NexKey.Api.Models.Enums;
using NexKey.Api.Data;

namespace NexKey.Api.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _db;
    private readonly IActivityLogService _logService;

    public OrderService(AppDbContext db, IActivityLogService logService)
    {
        _db = db;
        _logService = logService;
    }

    public async Task<(List<OrderDto> Items, int Total)> GetListAsync(OrderQueryParams q)
    {
        var query = _db.Orders.Include(o => o.Items).AsQueryable();

        if (q.Status.HasValue) query = query.Where(o => o.Status == q.Status.Value);
        if (q.PaymentMethod.HasValue) query = query.Where(o => o.PaymentMethod == q.PaymentMethod.Value);
        if (q.MinAmount.HasValue) query = query.Where(o => o.Total >= q.MinAmount.Value);
        if (q.MaxAmount.HasValue) query = query.Where(o => o.Total <= q.MaxAmount.Value);
        if (!string.IsNullOrWhiteSpace(q.Search))
        {
            var s = q.Search.ToLower();
            query = query.Where(o => o.Id.ToLower().Contains(s)
                || o.CustomerName.ToLower().Contains(s)
                || o.CustomerEmail.ToLower().Contains(s)
                || o.CustomerPhone.Contains(s));
        }

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(o => o.CreatedAt)
            .Skip((q.Page - 1) * q.Limit).Take(q.Limit)
            .ToListAsync();

        return (items.Select(MapToDto).ToList(), total);
    }

    public async Task<OrderDto> GetByIdAsync(string id)
    {
        var order = await _db.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id)
            ?? throw AppException.NotFound($"Không tìm thấy đơn hàng {id}");
        return MapToDto(order);
    }

    public async Task<OrderDto> CreateAsync(CreateOrderRequest request)
    {
        var customer = await _db.Customers.FindAsync(request.CustomerId)
            ?? throw AppException.NotFound("Không tìm thấy khách hàng");

        var productIds = request.Items.Select(i => i.ProductId).ToList();
        var products = await _db.Products.Where(p => productIds.Contains(p.Id)).ToListAsync();

        if (products.Count != productIds.Distinct().Count())
            throw AppException.NotFound("Một hoặc nhiều sản phẩm không tồn tại");

        var items = request.Items.Select(i =>
        {
            var product = products.First(p => p.Id == i.ProductId);
            return new OrderItem
            {
                ProductId = i.ProductId,
                Name = product.Name,
                Price = product.Price,
                Quantity = i.Quantity
            };
        }).ToList();

        long subtotal = items.Sum(i => i.Price * i.Quantity);
        string orderId = await GenerateOrderIdAsync();

        var order = new Order
        {
            Id = orderId,
            CustomerId = customer.Id,
            CustomerName = customer.FullName,
            CustomerEmail = customer.Email,
            CustomerPhone = customer.Phone ?? "",
            Total = subtotal - request.Discount,
            Discount = request.Discount,
            PaymentMethod = request.PaymentMethod,
            Status = OrderStatus.ChoThanhToan,
            Note = request.Note,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Items = items
        };

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        await _logService.CreateAsync(ActivityLogType.Order, "Đơn hàng mới", $"Đơn hàng {orderId} được tạo", null, new { orderId });

        return MapToDto(order);
    }

    public async Task<OrderDto> UpdateAsync(string id, UpdateOrderRequest request)
    {
        var order = await _db.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id)
            ?? throw AppException.NotFound($"Không tìm thấy đơn hàng {id}");

        if (request.Status.HasValue) order.Status = request.Status.Value;
        if (request.Note != null) order.Note = request.Note;
        order.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return MapToDto(order);
    }

    public async Task DeleteAsync(string id)
    {
        var order = await _db.Orders.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy đơn hàng {id}");
        _db.Orders.Remove(order);
        await _db.SaveChangesAsync();
    }

    public async Task<OrderStatsDto> GetStatsAsync()
    {
        var orders = await _db.Orders.ToListAsync();
        return new OrderStatsDto
        {
            DangXuLy = orders.Count(o => o.Status == OrderStatus.DangXuLy),
            HoanThanh = orders.Count(o => o.Status == OrderStatus.HoanThanh),
            DaHuy = orders.Count(o => o.Status == OrderStatus.DaHuy),
            HoanTien = orders.Count(o => o.Status == OrderStatus.HoanTien),
            ChoThanhToan = orders.Count(o => o.Status == OrderStatus.ChoThanhToan),
            TongDoanhThu = orders.Where(o => o.Status == OrderStatus.HoanThanh).Sum(o => o.Total)
        };
    }

    public async Task<byte[]> ExportExcelAsync(OrderQueryParams query)
    {
        var (items, _) = await GetListAsync(new OrderQueryParams { Status = query.Status, Search = query.Search, Page = 1, Limit = 10000 });

        using var wb = new XLWorkbook();
        var ws = wb.Worksheets.Add("Đơn hàng");
        ws.Cell(1, 1).Value = "Mã đơn"; ws.Cell(1, 2).Value = "Khách hàng";
        ws.Cell(1, 3).Value = "Email"; ws.Cell(1, 4).Value = "Tổng tiền";
        ws.Cell(1, 5).Value = "Thanh toán"; ws.Cell(1, 6).Value = "Trạng thái";
        ws.Cell(1, 7).Value = "Ngày tạo";

        for (int i = 0; i < items.Count; i++)
        {
            var o = items[i]; int row = i + 2;
            ws.Cell(row, 1).Value = o.Id;
            ws.Cell(row, 2).Value = o.CustomerName;
            ws.Cell(row, 3).Value = o.CustomerEmail;
            ws.Cell(row, 4).Value = o.Total;
            ws.Cell(row, 5).Value = o.PaymentMethod.ToString();
            ws.Cell(row, 6).Value = o.Status.ToString();
            ws.Cell(row, 7).Value = o.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss");
        }

        using var ms = new MemoryStream();
        wb.SaveAs(ms);
        return ms.ToArray();
    }

    public async Task<OrderDto> RefundAsync(string id)
    {
        var order = await _db.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id)
            ?? throw AppException.NotFound($"Không tìm thấy đơn hàng {id}");

        if (order.Status != OrderStatus.HoanThanh)
            throw AppException.Unprocessable("Chỉ có thể hoàn tiền đơn hàng đã hoàn thành");

        order.Status = OrderStatus.HoanTien;
        order.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        await _logService.CreateAsync(ActivityLogType.Payment, "Hoàn tiền đơn hàng", $"Đơn hàng {id} được hoàn tiền", null, new { orderId = id });

        return MapToDto(order);
    }

    public async Task<List<RevenuePointDto>> GetRevenueAsync(string period)
    {
        var today = DateTime.UtcNow.Date;
        return period switch
        {
            "7d"  => await GetRevenue7DAsync(today),
            "1m"  => await GetRevenue1MAsync(today),
            "3m"  => await GetRevenue3MAsync(today),
            "6m"  => await GetRevenueByMonthAsync(today, 6),
            "1y"  => await GetRevenueByMonthAsync(today, 12),
            _     => await GetRevenue7DAsync(today),
        };
    }

    private async Task<List<RevenuePointDto>> GetRevenue7DAsync(DateTime today)
    {
        var from = today.AddDays(-6);
        var orders = await _db.Orders
            .Where(o => o.Status == OrderStatus.HoanThanh && o.CreatedAt.Date >= from)
            .ToListAsync();

        var dayNames = new[] { "CN", "T2", "T3", "T4", "T5", "T6", "T7" };
        return Enumerable.Range(0, 7).Select(i =>
        {
            var date = from.AddDays(i);
            var dayOrders = orders.Where(o => o.CreatedAt.Date == date).ToList();
            return new RevenuePointDto
            {
                Label   = dayNames[(int)date.DayOfWeek],
                Revenue = dayOrders.Sum(o => o.Total),
                Orders  = dayOrders.Count
            };
        }).ToList();
    }

    private async Task<List<RevenuePointDto>> GetRevenue1MAsync(DateTime today)
    {
        var from = today.AddDays(-29);
        var orders = await _db.Orders
            .Where(o => o.Status == OrderStatus.HoanThanh && o.CreatedAt.Date >= from)
            .ToListAsync();

        return Enumerable.Range(0, 30).Select(i =>
        {
            var date = from.AddDays(i);
            var dayOrders = orders.Where(o => o.CreatedAt.Date == date).ToList();
            return new RevenuePointDto
            {
                Label   = date.ToString("dd/MM"),
                Revenue = dayOrders.Sum(o => o.Total),
                Orders  = dayOrders.Count
            };
        }).ToList();
    }

    private async Task<List<RevenuePointDto>> GetRevenue3MAsync(DateTime today)
    {
        var from = today.AddMonths(-3).AddDays(1);
        var orders = await _db.Orders
            .Where(o => o.Status == OrderStatus.HoanThanh && o.CreatedAt.Date >= from)
            .ToListAsync();

        var result = new List<RevenuePointDto>();
        var weekStart = from;
        int weekNum = 1;
        while (weekStart <= today)
        {
            var weekEnd = weekStart.AddDays(6) > today ? today : weekStart.AddDays(6);
            var weekOrders = orders.Where(o => o.CreatedAt.Date >= weekStart && o.CreatedAt.Date <= weekEnd).ToList();
            result.Add(new RevenuePointDto
            {
                Label   = $"W{weekNum}",
                Revenue = weekOrders.Sum(o => o.Total),
                Orders  = weekOrders.Count
            });
            weekStart = weekStart.AddDays(7);
            weekNum++;
        }
        return result;
    }

    private async Task<List<RevenuePointDto>> GetRevenueByMonthAsync(DateTime today, int months)
    {
        var from = new DateTime(today.Year, today.Month, 1).AddMonths(-(months - 1));
        var orders = await _db.Orders
            .Where(o => o.Status == OrderStatus.HoanThanh && o.CreatedAt >= from)
            .ToListAsync();

        return Enumerable.Range(0, months).Select(i =>
        {
            var monthStart = from.AddMonths(i);
            var monthEnd   = monthStart.AddMonths(1);
            var monthOrders = orders
                .Where(o => o.CreatedAt.Date >= monthStart && o.CreatedAt.Date < monthEnd)
                .ToList();
            return new RevenuePointDto
            {
                Label   = $"T{monthStart.Month}",
                Revenue = monthOrders.Sum(o => o.Total),
                Orders  = monthOrders.Count
            };
        }).ToList();
    }

    private async Task<string> GenerateOrderIdAsync()
    {
        string id;
        do
        {
            id = $"ORD-{Random.Shared.Next(100000, 999999)}";
        } while (await _db.Orders.AnyAsync(o => o.Id == id));
        return id;
    }

    private static OrderDto MapToDto(Order o) => new()
    {
        Id = o.Id,
        CustomerId = o.CustomerId,
        CustomerName = o.CustomerName,
        CustomerEmail = o.CustomerEmail,
        CustomerPhone = o.CustomerPhone,
        Total = o.Total,
        Discount = o.Discount,
        PaymentMethod = o.PaymentMethod,
        Status = o.Status,
        Note = o.Note,
        CreatedAt = o.CreatedAt,
        UpdatedAt = o.UpdatedAt,
        Items = o.Items.Select(i => new OrderItemDto
        {
            Id = i.Id,
            ProductId = i.ProductId,
            Name = i.Name,
            Price = i.Price,
            Quantity = i.Quantity,
            LicenseKey = i.LicenseKey
        }).ToList()
    };
}
