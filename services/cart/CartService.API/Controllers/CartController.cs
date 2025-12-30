using CartService.Application.DTOs;
using CartService.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CartService.API.Controllers;

[ApiController]
[Route("cart")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly CartServiceManager _service;

    public CartController(CartServiceManager service)
    {
        _service = service;
    }

    private Guid UserId =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // Add item
    [HttpPost]
    public async Task<IActionResult> Add(AddToCartRequest request)
    {
        await _service.AddToCartAsync(UserId, request);
        return Ok();
    }

    // Get cart
    [HttpGet]
    public async Task<IActionResult> Get()
        => Ok(await _service.GetCartAsync(UserId));

    // Remove item
    [HttpDelete("{productId}")]
    public async Task<IActionResult> Remove(Guid productId)
    {
        await _service.RemoveFromCartAsync(UserId, productId);
        return Ok();
    }

    // Save for later
    [HttpPut("{productId}/save")]
    public async Task<IActionResult> SaveForLater(Guid productId)
    {
        await _service.SaveForLaterAsync(UserId, productId);
        return Ok();
    }

    // Move back to cart
    [HttpPut("{productId}/move")]
    public async Task<IActionResult> MoveToCart(Guid productId)
    {
        await _service.MoveToCartAsync(UserId, productId);
        return Ok();
    }

    // Update quantity
    [HttpPut("{productId}/quantity")]
    public async Task<IActionResult> UpdateQuantity(
        Guid productId,
        UpdateCartQuantityRequest request)
    {
        await _service.UpdateQuantityAsync(UserId, productId, request);
        return Ok();
    }
}
