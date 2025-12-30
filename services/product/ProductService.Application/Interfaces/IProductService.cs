using ProductService.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProductService.Application.Interfaces
{
    public interface IProductService
    {
        Task CreateAsync(CreateProductRequest request);
        Task<IEnumerable<ProductResponse>> GetTrendingAsync();
        Task<IEnumerable<ProductResponse>> GetByTypeAsync(string type);
        Task UpdateAsync(Guid id, UpdateProductRequest request);
        Task<CursorPageResult<ProductResponse>> GetCursorPagedAsync(CursorQueryParameters query);
        Task<CursorPageResult<ProductResponse>> FilterAsync(ProductFilterRequest request);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<ProductResponse>> GetByIdsAsync(List<Guid> ids);
    }
}