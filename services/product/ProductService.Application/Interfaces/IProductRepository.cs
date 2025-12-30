using ProductService.Application.DTOs;
using ProductService.Domain.Entities;

namespace ProductService.Application.Interfaces;

public interface IProductRepository
{
    Task AddAsync(Product product);
    Task<Product?> GetByIdAsync(Guid id);
    Task<IEnumerable<Product>> GetTrendingAsync();
    Task<IEnumerable<Product>> GetByTypeAsync(string type);
    Task<(IEnumerable<Product> Items, bool HasMore)> GetCursorPagedAsync(DateTime? cursorCreatedAt, Guid? cursorId, int limit);
    Task<(IEnumerable<Product> Items, bool HasMore)>
        FilterWithCursorAsync(
            ProductFilterRequest request,
            DateTime? cursorCreatedAt,
            Guid? cursorId
        );
    Task DeleteAsync(Product product);
    Task<IEnumerable<Product>> GetByIdsAsync(List<Guid> ids);
    Task SaveChangesAsync();
}