using ProductService.Application.DTOs;
using ProductService.Application.Interfaces;
using ProductService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProductService.Application.Services
{
    public class ProductServiceManager: IProductService
    {
        private readonly IProductRepository _repo;

        public ProductServiceManager(IProductRepository repo)
        {
            _repo = repo;
        }

        public async Task CreateAsync(CreateProductRequest request)
        {
            var product = new Product(
                request.Name,
                request.Price,
                request.Type,
                request.Color
            );

            await _repo.AddAsync(product);
            await _repo.SaveChangesAsync();
        }

        public async Task<IEnumerable<ProductResponse>> GetTrendingAsync()
        => (await _repo.GetTrendingAsync()).Select(Map);

        public async Task<IEnumerable<ProductResponse>> GetByTypeAsync(string type)
            => (await _repo.GetByTypeAsync(type)).Select(Map);

        public async Task UpdateAsync(Guid id, UpdateProductRequest request)
        {
            var product = await _repo.GetByIdAsync(id)
                ?? throw new Exception("Product not found");

            product.Update(
                request.Name,
                request.Price,
                request.Type,
                request.Color
            );

            if (request.IsTrending)
                product.MarkTrending();
            else
                product.RemoveTrending();

            await _repo.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var product = await _repo.GetByIdAsync(id)
                ?? throw new Exception("Product not found");

            await _repo.DeleteAsync(product);
            await _repo.SaveChangesAsync();
        }

        public async Task<CursorPageResult<ProductResponse>> GetCursorPagedAsync(
        CursorQueryParameters query)
        {
            DecodeCursor(query.Cursor, out var createdAt, out var id);

            var (items, hasMore) =
                await _repo.GetCursorPagedAsync(createdAt, id, query.Limit);

            var productResponses = items.Select(Map).ToList();

            string? nextCursor = null;
            if (hasMore && items.Any())
            {
                var last = items.Last();
                nextCursor = EncodeCursor(last.CreatedAt, last.Id);
            }

            return new CursorPageResult<ProductResponse>
            {
                Items = productResponses,
                HasMore = hasMore,
                NextCursor = nextCursor
            };
        }

        public async Task<CursorPageResult<ProductResponse>> FilterAsync(
        ProductFilterRequest request)
        {
            DecodeCursor(request.Cursor, out var createdAt, out var id);

            var (items, hasMore) =
                await _repo.FilterWithCursorAsync(request, createdAt, id);

            var resultItems = items.Select(Map).ToList();

            string? nextCursor = null;
            if (hasMore && items.Any())
            {
                var last = items.Last();
                nextCursor = EncodeCursor(last.CreatedAt, last.Id);
            }

            return new CursorPageResult<ProductResponse>
            {
                Items = resultItems,
                HasMore = hasMore,
                NextCursor = nextCursor
            };
        }

        private static string EncodeCursor(DateTime createdAt, Guid id)
        {
            var raw = $"{createdAt:o}|{id}";
            return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(raw));
        }

        private static void DecodeCursor(
            string? cursor,
            out DateTime? createdAt,
            out Guid? id)
        {
            createdAt = null;
            id = null;

            if (string.IsNullOrWhiteSpace(cursor))
                return;

            var decoded = System.Text.Encoding.UTF8.GetString(
                Convert.FromBase64String(cursor));

            var parts = decoded.Split('|');

            createdAt = DateTime.Parse(parts[0]);
            id = Guid.Parse(parts[1]);
        }

        public async Task<IEnumerable<ProductResponse>> GetByIdsAsync(List<Guid> ids)
        {
            var products = await _repo.GetByIdsAsync(ids);
            return products.Select(Map);
        }


        private static ProductResponse Map(Product p)
            => new(
                p.Id,
                p.Name,
                p.Price,
                p.Type,
                p.Color,
                p.IsTrending
            );
    }
}
