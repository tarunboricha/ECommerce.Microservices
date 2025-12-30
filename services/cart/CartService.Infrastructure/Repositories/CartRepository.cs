using CartService.Application.Interfaces;
using CartService.Domain.Entities;
using CartService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CartService.Infrastructure.Repositories;

public class CartRepository : ICartRepository
{
    private readonly CartDbContext _context;

    public CartRepository(CartDbContext context)
    {
        _context = context;
    }

    public async Task<CartItem?> GetAsync(Guid userId, Guid productId)
        => await _context.CartItems
            .FirstOrDefaultAsync(x =>
                x.UserId == userId &&
                x.ProductId == productId);

    public async Task<IEnumerable<CartItem>> GetUserCartAsync(Guid userId)
        => await _context.CartItems
            .Where(x => x.UserId == userId)
            .ToListAsync();

    public async Task AddAsync(CartItem item)
        => await _context.CartItems.AddAsync(item);

    public async Task RemoveAsync(CartItem item)
    {
        _context.CartItems.Remove(item);
        await Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
        => await _context.SaveChangesAsync();
}
