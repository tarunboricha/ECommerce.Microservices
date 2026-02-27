using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductService.Application.DTOs;
using ProductService.Application.Interfaces;

namespace ProductService.API.Controllers;

[ApiController]
[Route("products")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _service;

    public ProductsController(IProductService service)
    {
        _service = service;
    }

    // PUBLIC
    [HttpGet("trending")]
    public async Task<IActionResult> GetTrending()
        => Ok(await _service.GetTrendingAsync());

    // PUBLIC
    [HttpGet("type/{type}")]
    public async Task<IActionResult> GetByType(string type)
        => Ok(await _service.GetByTypeAsync(type));

    [HttpGet("cursor")]
    public async Task<IActionResult> GetCursorPaged(
        [FromQuery] CursorQueryParameters query)
    {
        return Ok(await _service.GetCursorPagedAsync(query));
    }

    [HttpPost("query")]
    public async Task<IActionResult> FilterProducts(
        [FromBody] ProductFilterRequest request)
    {
        return Ok(await _service.FilterAsync(request));
    }

    // ADMIN
    [Authorize(Roles = "ADMIN")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateProductRequest request)
    {
        await _service.CreateAsync(request);
        return Ok();
    }

    // ADMIN
    [Authorize(Roles = "ADMIN")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateProductRequest request)
    {
        await _service.UpdateAsync(id, request);
        return Ok();
    }

    // ADMIN
    [Authorize(Roles = "ADMIN")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(id);
        return Ok();
    }

    [HttpPost("bulk")]
    public async Task<IActionResult> GetByIds([FromBody] List<Guid> ids)
    {
        var products = await _service.GetByIdsAsync(ids);
        return Ok(products);
    }
}
