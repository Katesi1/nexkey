using NexKey.Api.Models.DTOs.Suppliers;

namespace NexKey.Api.Interfaces;

public interface ISupplierService
{
    Task<List<SupplierDto>> GetListAsync(SupplierQueryParams query);
    Task<SupplierDto> GetByIdAsync(string id);
    Task<SupplierDto> CreateAsync(CreateSupplierRequest request);
    Task<SupplierDto> UpdateAsync(string id, UpdateSupplierRequest request);
    Task DeleteAsync(string id);
    Task<SupplierDto> UpdateDebtAsync(string id, UpdateDebtRequest request);
}
