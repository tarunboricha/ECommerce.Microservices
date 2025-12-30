using System;
using System.Collections.Generic;
using System.Text;

namespace ProductService.Application.DTOs
{
    public record CreateProductRequest(
        string Name,
        decimal Price,
        string Type,
        string Color);
    public record ProductResponse(
        Guid Id,
        string Name,
        decimal Price,
        string Type,
        string Color,
        bool IsTrending);
    public record UpdateProductRequest(
        string Name,
        decimal Price,
        string Type,
        string Color,
        bool IsTrending
    );
    public class CursorPageResult<T>
    {
        public IEnumerable<T> Items { get; set; } = [];
        public string? NextCursor { get; set; }
        public bool HasMore { get; set; }
    }
    public class CursorQueryParameters
    {
        public string? Cursor { get; set; }
        public int Limit { get; set; } = 10;
        public string? Query { get; set; }
    }

    public class ProductFilterRequest
    {
        // 🔍 Search candidates (optional)
        public List<Guid>? ProductIds { get; set; }

        // 🎯 Filters
        public string? Type { get; set; }
        public string? Color { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public bool? IsTrending { get; set; }

        // 🔃 Sorting
        public string SortBy { get; set; } = "createdAt";
        public string SortOrder { get; set; } = "desc";

        // 🚀 Cursor pagination
        public string? Cursor { get; set; }
        public int Limit { get; set; } = 10;
    }
}
