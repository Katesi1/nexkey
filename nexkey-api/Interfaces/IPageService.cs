using NexKey.Api.Models.DTOs.Pages;

namespace NexKey.Api.Interfaces;

public interface IPageService
{
    Task<List<PageDto>> GetListAsync();
    Task<PageDto> GetByIdAsync(string id);
    Task<PageDto> GetBySlugAsync(string slug);
    Task<PageDto> CreateAsync(CreatePageRequest request);
    Task<PageDto> UpdateAsync(string id, UpdatePageRequest request);
    Task DeleteAsync(string id);
}
