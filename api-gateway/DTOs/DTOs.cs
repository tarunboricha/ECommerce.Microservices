namespace ApiGateway.DTOs
{
    public record CartItemDto(
        Guid ProductId,
        int Quantity,
        bool SaveForLater
    );

    public record ProductDto(
        Guid Id,
        string Name,
        decimal Price
    );

    public record CartDetailsResponse(
        Guid ProductId,
        string Name,
        decimal Price,
        int Quantity,
        bool SaveForLater
    );
}
