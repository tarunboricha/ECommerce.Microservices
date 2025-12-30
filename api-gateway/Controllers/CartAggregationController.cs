using ApiGateway.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text.Json;

namespace ApiGateway.API.Controllers;

[ApiController]
[Route("cart/details")]
[Authorize]
public class CartAggregationController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;

    public CartAggregationController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet]
    public async Task<IActionResult> GetCartDetails()
    {
        var token = Request.Headers["Authorization"].ToString();

        // 1️⃣ Call Cart Service
        var cartClient = _httpClientFactory.CreateClient("cart");
        cartClient.DefaultRequestHeaders.Authorization =
            AuthenticationHeaderValue.Parse(token);

        var cartResponse = await cartClient.GetAsync("cart");
        cartResponse.EnsureSuccessStatusCode();

        var cartItems = JsonSerializer.Deserialize<List<CartItemDto>>(
            await cartResponse.Content.ReadAsStringAsync(),
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (cartItems == null || !cartItems.Any())
            return Ok(Array.Empty<CartDetailsResponse>());

        // 2️⃣ Extract productIds
        var productIds = cartItems.Select(c => c.ProductId).Distinct().ToList();

        // 3️⃣ Call Product Service (bulk)
        var productClient = _httpClientFactory.CreateClient("product");

        var productResponse = await productClient.PostAsJsonAsync(
            "/products/bulk",
            productIds);

        productResponse.EnsureSuccessStatusCode();

        var products = JsonSerializer.Deserialize<List<ProductDto>>(
            await productResponse.Content.ReadAsStringAsync(),
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        // 4️⃣ Merge
        var result =
            from cart in cartItems
            join product in products! on cart.ProductId equals product.Id
            select new CartDetailsResponse(
                product.Id,
                product.Name,
                product.Price,
                cart.Quantity,
                cart.SaveForLater
            );

        return Ok(result);
    }
}
