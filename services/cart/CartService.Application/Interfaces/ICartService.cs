using CartService.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace CartService.Application.Interfaces
{
    public interface ICartService
    {
        Task AddToCartAsync(Guid userId, AddToCartRequest request);
        Task<IEnumerable<CartItemResponse>> GetCartAsync(Guid userId);
        Task RemoveFromCartAsync(Guid userId, Guid productId);
        Task SaveForLaterAsync(Guid userId, Guid productId);
        Task MoveToCartAsync(Guid userId, Guid productId);
        Task UpdateQuantityAsync(Guid userId, Guid productId, UpdateCartQuantityRequest request);
    }
}
