using Microsoft.EntityFrameworkCore;
using ProductService.Application.DTOs;
using ProductService.Application.Interfaces;
using ProductService.Domain.Entities;
using ProductService.Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProductService.Infrastructure.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ProductDbContext _context;

        public ProductRepository(ProductDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Product product)
            => await _context.Products.AddAsync(product);

        public async Task<Product?> GetByIdAsync(Guid id)
            => await _context.Products.FindAsync(id);

        public async Task<IEnumerable<Product>> GetTrendingAsync()
            => await _context.Products
                .Where(p => p.IsTrending)
                .ToListAsync();

        public async Task<IEnumerable<Product>> GetByTypeAsync(string type)
            => await _context.Products
                .Where(p => p.Type.ToLower() == type.ToLower())
                .ToListAsync();

        public async Task<(IEnumerable<Product> Items, bool HasMore)>
        GetCursorPagedAsync(DateTime? cursorCreatedAt, Guid? cursorId, int limit)
        {
            IQueryable<Product> query = _context.Products;

            // Always apply deterministic ordering
            query = query
                .OrderByDescending(p => p.CreatedAt)
                .ThenByDescending(p => p.Id);

            // Apply cursor only if present
            if (cursorCreatedAt.HasValue && cursorId.HasValue)
            {
                query = query.Where(p =>
                    p.CreatedAt < cursorCreatedAt.Value ||
                    (p.CreatedAt == cursorCreatedAt.Value && p.Id < cursorId.Value)
                );
            }

            // Fetch one extra record to detect HasMore
            var items = await query
                .Take(limit + 1)
                .ToListAsync();

            var hasMore = items.Count > limit;

            if (hasMore)
            {
                items.RemoveAt(items.Count - 1);
            }

            return (items, hasMore);
        }

        public async Task<(IEnumerable<Product> Items, bool HasMore)>
        FilterWithCursorAsync(
            ProductFilterRequest request,
            DateTime? cursorCreatedAt,
            Guid? cursorId)
        {
            IQueryable<Product> query = _context.Products;

            // 1️⃣ Apply search candidate IDs
            if (request.ProductIds != null && request.ProductIds.Any())
            {
                query = query.Where(p => request.ProductIds.Contains(p.Id));
            }

            // 2️⃣ Filters
            if (!string.IsNullOrWhiteSpace(request.Type))
                query = query.Where(p => p.Type == request.Type);

            if (!string.IsNullOrWhiteSpace(request.Color))
                query = query.Where(p => p.Color == request.Color);

            if (request.MinPrice.HasValue)
                query = query.Where(p => p.Price >= request.MinPrice.Value);

            if (request.MaxPrice.HasValue)
                query = query.Where(p => p.Price <= request.MaxPrice.Value);

            if (request.IsTrending.HasValue)
                query = query.Where(p => p.IsTrending == request.IsTrending.Value);

            // 3️⃣ Sorting (only deterministic fields allowed)
            query = query
                .OrderByDescending(p => p.CreatedAt)
                .ThenByDescending(p => p.Id);

            // 4️⃣ Cursor condition
            if (cursorCreatedAt.HasValue && cursorId.HasValue)
            {
                query = query.Where(p =>
                    p.CreatedAt < cursorCreatedAt.Value ||
                    (p.CreatedAt == cursorCreatedAt.Value && p.Id < cursorId.Value)
                );
            }

            // 5️⃣ Fetch one extra row to detect HasMore
            var items = await query
                .Take(request.Limit + 1)
                .ToListAsync();

            var hasMore = items.Count > request.Limit;

            if (hasMore)
                items.RemoveAt(items.Count - 1);

            return (items, hasMore);
        }

        public async Task<IEnumerable<Product>> GetByIdsAsync(List<Guid> ids)
        {
            return await _context.Products
                .Where(p => ids.Contains(p.Id))
                .ToListAsync();
        }

        public async Task DeleteAsync(Product product)
        {
            _context.Products.Remove(product);
            await Task.CompletedTask;
        }

        public async Task SaveChangesAsync()
            => await _context.SaveChangesAsync();
    }
}
