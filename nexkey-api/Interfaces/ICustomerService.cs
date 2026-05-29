using NexKey.Api.Models.DTOs.Customers;

namespace NexKey.Api.Interfaces;

public interface ICustomerService
{
    Task<(List<CustomerDto> Items, int Total)> GetListAsync(CustomerQueryParams query);
    Task<CustomerDetailDto> GetByIdAsync(string id);
    Task<CustomerDto> CreateAsync(CreateCustomerRequest request);
    Task<CustomerDto> UpdateAsync(string id, UpdateCustomerRequest request);
    Task DeleteAsync(string id);
    Task<CustomerDto> LockAsync(string id, bool locked);
    Task<byte[]> ExportExcelAsync(CustomerQueryParams query);
}
