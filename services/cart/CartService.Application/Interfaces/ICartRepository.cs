using CartService.Domain.Entities;

namespace CartService.Application.Interfaces;

public interface ICartRepository
{
    Task<CartItem?> GetAsync(Guid userId, Guid productId);
    Task<IEnumerable<CartItem>> GetUserCartAsync(Guid userId);

    Task AddAsync(CartItem item);
    Task RemoveAsync(CartItem item);

    Task SaveChangesAsync();
}
