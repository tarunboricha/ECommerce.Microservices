namespace CartService.Domain.Entities;

public class CartItem
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public Guid ProductId { get; private set; }
    public int Quantity { get; private set; }
    public bool SaveForLater { get; private set; }

    private CartItem() { }

    public CartItem(Guid userId, Guid productId, int quantity)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        ProductId = productId;
        Quantity = quantity;
        SaveForLater = false;
    }

    public void UpdateQuantity(int quantity)
    {
        if (quantity <= 0)
            throw new InvalidOperationException("Quantity must be greater than zero");

        Quantity = quantity;
    }

    public void MoveToSaveLater()
        => SaveForLater = true;

    public void MoveToCart()
        => SaveForLater = false;
}
