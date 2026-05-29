using NexKey.Api.Models.DTOs.Banners;

namespace NexKey.Api.Interfaces;

public interface IBannerService
{
    Task<List<BannerDto>> GetListAsync(BannerQueryParams query);
    Task<BannerDto> GetByIdAsync(string id);
    Task<BannerDto> CreateAsync(CreateBannerRequest request);
    Task<BannerDto> UpdateAsync(string id, UpdateBannerRequest request);
    Task DeleteAsync(string id);
    Task<BannerDto> ToggleAsync(string id);
    Task ReorderAsync(List<ReorderBannerRequest> items);
    Task<string> UploadImageAsync(Stream stream, string fileName);
}
