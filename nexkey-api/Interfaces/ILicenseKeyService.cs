using NexKey.Api.Models.DTOs.Keys;

namespace NexKey.Api.Interfaces;

public interface ILicenseKeyService
{
    Task<(List<LicenseKeyDto> Items, int Total)> GetListAsync(LicenseKeyQueryParams query);
    Task<LicenseKeyDto> GetByIdAsync(string id);
    Task<LicenseKeyDto> CreateAsync(CreateLicenseKeyRequest request);
    Task<List<LicenseKeyDto>> BulkCreateAsync(BulkCreateLicenseKeyRequest request);
    Task<LicenseKeyDto> UpdateAsync(string id, UpdateLicenseKeyRequest request);
    Task DeleteAsync(string id);
    Task<LicenseKeyDto> LockAsync(string id, bool locked);
    Task<LicenseKeyDto> AssignAsync(AssignLicenseKeyRequest request);
    Task UpdateExpiredKeysAsync();
}
