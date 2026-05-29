using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NexKey.Api.Models.Entities;
using NexKey.Api.Models.Enums;

namespace NexKey.Api.Data.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> b)
    {
        b.HasKey(e => e.Id);
        b.Property(e => e.Id).HasMaxLength(20);
        b.Property(e => e.CustomerId).HasMaxLength(36).IsRequired();
        b.Property(e => e.CustomerName).HasMaxLength(100).IsRequired();
        b.Property(e => e.CustomerEmail).HasMaxLength(150).IsRequired();
        b.Property(e => e.CustomerPhone).HasMaxLength(20).IsRequired();
        b.Property(e => e.PaymentMethod).HasConversion<string>().HasMaxLength(20);
        b.Property(e => e.Status).HasConversion<string>().HasMaxLength(20);
        b.Property(e => e.Note).HasColumnType("nvarchar(max)");
        b.HasMany(e => e.Items).WithOne(i => i.Order).HasForeignKey(i => i.OrderId);
        b.HasOne(e => e.Customer).WithMany(c => c.Orders).HasForeignKey(e => e.CustomerId).OnDelete(DeleteBehavior.Restrict);
    }
}

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> b)
    {
        b.HasKey(e => e.Id);
        b.Property(e => e.OrderId).HasMaxLength(20).IsRequired();
        b.Property(e => e.ProductId).HasMaxLength(36).IsRequired();
        b.Property(e => e.Name).HasMaxLength(200).IsRequired();
        b.Property(e => e.LicenseKey).HasMaxLength(100);
        b.HasOne(e => e.Product).WithMany(p => p.OrderItems).HasForeignKey(e => e.ProductId).OnDelete(DeleteBehavior.Restrict);
    }
}

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> b)
    {
        b.HasKey(e => e.Id);
        b.Property(e => e.Id).HasMaxLength(36);
        b.Property(e => e.Name).HasMaxLength(200).IsRequired();
        b.Property(e => e.Sku).HasMaxLength(50).IsRequired();
        b.HasIndex(e => e.Sku).IsUnique();
        b.Property(e => e.CategoryId).HasMaxLength(36).IsRequired();
        b.Property(e => e.CategoryName).HasMaxLength(100).IsRequired();
        b.Property(e => e.Type).HasConversion<string>().HasMaxLength(20);
        b.Property(e => e.Status).HasConversion<string>().HasMaxLength(20);
        b.Property(e => e.Image).HasMaxLength(500);
        b.Property(e => e.Description).HasColumnType("nvarchar(max)");
        b.HasOne(e => e.Category).WithMany(c => c.Products).HasForeignKey(e => e.CategoryId).OnDelete(DeleteBehavior.Restrict);
    }
}

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> b)
    {
        b.HasKey(e => e.Id);
        b.Property(e => e.Id).HasMaxLength(36);
        b.Property(e => e.Name).HasMaxLength(100).IsRequired();
        b.Property(e => e.Slug).HasMaxLength(100).IsRequired();
        b.HasIndex(e => e.Slug).IsUnique();
        b.Property(e => e.Icon).HasMaxLength(10).IsRequired();
        b.Property(e => e.Color).HasMaxLength(7).IsRequired();
        b.Property(e => e.Status).HasConversion<string>().HasMaxLength(20);
    }
}

public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> b)
    {
        b.HasKey(e => e.Id);
        b.Property(e => e.Id).HasMaxLength(36);
        b.Property(e => e.FullName).HasMaxLength(100).IsRequired();
        b.Property(e => e.Email).HasMaxLength(150).IsRequired();
        b.HasIndex(e => e.Email).IsUnique();
        b.Property(e => e.Phone).HasMaxLength(20);
        b.Property(e => e.Avatar).HasMaxLength(500);
        b.Property(e => e.Status).HasConversion<string>().HasMaxLength(20);
    }
}

public class SupplierConfiguration : IEntityTypeConfiguration<Supplier>
{
    public void Configure(EntityTypeBuilder<Supplier> b)
    {
        b.HasKey(e => e.Id);
        b.Property(e => e.Id).HasMaxLength(36);
        b.Property(e => e.CompanyName).HasMaxLength(200).IsRequired();
        b.Property(e => e.TaxCode).HasMaxLength(20).IsRequired();
        b.HasIndex(e => e.TaxCode).IsUnique();
        b.Property(e => e.ContactPerson).HasMaxLength(100).IsRequired();
        b.Property(e => e.Email).HasMaxLength(150).IsRequired();
        b.Property(e => e.Phone).HasMaxLength(20).IsRequired();
        b.Property(e => e.Status).HasConversion<string>().HasMaxLength(20);
    }
}

public class WarehouseItemConfiguration : IEntityTypeConfiguration<WarehouseItem>
{
    public void Configure(EntityTypeBuilder<WarehouseItem> b)
    {
        b.HasKey(e => e.Id);
        b.Property(e => e.Id).HasMaxLength(36);
        b.Property(e => e.ProductId).HasMaxLength(36).IsRequired();
        b.Property(e => e.ProductName).HasMaxLength(200).IsRequired();
        b.Property(e => e.Sku).HasMaxLength(50).IsRequired();
        b.Property(e => e.Warehouse).HasMaxLength(50).IsRequired();
        b.Property(e => e.Unit).HasMaxLength(20).IsRequired();
        b.Ignore(e => e.InventoryValue);
        b.Ignore(e => e.Status);
        b.HasOne(e => e.Product).WithMany(p => p.WarehouseItems).HasForeignKey(e => e.ProductId).OnDelete(DeleteBehavior.Restrict);
    }
}

public class LicenseKeyConfiguration : IEntityTypeConfiguration<LicenseKey>
{
    public void Configure(EntityTypeBuilder<LicenseKey> b)
    {
        b.HasKey(e => e.Id);
        b.Property(e => e.Id).HasMaxLength(36);
        b.Property(e => e.Key).HasMaxLength(100).IsRequired();
        b.HasIndex(e => e.Key).IsUnique();
        b.Property(e => e.ProductId).HasMaxLength(36).IsRequired();
        b.Property(e => e.ProductName).HasMaxLength(200).IsRequired();
        b.Property(e => e.CustomerId).HasMaxLength(36);
        b.Property(e => e.CustomerName).HasMaxLength(100);
        b.Property(e => e.OrderId).HasMaxLength(20);
        b.Property(e => e.Status).HasConversion<string>().HasMaxLength(20);
        b.HasOne(e => e.Product).WithMany(p => p.LicenseKeys).HasForeignKey(e => e.ProductId).OnDelete(DeleteBehavior.Restrict);
        b.HasOne(e => e.Customer).WithMany(c => c.LicenseKeys).HasForeignKey(e => e.CustomerId).OnDelete(DeleteBehavior.SetNull);
        b.HasOne(e => e.Order).WithMany().HasForeignKey(e => e.OrderId).OnDelete(DeleteBehavior.SetNull);
    }
}

public class BannerConfiguration : IEntityTypeConfiguration<Banner>
{
    public void Configure(EntityTypeBuilder<Banner> b)
    {
        b.HasKey(e => e.Id);
        b.Property(e => e.Id).HasMaxLength(36);
        b.Property(e => e.Title).HasMaxLength(200).IsRequired();
        b.Property(e => e.Image).HasMaxLength(500).IsRequired();
        b.Property(e => e.Link).HasMaxLength(500);
        b.Property(e => e.Position).HasConversion<string>().HasMaxLength(30);
        b.Property(e => e.Status).HasConversion<string>().HasMaxLength(10);
    }
}

public class ArticleConfiguration : IEntityTypeConfiguration<Article>
{
    public void Configure(EntityTypeBuilder<Article> b)
    {
        b.HasKey(e => e.Id);
        b.Property(e => e.Id).HasMaxLength(36);
        b.Property(e => e.Title).HasMaxLength(300).IsRequired();
        b.Property(e => e.Slug).HasMaxLength(300).IsRequired();
        b.HasIndex(e => e.Slug).IsUnique();
        b.Property(e => e.Excerpt).HasColumnType("nvarchar(max)").IsRequired();
        b.Property(e => e.Content).HasColumnType("nvarchar(max)");
        b.Property(e => e.Category).HasMaxLength(50).IsRequired();
        b.Property(e => e.Status).HasConversion<string>().HasMaxLength(20);
        b.Property(e => e.Author).HasMaxLength(100).IsRequired();
        b.Property(e => e.Thumbnail).HasMaxLength(500);
        b.Property(e => e.Tags).HasMaxLength(1000);
    }
}

public class StaticPageConfiguration : IEntityTypeConfiguration<StaticPage>
{
    public void Configure(EntityTypeBuilder<StaticPage> b)
    {
        b.HasKey(e => e.Id);
        b.Property(e => e.Id).HasMaxLength(36);
        b.Property(e => e.Title).HasMaxLength(200).IsRequired();
        b.Property(e => e.Slug).HasMaxLength(200).IsRequired();
        b.HasIndex(e => e.Slug).IsUnique();
        b.Property(e => e.Description).HasMaxLength(300).IsRequired();
        b.Property(e => e.Content).HasColumnType("nvarchar(max)");
        b.Property(e => e.Status).HasConversion<string>().HasMaxLength(10);
        b.Ignore(e => e.WordCount);
    }
}

public class FaqConfiguration : IEntityTypeConfiguration<Faq>
{
    public void Configure(EntityTypeBuilder<Faq> b)
    {
        b.HasKey(e => e.Id);
        b.Property(e => e.Id).HasMaxLength(36);
        b.Property(e => e.Question).HasMaxLength(500).IsRequired();
        b.Property(e => e.Answer).HasColumnType("nvarchar(max)").IsRequired();
        b.Property(e => e.Category).HasMaxLength(50).IsRequired();
        b.Property(e => e.Status).HasConversion<string>().HasMaxLength(10);
    }
}

public class ActivityLogConfiguration : IEntityTypeConfiguration<ActivityLog>
{
    public void Configure(EntityTypeBuilder<ActivityLog> b)
    {
        b.HasKey(e => e.Id);
        b.Property(e => e.Id).HasMaxLength(36);
        b.Property(e => e.Type).HasConversion<string>().HasMaxLength(20);
        b.Property(e => e.Title).HasMaxLength(200).IsRequired();
        b.Property(e => e.Description).HasMaxLength(500).IsRequired();
        b.Property(e => e.AdminId).HasMaxLength(36);
        b.Property(e => e.Meta).HasColumnType("nvarchar(max)");
        b.HasOne(e => e.Admin).WithMany(a => a.ActivityLogs).HasForeignKey(e => e.AdminId).OnDelete(DeleteBehavior.SetNull);
    }
}

public class AdminConfiguration : IEntityTypeConfiguration<Admin>
{
    public void Configure(EntityTypeBuilder<Admin> b)
    {
        b.HasKey(e => e.Id);
        b.Property(e => e.Id).HasMaxLength(36);
        b.Property(e => e.Name).HasMaxLength(100).IsRequired();
        b.Property(e => e.Email).HasMaxLength(150).IsRequired();
        b.HasIndex(e => e.Email).IsUnique();
        b.Property(e => e.PasswordHash).HasMaxLength(255).IsRequired();
        b.Property(e => e.RoleId).HasMaxLength(36).IsRequired();
        b.Property(e => e.Status).HasConversion<string>().HasMaxLength(20);
        b.HasOne(e => e.Role).WithMany(r => r.Admins).HasForeignKey(e => e.RoleId).OnDelete(DeleteBehavior.Restrict);
    }
}

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> b)
    {
        b.HasKey(e => e.Id);
        b.Property(e => e.Id).HasMaxLength(36);
        b.Property(e => e.Name).HasMaxLength(50).IsRequired();
        b.HasIndex(e => e.Name).IsUnique();
        b.Property(e => e.Description).HasMaxLength(200);
        b.Property(e => e.Color).HasMaxLength(7).IsRequired();
        b.Property(e => e.Permissions).HasColumnType("nvarchar(max)").IsRequired();
    }
}

public class SettingConfiguration : IEntityTypeConfiguration<Setting>
{
    public void Configure(EntityTypeBuilder<Setting> b)
    {
        b.HasKey(e => e.Key);
        b.Property(e => e.Key).HasMaxLength(100);
        b.Property(e => e.Value).HasColumnType("nvarchar(max)").IsRequired();
        b.Property(e => e.Group).HasMaxLength(50).IsRequired();
    }
}

public class PaymentGatewayConfiguration : IEntityTypeConfiguration<PaymentGateway>
{
    public void Configure(EntityTypeBuilder<PaymentGateway> b)
    {
        b.HasKey(e => e.Id);
        b.Property(e => e.Id).HasMaxLength(20);
        b.Property(e => e.Name).HasMaxLength(50).IsRequired();
        b.Property(e => e.MerchantId).HasMaxLength(200);
        b.Property(e => e.SecretKey).HasMaxLength(500);
        b.Property(e => e.WebhookUrl).HasMaxLength(500);
    }
}
