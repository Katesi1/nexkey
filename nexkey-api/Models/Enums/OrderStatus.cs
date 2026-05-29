namespace NexKey.Api.Models.Enums;

public enum OrderStatus
{
    DangXuLy = 1,      // Đang xử lý
    HoanThanh = 2,     // Hoàn thành
    DaHuy = 3,         // Đã hủy
    HoanTien = 4,      // Hoàn tiền
    ChoThanhToan = 5   // Chờ thanh toán
}

public enum PaymentMethod
{
    VNPay = 1,
    MoMo = 2,
    Banking = 3,
    Card = 4,
    TienMat = 5  // Tiền mặt
}

public enum ProductType
{
    WindowsKey = 1,
    OfficeKey = 2,
    Subscription = 3,
    Account = 4,
    Antivirus = 5
}

public enum ProductStatus
{
    DangBan = 1,    // Đang bán
    HetHang = 2,    // Hết hàng
    TamNgung = 3,   // Tạm ngưng
    Nhap = 4        // Nháp
}

public enum CategoryStatus
{
    HienThi = 1,    // Hiển thị
    An = 2          // Ẩn
}

public enum CustomerStatus
{
    HoatDong = 1,   // Hoạt động
    VIP = 2,
    BiKhoa = 3      // Bị khóa
}

public enum SupplierStatus
{
    DangHopTac = 1, // Đang hợp tác
    ChoDuyet = 2,   // Chờ duyệt
    TamNgung = 3    // Tạm ngưng
}

public enum WarehouseStatus
{
    ConHang = 1,    // Còn hàng
    SapHet = 2,     // Sắp hết
    HetHang = 3,    // Hết hàng
    DangNhap = 4    // Đang nhập
}

public enum LicenseKeyStatus
{
    HoatDong = 1,       // Hoạt động
    SapHetHan = 2,      // Sắp hết hạn
    DaHetHan = 3,       // Đã hết hạn
    BiKhoa = 4,         // Bị khóa
    ChuaKichHoat = 5    // Chưa kích hoạt
}

public enum BannerPosition
{
    TrangChuHero = 1,       // Trang chủ - Hero
    TrangChuBanner = 2,     // Trang chủ - Banner
    TrangSanPham = 3,       // Trang sản phẩm
    ThanhToan = 4           // Thanh toán
}

public enum BannerStatus
{
    HienThi = 1,
    An = 2
}

public enum ArticleStatus
{
    DaXuatBan = 1,  // Đã xuất bản
    Nhap = 2,       // Nháp
    DaLenLich = 3   // Đã lên lịch
}

public enum PageStatus
{
    HienThi = 1,
    An = 2
}

public enum FaqStatus
{
    HienThi = 1,
    An = 2
}

public enum ActivityLogType
{
    Order = 1,
    Customer = 2,
    Product = 3,
    Key = 4,
    Payment = 5,
    Admin = 6
}

public enum AdminStatus
{
    HoatDong = 1,   // Hoạt động
    BiKhoa = 2      // Bị khóa
}
