using NexKey.Api.Models.DTOs.Products;

namespace NexKey.Api.Interfaces;

public interface IProductService
{
    Task<(List<ProductDto> Items, int Total)> GetListAsync(ProductQueryParams query);
    Task<ProductDto> GetByIdAsync(string id);
    Task<ProductDto> CreateAsync(CreateProductRequest request);
    Task<ProductDto> UpdateAsync(string id, UpdateProductRequest request);
    Task DeleteAsync(string id);
    Task<byte[]> ExportExcelAsync(ProductQueryParams query);
    Task<ProductDto> UpdateStockAsync(string id, UpdateStockRequest request);
}
