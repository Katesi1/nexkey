using NexKey.Api.Models.DTOs.Categories;

namespace NexKey.Api.Interfaces;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetListAsync(CategoryQueryParams query);
    Task<CategoryDto> GetByIdAsync(string id);
    Task<CategoryDto> CreateAsync(CreateCategoryRequest request);
    Task<CategoryDto> UpdateAsync(string id, UpdateCategoryRequest request);
    Task DeleteAsync(string id);
    Task<CategoryDto> ToggleAsync(string id);
}
