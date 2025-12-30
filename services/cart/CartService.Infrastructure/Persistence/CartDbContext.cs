using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using CartService.Domain.Entities;

namespace CartService.Infrastructure.Persistence
{
    public class CartDbContext : DbContext
    {
        public DbSet<CartItem> CartItems => Set<CartItem>();

        public CartDbContext(DbContextOptions<CartDbContext> options)
            : base(options) { }
    }
}
