using Microsoft.EntityFrameworkCore;
using NexKey.Api.Models.Entities;

namespace NexKey.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Supplier> Suppliers => Set<Supplier>();
    public DbSet<WarehouseItem> WarehouseItems => Set<WarehouseItem>();
    public DbSet<LicenseKey> LicenseKeys => Set<LicenseKey>();
    public DbSet<Banner> Banners => Set<Banner>();
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<StaticPage> StaticPages => Set<StaticPage>();
    public DbSet<Faq> Faqs => Set<Faq>();
    public DbSet<ActivityLog> ActivityLogs => Set<ActivityLog>();
    public DbSet<Admin> Admins => Set<Admin>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Setting> Settings => Set<Setting>();
    public DbSet<PaymentGateway> PaymentGateways => Set<PaymentGateway>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
