namespace ProductService.Domain.Entities;

public class Product
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = default!;
    public decimal Price { get; private set; }
    public string Type { get; private set; } = default!;
    public string Color { get; private set; } = default!;
    public bool IsTrending { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private Product() { }

    public Product(string name, decimal price, string type, string color)
    {
        Id = Guid.NewGuid();
        Name = name;
        Price = price;
        Type = type;
        Color = color;
        CreatedAt = DateTime.UtcNow;
        IsTrending = false;
    }

    public void Update(string name, decimal price, string type, string color)
    {
        Name = name;
        Price = price;
        Type = type;
        Color = color;
    }

    public void MarkTrending() => IsTrending = true;
    public void RemoveTrending() => IsTrending = false;
}