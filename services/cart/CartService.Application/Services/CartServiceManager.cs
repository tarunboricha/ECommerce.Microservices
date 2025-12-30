using CartService.Application.DTOs;
using CartService.Application.Interfaces;
using CartService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace CartService.Application.Services
{
    public class CartServiceManager: ICartService
    {
        private readonly ICartRepository _repo;

        public CartServiceManager(ICartRepository repo)
        {
            _repo = repo;
        }

        // 1️⃣ Add item to cart
        public async Task AddToCartAsync(Guid userId, AddToCartRequest request)
        {
            var existing = await _repo.GetAsync(userId, request.ProductId);

            if (existing is null)
            {
                var item = new CartItem(userId, request.ProductId, request.Quantity);
                await _repo.AddAsync(item);
            }
            else
            {
                existing.UpdateQuantity(existing.Quantity + request.Quantity);
                existing.MoveToCart();
            }

            await _repo.SaveChangesAsync();
        }

        // 2️⃣ Remove item
        public async Task RemoveFromCartAsync(Guid userId, Guid productId)
        {
            var item = await _repo.GetAsync(userId, productId)
                ?? throw new Exception("Cart item not found");

            await _repo.RemoveAsync(item);
            await _repo.SaveChangesAsync();
        }

        // 3️⃣ Save for later
        public async Task SaveForLaterAsync(Guid userId, Guid productId)
        {
            var item = await _repo.GetAsync(userId, productId)
                ?? throw new Exception("Cart item not found");

            item.MoveToSaveLater();
            await _repo.SaveChangesAsync();
        }

        // 4️⃣ Move back to cart
        public async Task MoveToCartAsync(Guid userId, Guid productId)
        {
            var item = await _repo.GetAsync(userId, productId)
                ?? throw new Exception("Cart item not found");

            item.MoveToCart();
            await _repo.SaveChangesAsync();
        }

        // 5️⃣ Update quantity
        public async Task UpdateQuantityAsync(
            Guid userId,
            Guid productId,
            UpdateCartQuantityRequest request)
        {
            var item = await _repo.GetAsync(userId, productId)
                ?? throw new Exception("Cart item not found");

            item.UpdateQuantity(request.Quantity);
            await _repo.SaveChangesAsync();
        }

        // Get cart
        public async Task<IEnumerable<CartItemResponse>> GetCartAsync(Guid userId)
        {
            var items = await _repo.GetUserCartAsync(userId);

            return items.Select(i =>
                new CartItemResponse(i.ProductId, i.Quantity, i.SaveForLater));
        }
    }
}
