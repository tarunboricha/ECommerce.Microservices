namespace AuthService.Domain.Entities;

public class User
{
    public Guid Id { get; private set; }
    public string Email { get; private set; } = default!;
    public string FirstName { get; private set; } = default!;
    public string LastName { get; private set; } = default!;

    public string PasswordHash { get; private set; } = default!;
    public string Role { get; private set; } = default!;
    public DateTime CreatedAt { get; private set; }

    private User() { } // EF Core

    public User(string email, string passwordHash, string firstName, string lastName)
    {
        Id = Guid.NewGuid();
        Email = email;
        FirstName = firstName;
        LastName = lastName;
        PasswordHash = passwordHash;
        CreatedAt = DateTime.UtcNow;
        Role = "USER";
    }
}
