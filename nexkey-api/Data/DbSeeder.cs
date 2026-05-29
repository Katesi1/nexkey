using Microsoft.EntityFrameworkCore;
using NexKey.Api.Models.Entities;
using NexKey.Api.Models.Enums;
using System.Text.Json;

namespace NexKey.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        await db.Database.MigrateAsync();

        if (!await db.Roles.AnyAsync())
        {
            var superAdminRole = new Role
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Super Admin",
                Description = "Toàn quyền hệ thống",
                Color = "#dc2626",
                Permissions = JsonSerializer.Serialize(new[] { "*" }),
                IsSystem = true,
                CreatedAt = DateTime.UtcNow
            };

            var adminRole = new Role
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Admin",
                Description = "Quản trị viên",
                Color = "#2563eb",
                Permissions = JsonSerializer.Serialize(new[] { "orders", "products", "customers", "keys" }),
                IsSystem = false,
                CreatedAt = DateTime.UtcNow
            };

            db.Roles.AddRange(superAdminRole, adminRole);

            db.Admins.Add(new Admin
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Super Admin",
                Email = "admin@nexkey.vn",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123456"),
                RoleId = superAdminRole.Id,
                Status = AdminStatus.HoatDong,
                CreatedAt = DateTime.UtcNow
            });
        }

        if (!await db.Settings.AnyAsync())
        {
            var settings = new[]
            {
                new Setting { Key = "shop_name", Value = "NexKey", Group = "general", UpdatedAt = DateTime.UtcNow },
                new Setting { Key = "shop_domain", Value = "nexkey.vn", Group = "general", UpdatedAt = DateTime.UtcNow },
                new Setting { Key = "shop_email", Value = "contact@nexkey.vn", Group = "general", UpdatedAt = DateTime.UtcNow },
                new Setting { Key = "maintenance_mode", Value = "false", Group = "general", UpdatedAt = DateTime.UtcNow },
                new Setting { Key = "auto_deliver_key", Value = "false", Group = "general", UpdatedAt = DateTime.UtcNow },
                new Setting { Key = "meta_title", Value = "NexKey - Cung cấp key bản quyền", Group = "seo", UpdatedAt = DateTime.UtcNow },
                new Setting { Key = "meta_description", Value = "Mua key Windows, Office, Antivirus giá rẻ chính hãng", Group = "seo", UpdatedAt = DateTime.UtcNow },
                new Setting { Key = "google_analytics_id", Value = "", Group = "seo", UpdatedAt = DateTime.UtcNow },
                new Setting { Key = "smtp_host", Value = "", Group = "email", UpdatedAt = DateTime.UtcNow },
                new Setting { Key = "smtp_port", Value = "587", Group = "email", UpdatedAt = DateTime.UtcNow },
                new Setting { Key = "smtp_username", Value = "", Group = "email", UpdatedAt = DateTime.UtcNow },
                new Setting { Key = "smtp_password", Value = "", Group = "email", UpdatedAt = DateTime.UtcNow },
                new Setting { Key = "primary_color", Value = "#0078d4", Group = "theme", UpdatedAt = DateTime.UtcNow },
                new Setting { Key = "accent_color", Value = "#00b4d8", Group = "theme", UpdatedAt = DateTime.UtcNow },
            };

            db.Settings.AddRange(settings);
        }

        if (!await db.PaymentGateways.AnyAsync())
        {
            db.PaymentGateways.AddRange(
                new PaymentGateway { Id = "vnpay", Name = "VNPay", Enabled = false, TestMode = true, UpdatedAt = DateTime.UtcNow },
                new PaymentGateway { Id = "momo", Name = "MoMo", Enabled = false, TestMode = true, UpdatedAt = DateTime.UtcNow },
                new PaymentGateway { Id = "banking", Name = "Banking", Enabled = true, TestMode = false, UpdatedAt = DateTime.UtcNow },
                new PaymentGateway { Id = "card", Name = "Card", Enabled = false, TestMode = true, UpdatedAt = DateTime.UtcNow }
            );
        }

        await db.SaveChangesAsync();
    }
}
