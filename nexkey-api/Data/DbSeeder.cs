using Microsoft.EntityFrameworkCore;
using NexKey.Api.Models.Entities;
using NexKey.Api.Models.Enums;
using System.Text.Json;

namespace NexKey.Api.Data;

public static class DbSeeder
{
    // ── Key strings dùng trong cả LicenseKeys lẫn Orders ──────────────
    private const string UsedKey1  = "KEY-WIN11P-A1B2-C3D4-E5F6";
    private const string UsedKey2  = "KEY-O21PR-A1B2-C3D4-E5F6-G7";
    private const string UsedKey3  = "NFLX-ACC-001@nexkey-pool.com:Pass123!";
    private const string UsedKey4  = "KEY-WIN11P-G7H8-I9J0-K1L2";
    private const string UsedKey5  = "XXXXX-M365F-ABCD-EFGH-00001";
    private const string UsedKey6  = "SPOT-GIFT-ABCD-1234-WXYZ";
    private const string UsedKey7  = "YT-GIFT-ABCD-EFGH-1234-5678";
    private const string UsedKey8  = "KEY-O21PR-H8I9-J0K1-L2M3-N4";
    private const string UsedKey9  = "KEY-WIN10P-A1B2-C3D4-E5F6";
    private const string UsedKey10 = "NFLX-ACC-002@nexkey-pool.com:Pass456!";
    private const string UsedKey11 = "KEY-WIN11P-M3N4-O5P6-Q7R8";
    private const string UsedKey12 = "XXXXX-M365F-IJKL-MNOP-00002";

    public static async Task SeedAsync(AppDbContext db)
    {
        await db.Database.MigrateAsync();

        // ─── Roles & Admins ───────────────────────────────────────────────
        const string superRoleId  = "role-super-admin-0001";
        const string adminRoleId  = "role-admin-0000001";
        const string editorRoleId = "role-editor-000001";

        if (!await db.Roles.AnyAsync())
        {
            db.Roles.AddRange(
                new Role { Id = superRoleId,  Name = "Super Admin", Description = "Toàn quyền hệ thống",        Color = "#dc2626", Permissions = JsonSerializer.Serialize(new[] { "*" }),                                                                   IsSystem = true,  CreatedAt = D(-60) },
                new Role { Id = adminRoleId,  Name = "Admin",       Description = "Quản trị viên cửa hàng",     Color = "#2563eb", Permissions = JsonSerializer.Serialize(new[] { "orders", "products", "customers", "keys", "warehouse" }),                IsSystem = false, CreatedAt = D(-50) },
                new Role { Id = editorRoleId, Name = "Editor",      Description = "Quản lý nội dung",            Color = "#16a34a", Permissions = JsonSerializer.Serialize(new[] { "articles", "pages", "faq", "banners" }),                                IsSystem = false, CreatedAt = D(-45) }
            );
            db.Admins.AddRange(
                new Admin { Id = "admin-super-000001",  Name = "Super Admin",    Email = "admin@nexkey.vn",  PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123456"), RoleId = superRoleId,  Status = AdminStatus.HoatDong, LastLogin = D(-1),  CreatedAt = D(-60) },
                new Admin { Id = "admin-trungnv-00001", Name = "Trung Nguyễn",   Email = "trung@nexkey.vn",  PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123456"), RoleId = adminRoleId,  Status = AdminStatus.HoatDong, LastLogin = D(-2),  CreatedAt = D(-30) },
                new Admin { Id = "admin-linhnt-000001", Name = "Linh Nguyễn",    Email = "linh@nexkey.vn",   PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123456"), RoleId = editorRoleId, Status = AdminStatus.HoatDong, LastLogin = D(-3),  CreatedAt = D(-20) }
            );
        }

        // ─── Settings ─────────────────────────────────────────────────────
        if (!await db.Settings.AnyAsync())
        {
            db.Settings.AddRange(
                new Setting { Key = "shop_name",           Value = "NexKey",                                                    Group = "general", UpdatedAt = D(-60) },
                new Setting { Key = "shop_domain",         Value = "nexkey.vn",                                                 Group = "general", UpdatedAt = D(-60) },
                new Setting { Key = "shop_email",          Value = "contact@nexkey.vn",                                         Group = "general", UpdatedAt = D(-60) },
                new Setting { Key = "maintenance_mode",    Value = "false",                                                     Group = "general", UpdatedAt = D(-60) },
                new Setting { Key = "auto_deliver_key",    Value = "false",                                                     Group = "general", UpdatedAt = D(-60) },
                new Setting { Key = "meta_title",          Value = "NexKey - Cung cấp key bản quyền giá rẻ",                    Group = "seo",     UpdatedAt = D(-60) },
                new Setting { Key = "meta_description",    Value = "Mua key Windows, Office, Antivirus chính hãng tại NexKey.", Group = "seo",     UpdatedAt = D(-60) },
                new Setting { Key = "google_analytics_id", Value = "",                                                           Group = "seo",     UpdatedAt = D(-60) },
                new Setting { Key = "smtp_host",           Value = "",                                                           Group = "email",   UpdatedAt = D(-60) },
                new Setting { Key = "smtp_port",           Value = "587",                                                        Group = "email",   UpdatedAt = D(-60) },
                new Setting { Key = "smtp_username",       Value = "",                                                           Group = "email",   UpdatedAt = D(-60) },
                new Setting { Key = "smtp_password",       Value = "",                                                           Group = "email",   UpdatedAt = D(-60) },
                new Setting { Key = "primary_color",       Value = "#0078d4",                                                    Group = "theme",   UpdatedAt = D(-60) },
                new Setting { Key = "accent_color",        Value = "#00b4d8",                                                    Group = "theme",   UpdatedAt = D(-60) }
            );
        }

        // ─── Payment Gateways ─────────────────────────────────────────────
        if (!await db.PaymentGateways.AnyAsync())
        {
            db.PaymentGateways.AddRange(
                new PaymentGateway { Id = "vnpay",   Name = "VNPay",   Enabled = true,  TestMode = false, MerchantId = "NEXKEY01",  SecretKey = "vnpay-secret-demo", UpdatedAt = D(-30) },
                new PaymentGateway { Id = "momo",    Name = "MoMo",    Enabled = true,  TestMode = false, MerchantId = "MOMO_NEX",  SecretKey = "momo-secret-demo",  UpdatedAt = D(-30) },
                new PaymentGateway { Id = "banking", Name = "Banking", Enabled = true,  TestMode = false,                                                             UpdatedAt = D(-60) },
                new PaymentGateway { Id = "card",    Name = "Card",    Enabled = false, TestMode = true,                                                              UpdatedAt = D(-60) }
            );
        }

        // ─── Categories ───────────────────────────────────────────────────
        const string catWindowsId   = "cat-windows-000001";
        const string catOfficeId    = "cat-office-0000001";
        const string catSubId       = "cat-subscription-01";
        const string catAntivirusId = "cat-antivirus-00001";
        const string catAccountId   = "cat-account-000001";

        if (!await db.Categories.AnyAsync())
        {
            db.Categories.AddRange(
                new Category { Id = catWindowsId,   Name = "Windows",      Slug = "windows",      Icon = "🪟", Color = "#0078d4", Status = CategoryStatus.HienThi, CreatedAt = D(-60), UpdatedAt = D(-60) },
                new Category { Id = catOfficeId,    Name = "Office",       Slug = "office",       Icon = "📝", Color = "#d13438", Status = CategoryStatus.HienThi, CreatedAt = D(-60), UpdatedAt = D(-60) },
                new Category { Id = catSubId,       Name = "Subscription", Slug = "subscription", Icon = "🔄", Color = "#107c10", Status = CategoryStatus.HienThi, CreatedAt = D(-60), UpdatedAt = D(-60) },
                new Category { Id = catAntivirusId, Name = "Antivirus",    Slug = "antivirus",    Icon = "🛡️", Color = "#ea3680", Status = CategoryStatus.HienThi, CreatedAt = D(-60), UpdatedAt = D(-60) },
                new Category { Id = catAccountId,   Name = "Account",      Slug = "account",      Icon = "👤", Color = "#8764b8", Status = CategoryStatus.HienThi, CreatedAt = D(-55), UpdatedAt = D(-55) }
            );
        }

        // ─── Suppliers ────────────────────────────────────────────────────
        if (!await db.Suppliers.AnyAsync())
        {
            db.Suppliers.AddRange(
                new Supplier { Id = "sup-techsupply-0001", CompanyName = "Công ty TNHH Tech Supply VN", TaxCode = "0123456789", ContactPerson = "Nguyễn Văn Hùng", Email = "hung@techsupply.vn",  Phone = "0281234567", Debt = 0,       Status = SupplierStatus.DangHopTac, CreatedAt = D(-90), UpdatedAt = D(-10) },
                new Supplier { Id = "sup-mspartner-0001",  CompanyName = "Microsoft Partner Vietnam",   TaxCode = "0987654321", ContactPerson = "Trần Thị Bình",   Email = "binh@mspartner.vn",   Phone = "0243334444", Debt = 5000000, Status = SupplierStatus.DangHopTac, CreatedAt = D(-80), UpdatedAt = D(-5)  },
                new Supplier { Id = "sup-digitalsoft-001", CompanyName = "Digital Soft JSC",            TaxCode = "0112233445", ContactPerson = "Lê Minh Khoa",    Email = "khoa@digitalsoft.vn", Phone = "0909123456", Debt = 0,       Status = SupplierStatus.ChoDuyet,   CreatedAt = D(-20), UpdatedAt = D(-20) }
            );
        }

        // ─── Products ─────────────────────────────────────────────────────
        const string pWin11Pro    = "prod-win11pro-00001";
        const string pWin10Pro    = "prod-win10pro-00001";
        const string pWin11Home   = "prod-win11home-0001";
        const string pOff2021Pro  = "prod-off2021pro-001";
        const string pOff2021Home = "prod-off2021hom-001";
        const string pM365Family  = "prod-m365family-001";
        const string pNetflix     = "prod-netflix-000001";
        const string pSpotify     = "prod-spotify-000001";
        const string pYoutube     = "prod-youtube-000001";
        const string pEset        = "prod-eset-00000001";
        const string pKaspersky   = "prod-kaspersky-0001";
        const string pGoogleOne   = "prod-googleone-0001";

        if (!await db.Products.AnyAsync())
        {
            db.Products.AddRange(
                new Product { Id = pWin11Pro,    Name = "Windows 11 Pro",                  Sku = "WIN11-PRO",    CategoryId = catWindowsId,   CategoryName = "Windows",      Type = ProductType.WindowsKey,   Price = 450000,  ComparePrice = 750000,  Stock = 48,  Sold = 156, Status = ProductStatus.DangBan, Description = "Bản quyền Windows 11 Pro vĩnh viễn, hỗ trợ 1 máy tính. Kích hoạt online tức thì.",                         CreatedAt = D(-60), UpdatedAt = D(-2) },
                new Product { Id = pWin10Pro,    Name = "Windows 10 Pro",                  Sku = "WIN10-PRO",    CategoryId = catWindowsId,   CategoryName = "Windows",      Type = ProductType.WindowsKey,   Price = 350000,  ComparePrice = 600000,  Stock = 35,  Sold = 89,  Status = ProductStatus.DangBan, Description = "Bản quyền Windows 10 Pro vĩnh viễn. Tặng kèm hướng dẫn kích hoạt.",                                          CreatedAt = D(-60), UpdatedAt = D(-5) },
                new Product { Id = pWin11Home,   Name = "Windows 11 Home",                 Sku = "WIN11-HOME",   CategoryId = catWindowsId,   CategoryName = "Windows",      Type = ProductType.WindowsKey,   Price = 350000,  ComparePrice = 600000,  Stock = 22,  Sold = 64,  Status = ProductStatus.DangBan, Description = "Windows 11 Home bản quyền cho máy tính cá nhân.",                                                            CreatedAt = D(-55), UpdatedAt = D(-10) },
                new Product { Id = pOff2021Pro,  Name = "Office 2021 Professional",        Sku = "OFF2021-PRO",  CategoryId = catOfficeId,    CategoryName = "Office",       Type = ProductType.OfficeKey,    Price = 580000,  ComparePrice = 950000,  Stock = 30,  Sold = 112, Status = ProductStatus.DangBan, Description = "Microsoft Office 2021 Professional gồm Word, Excel, PowerPoint, Outlook, Publisher, Access.",                  CreatedAt = D(-60), UpdatedAt = D(-3) },
                new Product { Id = pOff2021Home, Name = "Office 2021 Home & Business",    Sku = "OFF2021-HOME", CategoryId = catOfficeId,    CategoryName = "Office",       Type = ProductType.OfficeKey,    Price = 380000,  ComparePrice = 650000,  Stock = 18,  Sold = 47,  Status = ProductStatus.DangBan, Description = "Office 2021 Home & Business cho cá nhân và doanh nghiệp nhỏ.",                                               CreatedAt = D(-55), UpdatedAt = D(-8) },
                new Product { Id = pM365Family,  Name = "Microsoft 365 Family",            Sku = "M365-FAMILY",  CategoryId = catOfficeId,    CategoryName = "Office",       Type = ProductType.Subscription, Price = 850000,  ComparePrice = 1299000, Stock = 25,  Sold = 78,  Status = ProductStatus.DangBan, Description = "Microsoft 365 Family 1 năm cho tối đa 6 người dùng, 1TB OneDrive/người.",                                      CreatedAt = D(-50), UpdatedAt = D(-4) },
                new Product { Id = pNetflix,     Name = "Netflix Premium 1 Tháng",         Sku = "NETFLIX-1M",   CategoryId = catAccountId,   CategoryName = "Account",      Type = ProductType.Account,      Price = 120000,  ComparePrice = 260000,  Stock = 60,  Sold = 234, Status = ProductStatus.DangBan, Description = "Tài khoản Netflix Premium 4K Ultra HD, 4 màn hình cùng lúc, thời hạn 1 tháng.",                               CreatedAt = D(-45), UpdatedAt = D(-1) },
                new Product { Id = pSpotify,     Name = "Spotify Premium 1 Tháng",         Sku = "SPOTIFY-1M",   CategoryId = catSubId,       CategoryName = "Subscription", Type = ProductType.Subscription, Price = 75000,   ComparePrice = 159000,  Stock = 80,  Sold = 189, Status = ProductStatus.DangBan, Description = "Nghe nhạc không giới hạn, không quảng cáo, tải nhạc offline.",                                               CreatedAt = D(-45), UpdatedAt = D(-2) },
                new Product { Id = pYoutube,     Name = "YouTube Premium 1 Tháng",         Sku = "YT-PREM-1M",   CategoryId = catSubId,       CategoryName = "Subscription", Type = ProductType.Subscription, Price = 60000,   ComparePrice = 139000,  Stock = 90,  Sold = 201, Status = ProductStatus.DangBan, Description = "Xem video không quảng cáo, YouTube Music Premium, tải video xem offline.",                                    CreatedAt = D(-40), UpdatedAt = D(-1) },
                new Product { Id = pEset,        Name = "ESET Internet Security 1 Năm",    Sku = "ESET-IS-1Y",   CategoryId = catAntivirusId, CategoryName = "Antivirus",    Type = ProductType.Antivirus,    Price = 350000,  ComparePrice = 590000,  Stock = 15,  Sold = 56,  Status = ProductStatus.DangBan, Description = "Bảo vệ toàn diện cho 1 máy tính Windows/Mac, thời hạn 1 năm.",                                              CreatedAt = D(-55), UpdatedAt = D(-7) },
                new Product { Id = pKaspersky,   Name = "Kaspersky Total Security 1 Năm", Sku = "KAS-TOTAL-1Y", CategoryId = catAntivirusId, CategoryName = "Antivirus",    Type = ProductType.Antivirus,    Price = 420000,  ComparePrice = 699000,  Stock = 12,  Sold = 41,  Status = ProductStatus.DangBan, Description = "Kaspersky Total Security bảo vệ PC, Mac, Android và iOS.",                                                   CreatedAt = D(-50), UpdatedAt = D(-9) },
                new Product { Id = pGoogleOne,   Name = "Google One 100GB 1 Năm",          Sku = "GOOG-ONE-100", CategoryId = catAccountId,   CategoryName = "Account",      Type = ProductType.Account,      Price = 45000,   ComparePrice = 89000,   Stock = 100, Sold = 143, Status = ProductStatus.DangBan, Description = "Google One 100GB dung lượng cho Google Drive, Gmail, Photos.",                                               CreatedAt = D(-40), UpdatedAt = D(-3) }
            );
        }

        // ─── Warehouse ────────────────────────────────────────────────────
        if (!await db.WarehouseItems.AnyAsync())
        {
            db.WarehouseItems.AddRange(
                new WarehouseItem { Id = G(), ProductId = pWin11Pro,    ProductName = "Windows 11 Pro",                  Sku = "WIN11-PRO",    Warehouse = "Kho chính",     Quantity = 48,  Unit = "Key",       CostPrice = 280000, UpdatedAt = D(-2) },
                new WarehouseItem { Id = G(), ProductId = pWin10Pro,    ProductName = "Windows 10 Pro",                  Sku = "WIN10-PRO",    Warehouse = "Kho chính",     Quantity = 35,  Unit = "Key",       CostPrice = 210000, UpdatedAt = D(-5) },
                new WarehouseItem { Id = G(), ProductId = pWin11Home,   ProductName = "Windows 11 Home",                 Sku = "WIN11-HOME",   Warehouse = "Kho chính",     Quantity = 22,  Unit = "Key",       CostPrice = 200000, UpdatedAt = D(-10) },
                new WarehouseItem { Id = G(), ProductId = pOff2021Pro,  ProductName = "Office 2021 Professional",        Sku = "OFF2021-PRO",  Warehouse = "Kho chính",     Quantity = 30,  Unit = "Key",       CostPrice = 350000, UpdatedAt = D(-3) },
                new WarehouseItem { Id = G(), ProductId = pOff2021Home, ProductName = "Office 2021 Home & Business",    Sku = "OFF2021-HOME", Warehouse = "Kho chính",     Quantity = 18,  Unit = "Key",       CostPrice = 220000, UpdatedAt = D(-8) },
                new WarehouseItem { Id = G(), ProductId = pM365Family,  ProductName = "Microsoft 365 Family",            Sku = "M365-FAMILY",  Warehouse = "Kho chính",     Quantity = 25,  Unit = "Key",       CostPrice = 500000, UpdatedAt = D(-4) },
                new WarehouseItem { Id = G(), ProductId = pNetflix,     ProductName = "Netflix Premium 1 Tháng",         Sku = "NETFLIX-1M",   Warehouse = "Kho chi nhánh", Quantity = 60,  Unit = "Tài khoản", CostPrice = 70000,  UpdatedAt = D(-1) },
                new WarehouseItem { Id = G(), ProductId = pSpotify,     ProductName = "Spotify Premium 1 Tháng",         Sku = "SPOTIFY-1M",   Warehouse = "Kho chi nhánh", Quantity = 80,  Unit = "Tài khoản", CostPrice = 45000,  UpdatedAt = D(-2) },
                new WarehouseItem { Id = G(), ProductId = pYoutube,     ProductName = "YouTube Premium 1 Tháng",         Sku = "YT-PREM-1M",   Warehouse = "Kho chi nhánh", Quantity = 90,  Unit = "Tài khoản", CostPrice = 35000,  UpdatedAt = D(-1) },
                new WarehouseItem { Id = G(), ProductId = pEset,        ProductName = "ESET Internet Security 1 Năm",    Sku = "ESET-IS-1Y",   Warehouse = "Kho chính",     Quantity = 15,  Unit = "Key",       CostPrice = 200000, UpdatedAt = D(-7) },
                new WarehouseItem { Id = G(), ProductId = pKaspersky,   ProductName = "Kaspersky Total Security 1 Năm", Sku = "KAS-TOTAL-1Y", Warehouse = "Kho chính",     Quantity = 12,  Unit = "Key",       CostPrice = 260000, UpdatedAt = D(-9) },
                new WarehouseItem { Id = G(), ProductId = pGoogleOne,   ProductName = "Google One 100GB 1 Năm",          Sku = "GOOG-ONE-100", Warehouse = "Kho chi nhánh", Quantity = 100, Unit = "Tài khoản", CostPrice = 25000,  UpdatedAt = D(-3) }
            );
        }

        await db.SaveChangesAsync();

        // ─── Customers ────────────────────────────────────────────────────
        const string cust1  = "cust-nguyenvana-001";
        const string cust2  = "cust-tranthib-0001";
        const string cust3  = "cust-lehongphuc-01";
        const string cust4  = "cust-phamthilan-001";
        const string cust5  = "cust-vuducmanh-001";
        const string cust6  = "cust-ngothikieu-001";
        const string cust7  = "cust-buivankhang-01";
        const string cust8  = "cust-doanthikimai01";
        const string cust9  = "cust-luongvantung01";
        const string cust10 = "cust-hoangthimai-01";
        const string cust11 = "cust-nguyenminhtri1";
        const string cust12 = "cust-tranquanghuy01";

        if (!await db.Customers.AnyAsync())
        {
            db.Customers.AddRange(
                new Customer { Id = cust1,  FullName = "Nguyễn Văn An",    Email = "an.nguyen@gmail.com",     Phone = "0901234567", Status = CustomerStatus.VIP,      JoinedAt = D(-180), UpdatedAt = D(-1) },
                new Customer { Id = cust2,  FullName = "Trần Thị Bảo",     Email = "bao.tran@gmail.com",      Phone = "0912345678", Status = CustomerStatus.HoatDong, JoinedAt = D(-120), UpdatedAt = D(-3) },
                new Customer { Id = cust3,  FullName = "Lê Hồng Phúc",     Email = "phuc.le@yahoo.com",       Phone = "0923456789", Status = CustomerStatus.VIP,      JoinedAt = D(-200), UpdatedAt = D(-2) },
                new Customer { Id = cust4,  FullName = "Phạm Thị Lan",     Email = "lan.pham@gmail.com",      Phone = "0934567890", Status = CustomerStatus.HoatDong, JoinedAt = D(-90),  UpdatedAt = D(-5) },
                new Customer { Id = cust5,  FullName = "Vũ Đức Mạnh",      Email = "manh.vu@outlook.com",     Phone = "0945678901", Status = CustomerStatus.HoatDong, JoinedAt = D(-60),  UpdatedAt = D(-4) },
                new Customer { Id = cust6,  FullName = "Ngô Thị Kiều",     Email = "kieu.ngo@gmail.com",      Phone = "0956789012", Status = CustomerStatus.HoatDong, JoinedAt = D(-45),  UpdatedAt = D(-6) },
                new Customer { Id = cust7,  FullName = "Bùi Văn Khang",    Email = "khang.bui@gmail.com",     Phone = "0967890123", Status = CustomerStatus.HoatDong, JoinedAt = D(-30),  UpdatedAt = D(-2) },
                new Customer { Id = cust8,  FullName = "Đoàn Thị Kim Mai", Email = "mai.doan@gmail.com",      Phone = "0978901234", Status = CustomerStatus.HoatDong, JoinedAt = D(-25),  UpdatedAt = D(-7) },
                new Customer { Id = cust9,  FullName = "Lương Văn Tùng",   Email = "tung.luong@gmail.com",    Phone = "0989012345", Status = CustomerStatus.HoatDong, JoinedAt = D(-20),  UpdatedAt = D(-3) },
                new Customer { Id = cust10, FullName = "Hoàng Thị Mai",    Email = "mai.hoang@gmail.com",     Phone = "0990123456", Status = CustomerStatus.BiKhoa,   JoinedAt = D(-15),  UpdatedAt = D(-8) },
                new Customer { Id = cust11, FullName = "Nguyễn Minh Trí",  Email = "tri.nguyen@icloud.com",   Phone = "0901111222", Status = CustomerStatus.HoatDong, JoinedAt = D(-10),  UpdatedAt = D(-1) },
                new Customer { Id = cust12, FullName = "Trần Quang Huy",   Email = "huy.tran@gmail.com",      Phone = "0902222333", Status = CustomerStatus.HoatDong, JoinedAt = D(-7),   UpdatedAt = D(-1) }
            );
            await db.SaveChangesAsync();
        }

        // ─── License Keys ─────────────────────────────────────────────────
        if (!await db.LicenseKeys.AnyAsync())
        {
            static LicenseKey Key(string val, string pid, string pname,
                LicenseKeyStatus status = LicenseKeyStatus.ChuaKichHoat,
                string? custId = null, string? custName = null, string? ordId = null,
                DateTime? activatedAt = null, DateTime? expiresAt = null) => new()
            {
                Id = G(), Key = val, ProductId = pid, ProductName = pname, Status = status,
                CustomerId = custId, CustomerName = custName, OrderId = null, // set after orders seeded
                ActivatedAt = activatedAt, ExpiresAt = expiresAt, CreatedAt = D(-60)
            };

            db.LicenseKeys.AddRange(
                // Windows 11 Pro — 5 assigned, 3 free
                Key(UsedKey1,  pWin11Pro,    "Windows 11 Pro",                  LicenseKeyStatus.HoatDong,      cust1,  "Nguyễn Văn An",    "ORD-100001", D(-29), D(336)),
                Key(UsedKey4,  pWin11Pro,    "Windows 11 Pro",                  LicenseKeyStatus.HoatDong,      cust3,  "Lê Hồng Phúc",     "ORD-100003", D(-25), D(340)),
                Key(UsedKey11, pWin11Pro,    "Windows 11 Pro",                  LicenseKeyStatus.HoatDong,      cust8,  "Đoàn Thị Kim Mai", "ORD-100009", D(-13), D(352)),
                Key("KEY-WIN11P-S9T0-U1V2-W3X4", pWin11Pro, "Windows 11 Pro",  LicenseKeyStatus.DaHetHan,      expiresAt: D(-30)),
                Key("KEY-WIN11P-Y5Z6-A7B8-C9D0", pWin11Pro, "Windows 11 Pro",  LicenseKeyStatus.ChuaKichHoat),
                Key("KEY-WIN11P-FREE-0001",       pWin11Pro, "Windows 11 Pro",  LicenseKeyStatus.ChuaKichHoat),
                Key("KEY-WIN11P-FREE-0002",       pWin11Pro, "Windows 11 Pro",  LicenseKeyStatus.ChuaKichHoat),
                Key("KEY-WIN11P-FREE-0003",       pWin11Pro, "Windows 11 Pro",  LicenseKeyStatus.ChuaKichHoat),

                // Windows 10 Pro — 1 assigned, 3 free
                Key(UsedKey9,  pWin10Pro,    "Windows 10 Pro",                  LicenseKeyStatus.HoatDong,      cust6,  "Ngô Thị Kiều",     "ORD-100007", D(-17), D(348)),
                Key("KEY-WIN10P-G7H8-I9J0",      pWin10Pro, "Windows 10 Pro",  LicenseKeyStatus.ChuaKichHoat),
                Key("KEY-WIN10P-FREE-0001",       pWin10Pro, "Windows 10 Pro",  LicenseKeyStatus.ChuaKichHoat),
                Key("KEY-WIN10P-FREE-0002",       pWin10Pro, "Windows 10 Pro",  LicenseKeyStatus.ChuaKichHoat),

                // Windows 11 Home — 5 free
                Key("WIN11H-FREE-0001-XXXX-YYYY", pWin11Home,   "Windows 11 Home",                 LicenseKeyStatus.ChuaKichHoat),
                Key("WIN11H-FREE-0002-XXXX-YYYY", pWin11Home,   "Windows 11 Home",                 LicenseKeyStatus.ChuaKichHoat),
                Key("WIN11H-FREE-0003-XXXX-YYYY", pWin11Home,   "Windows 11 Home",                 LicenseKeyStatus.ChuaKichHoat),

                // Office 2021 Pro — 2 assigned, 2 free
                Key(UsedKey2,  pOff2021Pro,  "Office 2021 Professional",        LicenseKeyStatus.HoatDong,      cust1,  "Nguyễn Văn An",    "ORD-100001", D(-29)),
                Key(UsedKey8,  pOff2021Pro,  "Office 2021 Professional",        LicenseKeyStatus.HoatDong,      cust5,  "Vũ Đức Mạnh",      "ORD-100006", D(-19)),
                Key("KEY-O21PR-FREE-0001",        pOff2021Pro, "Office 2021 Professional",        LicenseKeyStatus.ChuaKichHoat),
                Key("KEY-O21PR-FREE-0002",        pOff2021Pro, "Office 2021 Professional",        LicenseKeyStatus.ChuaKichHoat),

                // Office 2021 Home — 4 free
                Key("OFF21H-FREE-0001",           pOff2021Home,"Office 2021 Home & Business",     LicenseKeyStatus.ChuaKichHoat),
                Key("OFF21H-FREE-0002",           pOff2021Home,"Office 2021 Home & Business",     LicenseKeyStatus.ChuaKichHoat),
                Key("OFF21H-FREE-0003",           pOff2021Home,"Office 2021 Home & Business",     LicenseKeyStatus.ChuaKichHoat),

                // Microsoft 365 — 2 assigned, 1 free
                Key(UsedKey5,  pM365Family,  "Microsoft 365 Family",            LicenseKeyStatus.HoatDong,      cust3,  "Lê Hồng Phúc",     "ORD-100004", D(-23), D(342)),
                Key(UsedKey12, pM365Family,  "Microsoft 365 Family",            LicenseKeyStatus.HoatDong,      cust9,  "Lương Văn Tùng",   "ORD-100010", D(-11), D(354)),
                Key("XXXXX-M365F-FREE-0001",      pM365Family, "Microsoft 365 Family",            LicenseKeyStatus.ChuaKichHoat),

                // Netflix — 2 assigned, 3 free
                Key(UsedKey3,  pNetflix,     "Netflix Premium 1 Tháng",         LicenseKeyStatus.HoatDong,      cust2,  "Trần Thị Bảo",     "ORD-100002", D(-27), D(3)),
                Key(UsedKey10, pNetflix,     "Netflix Premium 1 Tháng",         LicenseKeyStatus.HoatDong,      cust7,  "Bùi Văn Khang",    "ORD-100008", D(-15), D(15)),
                Key("NFLX-ACC-FREE-001",          pNetflix,    "Netflix Premium 1 Tháng",         LicenseKeyStatus.ChuaKichHoat),
                Key("NFLX-ACC-FREE-002",          pNetflix,    "Netflix Premium 1 Tháng",         LicenseKeyStatus.ChuaKichHoat),
                Key("NFLX-ACC-FREE-003",          pNetflix,    "Netflix Premium 1 Tháng",         LicenseKeyStatus.ChuaKichHoat),

                // Spotify — 1 assigned, 2 free
                Key(UsedKey6,  pSpotify,     "Spotify Premium 1 Tháng",         LicenseKeyStatus.HoatDong,      cust4,  "Phạm Thị Lan",     "ORD-100005", D(-21), D(9)),
                Key("SPOT-GIFT-FREE-0001",        pSpotify,    "Spotify Premium 1 Tháng",         LicenseKeyStatus.ChuaKichHoat),
                Key("SPOT-GIFT-FREE-0002",        pSpotify,    "Spotify Premium 1 Tháng",         LicenseKeyStatus.ChuaKichHoat),

                // YouTube — 1 assigned, 2 free
                Key(UsedKey7,  pYoutube,     "YouTube Premium 1 Tháng",         LicenseKeyStatus.HoatDong,      cust4,  "Phạm Thị Lan",     "ORD-100005", D(-21), D(9)),
                Key("YT-GIFT-FREE-0001",          pYoutube,    "YouTube Premium 1 Tháng",         LicenseKeyStatus.ChuaKichHoat),
                Key("YT-GIFT-FREE-0002",          pYoutube,    "YouTube Premium 1 Tháng",         LicenseKeyStatus.ChuaKichHoat),

                // ESET — 1 locked, 1 free
                Key("ESET-IS-XXXX-AAAA-BBBB",    pEset,       "ESET Internet Security 1 Năm",    LicenseKeyStatus.BiKhoa),
                Key("ESET-IS-YYYY-DDDD-EEEE",    pEset,       "ESET Internet Security 1 Năm",    LicenseKeyStatus.ChuaKichHoat),

                // Kaspersky — 2 free
                Key("KAS-TOTAL-XXXX-YYYY-0001",  pKaspersky,  "Kaspersky Total Security 1 Năm",  LicenseKeyStatus.ChuaKichHoat),
                Key("KAS-TOTAL-XXXX-YYYY-0002",  pKaspersky,  "Kaspersky Total Security 1 Năm",  LicenseKeyStatus.ChuaKichHoat),

                // Google One — 5 free
                Key("GOOG1-FREE-0001-XXXXXXXX",  pGoogleOne,  "Google One 100GB 1 Năm",          LicenseKeyStatus.ChuaKichHoat),
                Key("GOOG1-FREE-0002-XXXXXXXX",  pGoogleOne,  "Google One 100GB 1 Năm",          LicenseKeyStatus.ChuaKichHoat),
                Key("GOOG1-FREE-0003-XXXXXXXX",  pGoogleOne,  "Google One 100GB 1 Năm",          LicenseKeyStatus.ChuaKichHoat)
            );
            await db.SaveChangesAsync();
        }

        // ─── Orders ───────────────────────────────────────────────────────
        if (!await db.Orders.AnyAsync())
        {
            db.Orders.AddRange(
                // Trải đều 30 ngày — chủ yếu HoanThanh để chart có dữ liệu
                Ord("ORD-100001", cust1,  "Nguyễn Văn An",    "an.nguyen@gmail.com",  "0901234567", 1030000, 0,     PaymentMethod.Banking, OrderStatus.HoanThanh, D(-29), null,
                    Item(pWin11Pro,   "Windows 11 Pro",            450000, 1, UsedKey1),
                    Item(pOff2021Pro, "Office 2021 Professional",  580000, 1, UsedKey2)),
                Ord("ORD-100002", cust2,  "Trần Thị Bảo",     "bao.tran@gmail.com",   "0912345678", 120000,  0,     PaymentMethod.VNPay,   OrderStatus.HoanThanh, D(-27), null,
                    Item(pNetflix,    "Netflix Premium 1 Tháng",   120000, 1, UsedKey3)),
                Ord("ORD-100003", cust3,  "Lê Hồng Phúc",     "phuc.le@yahoo.com",    "0923456789", 450000,  0,     PaymentMethod.MoMo,    OrderStatus.HoanThanh, D(-25), null,
                    Item(pWin11Pro,   "Windows 11 Pro",            450000, 1, UsedKey4)),
                Ord("ORD-100004", cust3,  "Lê Hồng Phúc",     "phuc.le@yahoo.com",    "0923456789", 850000,  0,     PaymentMethod.Banking, OrderStatus.HoanThanh, D(-23), null,
                    Item(pM365Family, "Microsoft 365 Family",      850000, 1, UsedKey5)),
                Ord("ORD-100005", cust4,  "Phạm Thị Lan",     "lan.pham@gmail.com",   "0934567890", 135000,  0,     PaymentMethod.VNPay,   OrderStatus.HoanThanh, D(-21), null,
                    Item(pSpotify,    "Spotify Premium 1 Tháng",    75000, 1, UsedKey6),
                    Item(pYoutube,    "YouTube Premium 1 Tháng",    60000, 1, UsedKey7)),
                Ord("ORD-100006", cust5,  "Vũ Đức Mạnh",      "manh.vu@outlook.com",  "0945678901", 580000,  0,     PaymentMethod.Banking, OrderStatus.HoanThanh, D(-19), null,
                    Item(pOff2021Pro, "Office 2021 Professional",  580000, 1, UsedKey8)),
                Ord("ORD-100007", cust6,  "Ngô Thị Kiều",     "kieu.ngo@gmail.com",   "0956789012", 350000,  0,     PaymentMethod.VNPay,   OrderStatus.HoanThanh, D(-17), null,
                    Item(pWin10Pro,   "Windows 10 Pro",            350000, 1, UsedKey9)),
                Ord("ORD-100008", cust7,  "Bùi Văn Khang",    "khang.bui@gmail.com",  "0967890123", 120000,  0,     PaymentMethod.VNPay,   OrderStatus.HoanThanh, D(-15), null,
                    Item(pNetflix,    "Netflix Premium 1 Tháng",   120000, 1, UsedKey10)),
                Ord("ORD-100009", cust8,  "Đoàn Thị Kim Mai", "mai.doan@gmail.com",   "0978901234", 450000,  0,     PaymentMethod.Banking, OrderStatus.HoanThanh, D(-13), null,
                    Item(pWin11Pro,   "Windows 11 Pro",            450000, 1, UsedKey11)),
                Ord("ORD-100010", cust9,  "Lương Văn Tùng",   "tung.luong@gmail.com", "0989012345", 850000,  0,     PaymentMethod.Banking, OrderStatus.HoanThanh, D(-11), null,
                    Item(pM365Family, "Microsoft 365 Family",      850000, 1, UsedKey12)),
                // 7 ngày gần nhất — dữ liệu dày cho chart
                Ord("ORD-100011", cust1,  "Nguyễn Văn An",    "an.nguyen@gmail.com",  "0901234567", 420000,  0,     PaymentMethod.Banking, OrderStatus.HoanThanh, D(-6), null,
                    Item(pKaspersky,  "Kaspersky Total Security 1 Năm", 420000, 1)),
                Ord("ORD-100012", cust11, "Nguyễn Minh Trí",  "tri.nguyen@icloud.com","0901111222", 350000,  0,     PaymentMethod.VNPay,   OrderStatus.HoanThanh, D(-6), null,
                    Item(pEset,       "ESET Internet Security 1 Năm",  350000, 1)),
                Ord("ORD-100013", cust2,  "Trần Thị Bảo",     "bao.tran@gmail.com",   "0912345678", 380000,  0,     PaymentMethod.MoMo,    OrderStatus.HoanThanh, D(-5), null,
                    Item(pOff2021Home,"Office 2021 Home & Business",   380000, 1)),
                Ord("ORD-100014", cust12, "Trần Quang Huy",   "huy.tran@gmail.com",   "0902222333", 400000,  50000, PaymentMethod.VNPay,   OrderStatus.HoanThanh, D(-5), null,
                    Item(pWin11Pro,   "Windows 11 Pro",                450000, 1)),
                Ord("ORD-100015", cust4,  "Phạm Thị Lan",     "lan.pham@gmail.com",   "0934567890", 120000,  0,     PaymentMethod.Banking, OrderStatus.HoanThanh, D(-4), null,
                    Item(pNetflix,    "Netflix Premium 1 Tháng",       120000, 1)),
                Ord("ORD-100016", cust6,  "Ngô Thị Kiều",     "kieu.ngo@gmail.com",   "0956789012", 75000,   0,     PaymentMethod.VNPay,   OrderStatus.HoanThanh, D(-4), null,
                    Item(pSpotify,    "Spotify Premium 1 Tháng",        75000, 1)),
                Ord("ORD-100017", cust3,  "Lê Hồng Phúc",     "phuc.le@yahoo.com",    "0923456789", 1030000, 0,     PaymentMethod.Banking, OrderStatus.HoanThanh, D(-3), null,
                    Item(pWin11Pro,   "Windows 11 Pro",                450000, 1),
                    Item(pOff2021Pro, "Office 2021 Professional",      580000, 1)),
                Ord("ORD-100018", cust5,  "Vũ Đức Mạnh",      "manh.vu@outlook.com",  "0945678901", 60000,   0,     PaymentMethod.VNPay,   OrderStatus.HoanThanh, D(-3), null,
                    Item(pYoutube,    "YouTube Premium 1 Tháng",        60000, 1)),
                Ord("ORD-100019", cust7,  "Bùi Văn Khang",    "khang.bui@gmail.com",  "0967890123", 850000,  0,     PaymentMethod.Banking, OrderStatus.HoanThanh, D(-2), null,
                    Item(pM365Family, "Microsoft 365 Family",          850000, 1)),
                Ord("ORD-100020", cust9,  "Lương Văn Tùng",   "tung.luong@gmail.com", "0989012345", 350000,  0,     PaymentMethod.MoMo,    OrderStatus.HoanThanh, D(-2), null,
                    Item(pWin11Home,  "Windows 11 Home",               350000, 1)),
                Ord("ORD-100021", cust11, "Nguyễn Minh Trí",  "tri.nguyen@icloud.com","0901111222", 580000,  0,     PaymentMethod.VNPay,   OrderStatus.HoanThanh, D(-1), null,
                    Item(pOff2021Pro, "Office 2021 Professional",      580000, 1)),
                Ord("ORD-100022", cust12, "Trần Quang Huy",   "huy.tran@gmail.com",   "0902222333", 120000,  0,     PaymentMethod.Banking, OrderStatus.HoanThanh, D(-1), null,
                    Item(pNetflix,    "Netflix Premium 1 Tháng",       120000, 1)),
                // Các trạng thái khác
                Ord("ORD-100023", cust10, "Hoàng Thị Mai",    "mai.hoang@gmail.com",  "0990123456", 420000,  0,     PaymentMethod.Banking, OrderStatus.DangXuLy,     D(0),  "Chờ xác nhận",
                    Item(pKaspersky,  "Kaspersky Total Security 1 Năm", 420000, 1)),
                Ord("ORD-100024", cust8,  "Đoàn Thị Kim Mai", "mai.doan@gmail.com",   "0978901234", 75000,   0,     PaymentMethod.VNPay,   OrderStatus.ChoThanhToan, D(0),  null,
                    Item(pSpotify,    "Spotify Premium 1 Tháng",        75000, 1)),
                Ord("ORD-100025", cust2,  "Trần Thị Bảo",     "bao.tran@gmail.com",   "0912345678", 350000,  0,     PaymentMethod.MoMo,    OrderStatus.DaHuy,        D(-8), "Khách hủy",
                    Item(pWin10Pro,   "Windows 10 Pro",                350000, 1)),
                Ord("ORD-100026", cust1,  "Nguyễn Văn An",    "an.nguyen@gmail.com",  "0901234567", 120000,  0,     PaymentMethod.VNPay,   OrderStatus.HoanTien,     D(-14), null,
                    Item(pNetflix,    "Netflix Premium 1 Tháng",       120000, 1))
            );
            await db.SaveChangesAsync();
        }

        // ─── Banners ──────────────────────────────────────────────────────
        if (!await db.Banners.AnyAsync())
        {
            db.Banners.AddRange(
                new Banner { Id = G(), Title = "Sale tháng 6 - Giảm 30% Windows & Office",  Image = "/uploads/banners/banner-sale.jpg", Link = "/products?category=windows", Position = BannerPosition.TrangChuHero,   SortOrder = 1, Status = BannerStatus.HienThi, CreatedAt = D(-10), UpdatedAt = D(-10) },
                new Banner { Id = G(), Title = "Microsoft 365 - Làm việc mọi lúc mọi nơi", Image = "/uploads/banners/banner-m365.jpg",  Link = "/products?sku=M365-FAMILY",   Position = BannerPosition.TrangChuBanner, SortOrder = 1, Status = BannerStatus.HienThi, CreatedAt = D(-15), UpdatedAt = D(-15) },
                new Banner { Id = G(), Title = "Antivirus - Bảo vệ máy tính toàn diện",    Image = "/uploads/banners/banner-av.jpg",   Link = "/products?category=antivirus", Position = BannerPosition.TrangSanPham,   SortOrder = 1, Status = BannerStatus.HienThi, CreatedAt = D(-20), UpdatedAt = D(-20) },
                new Banner { Id = G(), Title = "Thanh toán dễ dàng qua VNPay & MoMo",      Image = "/uploads/banners/banner-pay.jpg",  Link = null,                           Position = BannerPosition.ThanhToan,      SortOrder = 1, Status = BannerStatus.HienThi, CreatedAt = D(-25), UpdatedAt = D(-25) }
            );
        }

        // ─── Articles ─────────────────────────────────────────────────────
        if (!await db.Articles.AnyAsync())
        {
            db.Articles.AddRange(
                new Article { Id = G(), Title = "Hướng dẫn kích hoạt Windows 11 Pro",        Slug = "huong-dan-kich-hoat-windows-11-pro",       Excerpt = "Hướng dẫn từng bước kích hoạt Windows 11 Pro bằng key bản quyền.",                              Content = "<p>Sau khi mua key Windows 11 Pro tại NexKey, bạn làm theo các bước sau:</p><p>1. Vào <strong>Settings → System → Activation</strong><br/>2. Chọn <em>Change product key</em><br/>3. Nhập key và chọn Next<br/>4. Windows sẽ tự động kích hoạt online.</p>",                 Category = "Hướng dẫn", Status = ArticleStatus.DaXuatBan, Author = "Super Admin",   Tags = JsonSerializer.Serialize(new[] { "windows", "kích hoạt", "hướng dẫn" }), Views = 2150, PublishedAt = D(-45), CreatedAt = D(-46), UpdatedAt = D(-10) },
                new Article { Id = G(), Title = "So sánh Office 2021 và Microsoft 365",       Slug = "so-sanh-office-2021-va-microsoft-365",      Excerpt = "Office 2021 và Microsoft 365 khác nhau như thế nào? Nên chọn sản phẩm nào?",                    Content = "<p>Bài viết so sánh chi tiết giữa Office 2021 (mua một lần) và Microsoft 365 (thuê bao hàng năm)...</p>",                                                                                                                                               Category = "Hướng dẫn", Status = ArticleStatus.DaXuatBan, Author = "Trung Nguyễn",  Tags = JsonSerializer.Serialize(new[] { "office", "microsoft 365", "so sánh" }), Views = 1580, PublishedAt = D(-30), CreatedAt = D(-31), UpdatedAt = D(-5) },
                new Article { Id = G(), Title = "Top 5 phần mềm diệt virus tốt nhất 2026",   Slug = "top-5-phan-mem-diet-virus-tot-nhat-2026",   Excerpt = "Điểm mặt 5 phần mềm bảo mật hàng đầu: ESET, Kaspersky, Bitdefender...",                         Content = "<p>Bảo vệ máy tính là điều cực kỳ quan trọng. Dưới đây là top 5 phần mềm antivirus tốt nhất năm 2026...</p>",                                                                                                                                        Category = "Tin tức",   Status = ArticleStatus.DaXuatBan, Author = "Linh Nguyễn",   Tags = JsonSerializer.Serialize(new[] { "antivirus", "bảo mật", "kaspersky", "eset" }), Views = 980, PublishedAt = D(-20), CreatedAt = D(-21), UpdatedAt = D(-3) },
                new Article { Id = G(), Title = "Khuyến mãi tháng 6: Giảm 30% key Windows",  Slug = "khuyen-mai-thang-6-giam-30-key-windows",   Excerpt = "Tháng 6 này NexKey ưu đãi cực lớn cho key Windows 10, Windows 11.",                              Content = "<p>Nhân dịp kỷ niệm 2 năm thành lập, NexKey giảm giá 30% toàn bộ sản phẩm Windows. Áp dụng đến hết ngày 30/06/2026.</p>",                                                                                                                           Category = "Khuyến mãi",Status = ArticleStatus.DaXuatBan, Author = "Super Admin",   Tags = JsonSerializer.Serialize(new[] { "khuyến mãi", "windows", "giảm giá" }), Views = 3200, PublishedAt = D(-7), CreatedAt = D(-8), UpdatedAt = D(-1) },
                new Article { Id = G(), Title = "Cách mua key an toàn, tránh bị lừa đảo",    Slug = "cach-mua-key-an-toan-tranh-bi-lua-dao",    Excerpt = "Những điều cần biết khi mua key phần mềm bản quyền để tránh tiền mất tật mang.",                  Content = "<p>Thị trường key phần mềm hiện nay rất phức tạp. Dưới đây là các dấu hiệu nhận biết shop uy tín...</p>",                                                                                                                                            Category = "Bảo mật",   Status = ArticleStatus.DaXuatBan, Author = "Linh Nguyễn",   Tags = JsonSerializer.Serialize(new[] { "bảo mật", "mua key", "an toàn" }), Views = 1420, PublishedAt = D(-14), CreatedAt = D(-15), UpdatedAt = D(-2) },
                new Article { Id = G(), Title = "Hướng dẫn cài đặt Office 2021",              Slug = "huong-dan-cai-dat-office-2021",             Excerpt = "Hướng dẫn tải và cài đặt Microsoft Office 2021 Professional từ A đến Z.",                        Content = "<p>Bài viết đang hoàn thiện...</p>",                                                                                                                                                                                                                  Category = "Hướng dẫn", Status = ArticleStatus.Nhap,      Author = "Trung Nguyễn",  Tags = JsonSerializer.Serialize(new[] { "office", "cài đặt" }), Views = 0, PublishedAt = null, CreatedAt = D(-2), UpdatedAt = D(-1) }
            );
        }

        // ─── Static Pages ─────────────────────────────────────────────────
        if (!await db.StaticPages.AnyAsync())
        {
            db.StaticPages.AddRange(
                new StaticPage { Id = G(), Title = "Chính sách bảo mật",   Slug = "/chinh-sach-bao-mat",   Description = "Chính sách bảo mật và xử lý dữ liệu người dùng của NexKey",            Content = "<h2>1. Thông tin thu thập</h2><p>NexKey thu thập email, tên, số điện thoại khi bạn đặt hàng.</p><h2>2. Sử dụng thông tin</h2><p>Thông tin chỉ dùng để xử lý đơn hàng và hỗ trợ khách hàng.</p>",   Status = PageStatus.HienThi, IsSystem = true,  CreatedAt = D(-60), UpdatedAt = D(-30) },
                new StaticPage { Id = G(), Title = "Điều khoản sử dụng",   Slug = "/dieu-khoan-su-dung",   Description = "Điều khoản và điều kiện sử dụng dịch vụ NexKey",                         Content = "<h2>1. Chấp nhận điều khoản</h2><p>Bằng cách sử dụng NexKey, bạn đồng ý với các điều khoản này.</p><h2>2. Quyền sở hữu</h2><p>Key bán tại NexKey là bản quyền chính hãng.</p>",                      Status = PageStatus.HienThi, IsSystem = true,  CreatedAt = D(-60), UpdatedAt = D(-30) },
                new StaticPage { Id = G(), Title = "Hướng dẫn thanh toán", Slug = "/huong-dan-thanh-toan", Description = "Hướng dẫn các phương thức thanh toán tại NexKey",                        Content = "<p>NexKey hỗ trợ: <strong>VNPay</strong>, <strong>MoMo</strong>, chuyển khoản ngân hàng. Sau thanh toán, key gửi tự động qua email trong 1-5 phút.</p>",                                                Status = PageStatus.HienThi, IsSystem = false, CreatedAt = D(-55), UpdatedAt = D(-20) },
                new StaticPage { Id = G(), Title = "Chính sách đổi trả",   Slug = "/chinh-sach-doi-tra",   Description = "Chính sách đổi trả và hoàn tiền khi sản phẩm lỗi",                      Content = "<p>NexKey cam kết <strong>hoàn tiền 100%</strong> nếu key bị lỗi trong 24h đầu sau khi nhận. Liên hệ support kèm mã đơn hàng để được hỗ trợ.</p>",                                                   Status = PageStatus.HienThi, IsSystem = false, CreatedAt = D(-55), UpdatedAt = D(-20) },
                new StaticPage { Id = G(), Title = "Về chúng tôi",         Slug = "/ve-chung-toi",         Description = "Giới thiệu về NexKey - đơn vị cung cấp key phần mềm bản quyền uy tín",  Content = "<p>NexKey được thành lập năm 2024, chuyên cung cấp key phần mềm bản quyền chính hãng: Windows, Office, Antivirus, Subscription. Hơn 10.000 khách hàng tin dùng.</p>",                                 Status = PageStatus.HienThi, IsSystem = false, CreatedAt = D(-60), UpdatedAt = D(-30) }
            );
        }

        // ─── FAQ ──────────────────────────────────────────────────────────
        if (!await db.Faqs.AnyAsync())
        {
            db.Faqs.AddRange(
                new Faq { Id = G(), Question = "Làm thế nào để kích hoạt key Windows?",                Answer = "Vào Settings → System → Activation → Change product key, nhập key và nhấn Next. Windows sẽ tự động kích hoạt qua internet.",                    Category = "Key & Kích hoạt", Status = FaqStatus.HienThi, SortOrder = 1, CreatedAt = D(-60), UpdatedAt = D(-30) },
                new Faq { Id = G(), Question = "Key có thể dùng cho bao nhiêu máy tính?",              Answer = "Mỗi key Windows/Office chỉ dùng cho 1 máy. Subscription Microsoft 365 Family cho phép tối đa 6 thiết bị.",                                        Category = "Key & Kích hoạt", Status = FaqStatus.HienThi, SortOrder = 2, CreatedAt = D(-60), UpdatedAt = D(-30) },
                new Faq { Id = G(), Question = "Cài lại Windows, key có còn dùng được không?",         Answer = "Key Retail: có thể chuyển sang máy khác hoặc cài lại. Key OEM: gắn với phần cứng, cài lại trên máy đó vẫn dùng được.",                          Category = "Key & Kích hoạt", Status = FaqStatus.HienThi, SortOrder = 3, CreatedAt = D(-58), UpdatedAt = D(-28) },
                new Faq { Id = G(), Question = "Thanh toán qua những phương thức nào?",                Answer = "NexKey hỗ trợ: VNPay, MoMo, chuyển khoản ngân hàng (Banking). Thanh toán được xử lý ngay lập tức.",                                               Category = "Thanh toán",      Status = FaqStatus.HienThi, SortOrder = 1, CreatedAt = D(-60), UpdatedAt = D(-30) },
                new Faq { Id = G(), Question = "Tôi có thể hoàn tiền không?",                          Answer = "NexKey hoàn tiền 100% trong 24h nếu key lỗi hoặc không kích hoạt được. Sau 24h không hỗ trợ hoàn tiền.",                                          Category = "Thanh toán",      Status = FaqStatus.HienThi, SortOrder = 2, CreatedAt = D(-58), UpdatedAt = D(-28) },
                new Faq { Id = G(), Question = "Sản phẩm có bảo hành không?",                          Answer = "Tất cả key tại NexKey được bảo hành 12 tháng. Nếu key bị thu hồi trong thời gian bảo hành, NexKey thay key mới miễn phí.",                       Category = "Bảo hành",        Status = FaqStatus.HienThi, SortOrder = 1, CreatedAt = D(-60), UpdatedAt = D(-30) },
                new Faq { Id = G(), Question = "Nhận key sau bao lâu?",                                 Answer = "Sau thanh toán thành công, key gửi tự động qua email trong 1-5 phút. Tối đa 1 giờ, liên hệ support nếu chưa nhận được.",                         Category = "Sản phẩm",       Status = FaqStatus.HienThi, SortOrder = 1, CreatedAt = D(-60), UpdatedAt = D(-30) },
                new Faq { Id = G(), Question = "NexKey có bán key số lượng lớn không?",                Answer = "Có. Từ 10 key trở lên, liên hệ support để được báo giá ưu đãi riêng. Hỗ trợ xuất hoá đơn VAT cho doanh nghiệp.",                               Category = "Sản phẩm",       Status = FaqStatus.HienThi, SortOrder = 2, CreatedAt = D(-55), UpdatedAt = D(-25) }
            );
        }

        // ─── Activity Logs ────────────────────────────────────────────────
        if (!await db.ActivityLogs.AnyAsync())
        {
            db.ActivityLogs.AddRange(
                new ActivityLog { Id = G(), Type = ActivityLogType.Order,    Title = "Đơn hàng mới",          Description = "Đơn hàng ORD-100022 được tạo - Trần Quang Huy",                  AdminId = "admin-trungnv-00001", Meta = "{\"orderId\":\"ORD-100022\"}", IsRead = false, CreatedAt = D(-1) },
                new ActivityLog { Id = G(), Type = ActivityLogType.Order,    Title = "Đơn hàng mới",          Description = "Đơn hàng ORD-100021 được tạo - Nguyễn Minh Trí",                 AdminId = "admin-trungnv-00001", Meta = "{\"orderId\":\"ORD-100021\"}", IsRead = false, CreatedAt = D(-1) },
                new ActivityLog { Id = G(), Type = ActivityLogType.Payment,  Title = "Thanh toán thành công", Description = "ORD-100022 thanh toán qua Banking - 120.000đ",                    AdminId = "admin-trungnv-00001", Meta = "{\"orderId\":\"ORD-100022\",\"amount\":120000}", IsRead = false, CreatedAt = D(-1) },
                new ActivityLog { Id = G(), Type = ActivityLogType.Order,    Title = "Đơn hàng mới",          Description = "Đơn hàng ORD-100020 được tạo - Lương Văn Tùng",                  AdminId = "admin-trungnv-00001", Meta = "{\"orderId\":\"ORD-100020\"}", IsRead = false, CreatedAt = D(-2) },
                new ActivityLog { Id = G(), Type = ActivityLogType.Key,      Title = "Key đã giao",           Description = "Key Microsoft 365 Family đã giao cho Bùi Văn Khang",             AdminId = "admin-super-000001",  Meta = null, IsRead = false, CreatedAt = D(-2) },
                new ActivityLog { Id = G(), Type = ActivityLogType.Customer, Title = "Khách hàng mới",        Description = "Trần Quang Huy đã đăng ký tài khoản",                            AdminId = null, Meta = $"{{\"customerId\":\"{cust12}\"}}", IsRead = true, CreatedAt = D(-7) },
                new ActivityLog { Id = G(), Type = ActivityLogType.Order,    Title = "Đơn hàng bị hủy",      Description = "Đơn hàng ORD-100025 bị hủy bởi Trần Thị Bảo",                   AdminId = "admin-trungnv-00001", Meta = "{\"orderId\":\"ORD-100025\"}", IsRead = true, CreatedAt = D(-8) },
                new ActivityLog { Id = G(), Type = ActivityLogType.Product,  Title = "Cập nhật sản phẩm",    Description = "Giá Windows 11 Pro được cập nhật: 500.000đ → 450.000đ",          AdminId = "admin-super-000001",  Meta = null, IsRead = true, CreatedAt = D(-10) },
                new ActivityLog { Id = G(), Type = ActivityLogType.Payment,  Title = "Hoàn tiền thành công", Description = "Hoàn tiền 120.000đ cho đơn ORD-100026 - Nguyễn Văn An",          AdminId = "admin-super-000001",  Meta = "{\"orderId\":\"ORD-100026\",\"amount\":120000}", IsRead = true, CreatedAt = D(-14) },
                new ActivityLog { Id = G(), Type = ActivityLogType.Admin,    Title = "Thêm quản trị viên",   Description = "Đã thêm tài khoản Trung Nguyễn với vai trò Admin",                AdminId = "admin-super-000001",  Meta = null, IsRead = true, CreatedAt = D(-30) },
                new ActivityLog { Id = G(), Type = ActivityLogType.Key,      Title = "Key bị khóa",          Description = "Key ESET-IS-XXXX-AAAA-BBBB bị khóa do nghi ngờ vi phạm",        AdminId = "admin-super-000001",  Meta = null, IsRead = true, CreatedAt = D(-20) },
                new ActivityLog { Id = G(), Type = ActivityLogType.Admin,    Title = "Cập nhật cài đặt",     Description = "Cấu hình cổng thanh toán VNPay và MoMo được kích hoạt",           AdminId = "admin-super-000001",  Meta = null, IsRead = true, CreatedAt = D(-30) }
            );
        }

        await db.SaveChangesAsync();
    }

    private static DateTime D(int days) =>
        DateTime.UtcNow.Date.AddDays(days).AddHours(8).AddMinutes(Random.Shared.Next(0, 90));

    private static string G() => Guid.NewGuid().ToString();

    private static Order Ord(
        string id, string custId, string custName, string custEmail, string custPhone,
        long total, long discount, PaymentMethod pm, OrderStatus status, DateTime createdAt,
        string? note, params OrderItem[] items)
    {
        var order = new Order
        {
            Id = id, CustomerId = custId, CustomerName = custName,
            CustomerEmail = custEmail, CustomerPhone = custPhone,
            Total = total, Discount = discount, PaymentMethod = pm, Status = status,
            Note = note, CreatedAt = createdAt, UpdatedAt = createdAt.AddMinutes(3)
        };
        foreach (var item in items) { item.OrderId = id; order.Items.Add(item); }
        return order;
    }

    private static OrderItem Item(string pid, string name, long price, int qty, string? key = null) =>
        new() { ProductId = pid, Name = name, Price = price, Quantity = qty, LicenseKey = key };
}
