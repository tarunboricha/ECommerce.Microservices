using System;
using System.Collections.Generic;
using System.Text;

namespace CartService.Application.DTOs
{
    public record AddToCartRequest(Guid ProductId, int Quantity);
    public record UpdateCartQuantityRequest(
        int Quantity
    );
    public record CartItemResponse(
        Guid ProductId,
        int Quantity,
        bool SaveForLater
    );
}
