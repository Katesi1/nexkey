using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexKey.Api.Data;
using NexKey.Api.Interfaces;

namespace NexKey.Api.Controllers;

[Route("api/dashboard")]
public class DashboardController : BaseController
{
    private readonly IOrderService _orderService;
    private readonly AppDbContext _db;

    public DashboardController(IOrderService orderService, AppDbContext db)
    {
        _orderService = orderService;
        _db = db;
    }

    /// <summary>
    /// Tráº£ vá» táº¥t cáº£ sá»‘ liá»‡u dashboard trong 1 request.
    /// </summary>
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var orderStats     = await _orderService.GetStatsAsync();
        var totalCustomers = await _db.Customers.CountAsync();
        var totalProducts  = await _db.Products.CountAsync();

        return Ok(new
        {
            orderStats.DangXuLy,
            orderStats.HoanThanh,
            orderStats.DaHuy,
            orderStats.HoanTien,
            orderStats.ChoThanhToan,
            orderStats.TongDoanhThu,
            TotalOrders    = orderStats.DangXuLy + orderStats.HoanThanh
                           + orderStats.DaHuy + orderStats.HoanTien + orderStats.ChoThanhToan,
            TotalCustomers = totalCustomers,
            TotalProducts  = totalProducts,
        });
    }
}
