using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using NexKey.Api.Common;
using NexKey.Api.Models.DTOs.Products;
using NexKey.Api.Interfaces;
using NexKey.Api.Models.Entities;
using NexKey.Api.Data;

namespace NexKey.Api.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _db;

    public ProductService(AppDbContext db) => _db = db;

    public async Task<(List<ProductDto> Items, int Total)> GetListAsync(ProductQueryParams q)
    {
        var query = _db.Products.AsQueryable();

        if (q.Status.HasValue) query = query.Where(p => p.Status == q.Status.Value);
        if (q.Type.HasValue) query = query.Where(p => p.Type == q.Type.Value);
        if (!string.IsNullOrWhiteSpace(q.CategoryId)) query = query.Where(p => p.CategoryId == q.CategoryId);
        if (!string.IsNullOrWhiteSpace(q.Search))
        {
            var s = q.Search.ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(s) || p.Sku.ToLower().Contains(s));
        }

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(p => p.CreatedAt)
            .Skip((q.Page - 1) * q.Limit).Take(q.Limit).ToListAsync();

        return (items.Select(MapToDto).ToList(), total);
    }

    public async Task<ProductDto> GetByIdAsync(string id)
    {
        var product = await _db.Products.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy sản phẩm {id}");
        return MapToDto(product);
    }

    public async Task<ProductDto> CreateAsync(CreateProductRequest request)
    {
        if (await _db.Products.AnyAsync(p => p.Sku == request.Sku))
            throw AppException.Conflict($"SKU '{request.Sku}' đã tồn tại");

        var category = await _db.Categories.FindAsync(request.CategoryId)
            ?? throw AppException.NotFound("Không tìm thấy danh mục");

        var product = new Product
        {
            Id = Guid.NewGuid().ToString(),
            Name = request.Name,
            Sku = request.Sku,
            CategoryId = request.CategoryId,
            CategoryName = category.Name,
            Type = request.Type,
            Price = request.Price,
            ComparePrice = request.ComparePrice,
            Stock = request.Stock,
            Status = request.Status,
            Image = request.Image,
            Description = request.Description,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Products.Add(product);
        await _db.SaveChangesAsync();
        return MapToDto(product);
    }

    public async Task<ProductDto> UpdateAsync(string id, UpdateProductRequest request)
    {
        var product = await _db.Products.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy sản phẩm {id}");

        if (request.Sku != null && request.Sku != product.Sku)
        {
            if (await _db.Products.AnyAsync(p => p.Sku == request.Sku && p.Id != id))
                throw AppException.Conflict($"SKU '{request.Sku}' đã tồn tại");
            product.Sku = request.Sku;
        }

        if (request.CategoryId != null)
        {
            var category = await _db.Categories.FindAsync(request.CategoryId)
                ?? throw AppException.NotFound("Không tìm thấy danh mục");
            product.CategoryId = request.CategoryId;
            product.CategoryName = category.Name;
        }

        if (request.Name != null) product.Name = request.Name;
        if (request.Type.HasValue) product.Type = request.Type.Value;
        if (request.Price.HasValue) product.Price = request.Price.Value;
        if (request.ComparePrice.HasValue) product.ComparePrice = request.ComparePrice;
        if (request.Stock.HasValue) product.Stock = request.Stock.Value;
        if (request.Status.HasValue) product.Status = request.Status.Value;
        if (request.Image != null) product.Image = request.Image;
        if (request.Description != null) product.Description = request.Description;
        product.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return MapToDto(product);
    }

    public async Task DeleteAsync(string id)
    {
        var product = await _db.Products.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy sản phẩm {id}");
        _db.Products.Remove(product);
        await _db.SaveChangesAsync();
    }

    public async Task<byte[]> ExportExcelAsync(ProductQueryParams query)
    {
        var (items, _) = await GetListAsync(new ProductQueryParams { Status = query.Status, Search = query.Search, Page = 1, Limit = 10000 });

        using var wb = new XLWorkbook();
        var ws = wb.Worksheets.Add("Sản phẩm");
        ws.Cell(1, 1).Value = "SKU"; ws.Cell(1, 2).Value = "Tên sản phẩm";
        ws.Cell(1, 3).Value = "Danh mục"; ws.Cell(1, 4).Value = "Loại";
        ws.Cell(1, 5).Value = "Giá"; ws.Cell(1, 6).Value = "Tồn kho";
        ws.Cell(1, 7).Value = "Đã bán"; ws.Cell(1, 8).Value = "Trạng thái";

        for (int i = 0; i < items.Count; i++)
        {
            var p = items[i]; int row = i + 2;
            ws.Cell(row, 1).Value = p.Sku;
            ws.Cell(row, 2).Value = p.Name;
            ws.Cell(row, 3).Value = p.CategoryName;
            ws.Cell(row, 4).Value = p.Type.ToString();
            ws.Cell(row, 5).Value = p.Price;
            ws.Cell(row, 6).Value = p.Stock;
            ws.Cell(row, 7).Value = p.Sold;
            ws.Cell(row, 8).Value = p.Status.ToString();
        }

        using var ms = new MemoryStream();
        wb.SaveAs(ms);
        return ms.ToArray();
    }

    public async Task<ProductDto> UpdateStockAsync(string id, UpdateStockRequest request)
    {
        var product = await _db.Products.FindAsync(id)
            ?? throw AppException.NotFound($"Không tìm thấy sản phẩm {id}");

        if (request.Action == "add")
            product.Stock += request.Quantity;
        else if (request.Action == "subtract")
        {
            if (product.Stock < request.Quantity)
                throw AppException.Unprocessable("Tồn kho không đủ");
            product.Stock -= request.Quantity;
        }
        else
            throw new AppException("Action phải là 'add' hoặc 'subtract'");

        product.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return MapToDto(product);
    }

    private static ProductDto MapToDto(Product p) => new()
    {
        Id = p.Id, Name = p.Name, Sku = p.Sku,
        CategoryId = p.CategoryId, CategoryName = p.CategoryName,
        Type = p.Type, Price = p.Price, ComparePrice = p.ComparePrice,
        Stock = p.Stock, Sold = p.Sold, Status = p.Status,
        Image = p.Image, Description = p.Description,
        CreatedAt = p.CreatedAt, UpdatedAt = p.UpdatedAt
    };
}
