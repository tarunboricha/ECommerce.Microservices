using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using ProductService.Domain.Entities;

namespace ProductService.Infrastructure.Persistence
{
    public class ProductDbContext : DbContext
    {
        public DbSet<Product> Products => Set<Product>();

        public ProductDbContext(DbContextOptions<ProductDbContext> options)
            : base(options) { }
    }
}
