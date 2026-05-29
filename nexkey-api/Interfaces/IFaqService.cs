using NexKey.Api.Models.DTOs.Faqs;

namespace NexKey.Api.Interfaces;

public interface IFaqService
{
    Task<(List<FaqDto> Items, int Total)> GetListAsync(FaqQueryParams query);
    Task<FaqDto> GetByIdAsync(string id);
    Task<FaqDto> CreateAsync(CreateFaqRequest request);
    Task<FaqDto> UpdateAsync(string id, UpdateFaqRequest request);
    Task DeleteAsync(string id);
    Task<FaqDto> ToggleAsync(string id);
    Task ReorderAsync(List<ReorderFaqRequest> items);
}
