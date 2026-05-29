# NexKey Admin API Documentation

## Tổng quan

| | |
|--|--|
| **Base URL** | `http://localhost:5000/v1` (dev) · `https://api.nexkey.vn/v1` (prod) |
| **Auth** | JWT Bearer Token |
| **Content-Type** | `application/json` |
| **Swagger UI** | `http://localhost:5000/swagger` |

---

## Authentication

### Cách sử dụng token

Sau khi login, đính kèm token vào tất cả request:

```
Authorization: Bearer <token>
```

Token hết hạn sau **24 giờ**. Cần login lại để lấy token mới.

---

### POST /auth/login

Đăng nhập, nhận JWT token.

> **Public** — không cần token

**Request**
```json
{
  "email": "admin@nexkey.vn",
  "password": "Admin@123456"
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "uuid",
      "name": "Super Admin",
      "email": "admin@nexkey.vn",
      "status": "HoatDong",
      "role": {
        "id": "uuid",
        "name": "Super Admin",
        "color": "#dc2626",
        "permissions": ["*"]
      }
    }
  }
}
```

---

### POST /auth/logout

Đăng xuất.

**Response 200**
```json
{ "success": true, "data": { "message": "Đăng xuất thành công" } }
```

---

### POST /auth/change-password

Đổi mật khẩu.

**Request**
```json
{
  "currentPassword": "Admin@123456",
  "newPassword": "NewPass@789"
}
```

**Response 200**
```json
{ "success": true, "data": { "message": "Đổi mật khẩu thành công" } }
```

---

### GET /auth/me

Lấy thông tin admin đang đăng nhập.

**Response 200**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Super Admin",
    "email": "admin@nexkey.vn",
    "status": "HoatDong",
    "role": {
      "id": "uuid",
      "name": "Super Admin",
      "color": "#dc2626",
      "permissions": ["*"]
    }
  }
}
```

---

## Response Format

Tất cả response đều có cấu trúc thống nhất:

```json
// Thành công — danh sách có phân trang
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}

// Thành công — đối tượng đơn
{
  "success": true,
  "data": { ... }
}

// Lỗi
{
  "success": false,
  "error": "Mô tả lỗi",
  "code": "NOT_FOUND"
}
```

**Error codes:**

| HTTP | Code | Mô tả |
|------|------|--------|
| 400 | `VALIDATION_ERROR` | Dữ liệu không hợp lệ |
| 401 | `UNAUTHORIZED` | Chưa đăng nhập / token hết hạn |
| 403 | `FORBIDDEN` | Không có quyền |
| 404 | `NOT_FOUND` | Không tìm thấy |
| 409 | `CONFLICT` | Trùng lặp (email, SKU, slug...) |
| 422 | `UNPROCESSABLE` | Không thể xử lý |
| 500 | `SERVER_ERROR` | Lỗi server |

---

## Enums

Các giá trị enum trả về dạng **string** trong response.

| Enum | Giá trị |
|------|---------|
| `OrderStatus` | `DangXuLy` · `HoanThanh` · `DaHuy` · `HoanTien` · `ChoThanhToan` |
| `PaymentMethod` | `VNPay` · `MoMo` · `Banking` · `Card` · `TienMat` |
| `ProductType` | `WindowsKey` · `OfficeKey` · `Subscription` · `Account` · `Antivirus` |
| `ProductStatus` | `DangBan` · `HetHang` · `TamNgung` · `Nhap` |
| `CategoryStatus` | `HienThi` · `An` |
| `CustomerStatus` | `HoatDong` · `VIP` · `BiKhoa` |
| `SupplierStatus` | `DangHopTac` · `ChoDuyet` · `TamNgung` |
| `WarehouseStatus` | `ConHang` · `SapHet` · `HetHang` · `DangNhap` |
| `LicenseKeyStatus` | `HoatDong` · `SapHetHan` · `DaHetHan` · `BiKhoa` · `ChuaKichHoat` |
| `BannerPosition` | `TrangChuHero` · `TrangChuBanner` · `TrangSanPham` · `ThanhToan` |
| `BannerStatus` | `HienThi` · `An` |
| `ArticleStatus` | `DaXuatBan` · `Nhap` · `DaLenLich` |
| `ActivityLogType` | `Order` · `Customer` · `Product` · `Key` · `Payment` · `Admin` |
| `AdminStatus` | `HoatDong` · `BiKhoa` |

---

## 1. Orders — Đơn hàng

### GET /orders

Danh sách đơn hàng.

**Query params**

| Param | Type | Mô tả |
|-------|------|--------|
| `page` | int | Trang (mặc định: 1) |
| `limit` | int | Số item/trang (mặc định: 10) |
| `search` | string | Tìm theo mã đơn, tên/email/sđt KH |
| `status` | string | Lọc theo trạng thái |
| `payment_method` | string | Lọc theo PTTT |
| `min_amount` | long | Tổng tiền tối thiểu |
| `max_amount` | long | Tổng tiền tối đa |

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": "ORD-123456",
      "customerId": "uuid",
      "customerName": "Nguyễn Văn A",
      "customerEmail": "a@gmail.com",
      "customerPhone": "0901234567",
      "total": 500000,
      "discount": 0,
      "paymentMethod": "VNPay",
      "status": "HoanThanh",
      "note": null,
      "createdAt": "2024-05-27T10:32:00Z",
      "updatedAt": "2024-05-27T10:35:00Z",
      "items": [
        {
          "id": 1,
          "productId": "uuid",
          "name": "Windows 11 Pro Key",
          "price": 500000,
          "quantity": 1,
          "licenseKey": "XXXXX-XXXXX-XXXXX"
        }
      ]
    }
  ],
  "meta": { "total": 100, "page": 1, "limit": 10, "totalPages": 10 }
}
```

---

### GET /orders/stats

Thống kê đơn hàng theo trạng thái.

**Response 200**
```json
{
  "success": true,
  "data": {
    "dangXuLy": 5,
    "hoanThanh": 120,
    "daHuy": 3,
    "hoanTien": 1,
    "choThanhToan": 8,
    "tongDoanhThu": 60000000
  }
}
```

---

### GET /orders/export

Xuất danh sách đơn hàng ra file Excel.

> Trả về file `.xlsx`, không phải JSON.

**Response**: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

---

### GET /orders/:id

Chi tiết đơn hàng (bao gồm items).

---

### POST /orders

Tạo đơn hàng mới.

**Request**
```json
{
  "customerId": "uuid",
  "paymentMethod": "VNPay",
  "note": "Giao hàng buổi sáng",
  "discount": 50000,
  "items": [
    { "productId": "uuid", "quantity": 1 },
    { "productId": "uuid", "quantity": 2 }
  ]
}
```

---

### PATCH /orders/:id

Cập nhật trạng thái hoặc ghi chú.

**Request**
```json
{
  "status": "HoanThanh",
  "note": "Đã giao thành công"
}
```

---

### DELETE /orders/:id

Xóa đơn hàng.

---

### POST /orders/:id/refund

Hoàn tiền đơn hàng (chỉ áp dụng khi status = `HoanThanh`).

---

## 2. Products — Sản phẩm

### GET /products

**Query params**: `page` · `limit` · `search` · `status` · `category_id` · `type`

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Windows 11 Pro",
      "sku": "WIN11-PRO",
      "categoryId": "uuid",
      "categoryName": "Windows",
      "type": "WindowsKey",
      "price": 500000,
      "comparePrice": 800000,
      "stock": 50,
      "sold": 120,
      "status": "DangBan",
      "image": "/uploads/...",
      "description": "Mô tả sản phẩm",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "meta": { "total": 50, "page": 1, "limit": 10, "totalPages": 5 }
}
```

### GET /products/export

Xuất Excel.

### GET /products/:id

Chi tiết sản phẩm.

### POST /products

**Request**
```json
{
  "name": "Windows 11 Pro",
  "sku": "WIN11-PRO",
  "categoryId": "uuid",
  "type": "WindowsKey",
  "price": 500000,
  "comparePrice": 800000,
  "stock": 50,
  "status": "DangBan",
  "image": "https://...",
  "description": "Mô tả"
}
```

### PATCH /products/:id

Cập nhật sản phẩm (chỉ gửi field cần thay đổi).

### PATCH /products/:id/stock

Cập nhật tồn kho.

**Request**
```json
{ "quantity": 10, "action": "add" }
```
> `action`: `"add"` hoặc `"subtract"`

### DELETE /products/:id

---

## 3. Categories — Danh mục

### GET /categories

**Query params**: `status` · `search`

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Windows",
      "slug": "windows",
      "icon": "🪟",
      "color": "#0078d4",
      "productCount": 15,
      "status": "HienThi",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### GET /categories/:id

### POST /categories

**Request**
```json
{
  "name": "Windows",
  "slug": "windows",
  "icon": "🪟",
  "color": "#0078d4",
  "status": "HienThi"
}
```

### PATCH /categories/:id

### PATCH /categories/:id/toggle

Bật/tắt hiển thị danh mục.

### DELETE /categories/:id

> Lỗi `422` nếu còn sản phẩm.

---

## 4. Customers — Khách hàng

### GET /customers

**Query params**: `page` · `limit` · `search` · `status` · `min_spending` · `max_spending`

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "fullName": "Nguyễn Văn A",
      "email": "a@gmail.com",
      "phone": "0901234567",
      "avatar": null,
      "totalOrders": 5,
      "totalSpending": 2500000,
      "status": "HoatDong",
      "joinedAt": "...",
      "updatedAt": "..."
    }
  ],
  "meta": { "total": 200, "page": 1, "limit": 10, "totalPages": 20 }
}
```

### GET /customers/export

Xuất Excel.

### GET /customers/:id

Chi tiết kèm lịch sử đơn hàng gần nhất (20 đơn).

**Response 200**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fullName": "Nguyễn Văn A",
    "email": "a@gmail.com",
    "totalOrders": 5,
    "totalSpending": 2500000,
    "status": "HoatDong",
    "orders": [
      {
        "id": "ORD-123456",
        "total": 500000,
        "status": "HoanThanh",
        "paymentMethod": "VNPay",
        "createdAt": "..."
      }
    ]
  }
}
```

### POST /customers

**Request**
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "a@gmail.com",
  "phone": "0901234567",
  "status": "HoatDong"
}
```

### PATCH /customers/:id

### PATCH /customers/:id/lock

**Request**
```json
{ "locked": true }
```

### DELETE /customers/:id

---

## 5. Suppliers — Nhà cung cấp

### GET /suppliers

**Query params**: `status` · `search` · `has_debt` (true/false)

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "companyName": "Công ty ABC",
      "taxCode": "0123456789",
      "contactPerson": "Trần B",
      "email": "abc@company.com",
      "phone": "0281234567",
      "suppliedProducts": 10,
      "debt": 5000000,
      "status": "DangHopTac",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### GET /suppliers/:id

### POST /suppliers

**Request**
```json
{
  "companyName": "Công ty ABC",
  "taxCode": "0123456789",
  "contactPerson": "Trần B",
  "email": "abc@company.com",
  "phone": "0281234567",
  "status": "ChoDuyet"
}
```

### PATCH /suppliers/:id

### PATCH /suppliers/:id/debt

**Request**
```json
{ "amount": 1000000, "action": "add" }
```
> `action`: `"add"` hoặc `"subtract"`

### DELETE /suppliers/:id

---

## 6. Warehouse — Kho hàng

### GET /warehouse

**Query params**: `page` · `limit` · `search` · `warehouse` · `status`

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "productId": "uuid",
      "productName": "Windows 11 Pro",
      "sku": "WIN11-PRO",
      "warehouse": "Kho chính",
      "quantity": 50,
      "unit": "Key",
      "costPrice": 200000,
      "inventoryValue": 10000000,
      "status": "ConHang",
      "updatedAt": "..."
    }
  ],
  "meta": { "total": 30, "page": 1, "limit": 10, "totalPages": 3 }
}
```

> `status` tự động: `quantity = 0` → `HetHang` · `< 20` → `SapHet` · `>= 20` → `ConHang`

### GET /warehouse/summary

**Response 200**
```json
{
  "success": true,
  "data": {
    "byWarehouse": [
      { "warehouse": "Kho chính", "quantity": 300, "value": 60000000 },
      { "warehouse": "Kho chi nhánh", "quantity": 100, "value": 20000000 }
    ],
    "totalValue": 80000000,
    "totalQuantity": 400
  }
}
```

### GET /warehouse/:id

### POST /warehouse

**Request**
```json
{
  "productId": "uuid",
  "warehouse": "Kho chính",
  "quantity": 50,
  "unit": "Key",
  "costPrice": 200000
}
```

### PATCH /warehouse/:id/import

**Request**
```json
{ "quantity": 20, "costPrice": 210000 }
```

### PATCH /warehouse/:id/export

**Request**
```json
{ "quantity": 5 }
```

---

## 7. License Keys — Key/License

### GET /keys

**Query params**: `page` · `limit` · `search` · `status` · `product_id`

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "key": "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
      "productId": "uuid",
      "productName": "Windows 11 Pro",
      "customerId": null,
      "customerName": null,
      "orderId": null,
      "activatedAt": null,
      "expiresAt": null,
      "status": "ChuaKichHoat",
      "createdAt": "..."
    }
  ],
  "meta": { "total": 500, "page": 1, "limit": 10, "totalPages": 50 }
}
```

### GET /keys/:id

### POST /keys

Tạo 1 key.

**Request**
```json
{
  "key": "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
  "productId": "uuid",
  "status": "ChuaKichHoat",
  "expiresAt": null
}
```

### POST /keys/bulk

Tạo hàng loạt key tự động.

**Request**
```json
{
  "productId": "uuid",
  "quantity": 100,
  "prefix": "WIN11",
  "status": "ChuaKichHoat",
  "expiresAt": null
}
```

### POST /keys/assign

Gán key cho đơn hàng.

**Request**
```json
{
  "keyId": "uuid",
  "orderId": "ORD-123456",
  "customerId": "uuid"
}
```

### PATCH /keys/:id

**Request**
```json
{ "status": "HoatDong", "expiresAt": "2025-12-31T00:00:00Z" }
```

### PATCH /keys/:id/lock

**Request**
```json
{ "locked": true }
```

### DELETE /keys/:id

---

## 8. Banners

### GET /banners

**Query params**: `position` · `status`

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Khuyến mãi tháng 6",
      "image": "/uploads/banners/abc.jpg",
      "link": "https://nexkey.vn/sale",
      "position": "TrangChuHero",
      "sortOrder": 1,
      "status": "HienThi",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### GET /banners/:id

### POST /banners

**Request**
```json
{
  "title": "Khuyến mãi tháng 6",
  "image": "/uploads/banners/abc.jpg",
  "link": "https://nexkey.vn/sale",
  "position": "TrangChuHero",
  "sortOrder": 1,
  "status": "HienThi"
}
```

### PATCH /banners/:id

### PATCH /banners/:id/toggle

Bật/tắt hiển thị banner.

### PATCH /banners/reorder

Sắp xếp lại thứ tự.

**Request**
```json
[
  { "id": "uuid1", "sortOrder": 1 },
  { "id": "uuid2", "sortOrder": 2 }
]
```

### POST /banners/upload

Upload ảnh banner. Gửi `multipart/form-data`, field `file`.

**Response 200**
```json
{ "success": true, "data": { "url": "/uploads/banners/abc123.jpg" } }
```

### DELETE /banners/:id

---

## 9. Articles — Bài viết

### GET /articles

**Query params**: `page` · `limit` · `search` · `status` · `category`

> `category`: `Hướng dẫn` · `Tin tức` · `Khuyến mãi` · `Cập nhật` · `Bảo mật`

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Hướng dẫn kích hoạt Windows",
      "slug": "huong-dan-kich-hoat-windows",
      "excerpt": "Mô tả ngắn...",
      "content": "<p>Nội dung HTML</p>",
      "category": "Hướng dẫn",
      "status": "DaXuatBan",
      "author": "Admin",
      "thumbnail": "/uploads/...",
      "tags": ["windows", "kích hoạt"],
      "views": 1500,
      "publishedAt": "2024-05-01T00:00:00Z",
      "scheduledAt": null,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "meta": { "total": 50, "page": 1, "limit": 10, "totalPages": 5 }
}
```

### GET /articles/:id

### GET /articles/slug/:slug

> **Public** — không cần token. Tự động tăng `views`.

### POST /articles

**Request**
```json
{
  "title": "Hướng dẫn kích hoạt Windows",
  "slug": "huong-dan-kich-hoat-windows",
  "excerpt": "Mô tả ngắn bài viết",
  "content": "<p>Nội dung HTML</p>",
  "category": "Hướng dẫn",
  "status": "Nhap",
  "author": "Admin",
  "thumbnail": "/uploads/...",
  "tags": ["windows", "kích hoạt"],
  "scheduledAt": null
}
```

### PATCH /articles/:id

### POST /articles/:id/publish

Xuất bản bài viết ngay lập tức.

### DELETE /articles/:id

---

## 10. Static Pages — Trang tĩnh

### GET /pages

Trả về toàn bộ danh sách (không phân trang).

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Chính sách bảo mật",
      "slug": "/chinh-sach-bao-mat",
      "description": "Meta description SEO",
      "content": "<p>Nội dung HTML</p>",
      "status": "HienThi",
      "isSystem": true,
      "wordCount": 350,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### GET /pages/:id

### GET /pages/slug/:slug

> **Public** — không cần token.

### POST /pages

**Request**
```json
{
  "title": "Điều khoản sử dụng",
  "slug": "/dieu-khoan-su-dung",
  "description": "Meta description",
  "content": "<p>Nội dung</p>",
  "status": "HienThi"
}
```

### PATCH /pages/:id

### DELETE /pages/:id

> Lỗi `422` nếu `isSystem = true`.

---

## 11. FAQ

### GET /faq

**Query params**: `page` · `limit` · `search` · `status` · `category`

> `category`: `Sản phẩm` · `Thanh toán` · `Key & Kích hoạt` · `Bảo hành` · `Khác`

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "question": "Làm thế nào để kích hoạt key?",
      "answer": "Bạn vào Settings → ...",
      "category": "Key & Kích hoạt",
      "status": "HienThi",
      "sortOrder": 1,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "meta": { "total": 30, "page": 1, "limit": 10, "totalPages": 3 }
}
```

### GET /faq/:id

### POST /faq

**Request**
```json
{
  "question": "Làm thế nào để kích hoạt key?",
  "answer": "Bạn vào Settings → ...",
  "category": "Key & Kích hoạt",
  "status": "HienThi",
  "sortOrder": 1
}
```

### PATCH /faq/:id

### PATCH /faq/:id/toggle

Bật/tắt hiển thị FAQ.

### PATCH /faq/reorder

**Request**
```json
[
  { "id": "uuid1", "sortOrder": 1 },
  { "id": "uuid2", "sortOrder": 2 }
]
```

### DELETE /faq/:id

---

## 12. Activity Logs — Nhật ký hoạt động

### GET /logs

**Query params**: `page` · `limit` · `search` · `type` · `is_read` (true/false)

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "Order",
      "title": "Đơn hàng mới",
      "description": "Đơn hàng ORD-123456 được tạo",
      "adminId": "uuid",
      "adminName": "Super Admin",
      "meta": { "orderId": "ORD-123456" },
      "isRead": false,
      "createdAt": "..."
    }
  ],
  "meta": { "total": 500, "page": 1, "limit": 10, "totalPages": 50 }
}
```

### PATCH /logs/:id/read

Đánh dấu 1 log đã đọc.

### PATCH /logs/read-all

Đánh dấu tất cả đã đọc.

### DELETE /logs

Xóa log cũ.

**Request**
```json
{ "beforeDays": 30 }
```

---

## 13. Roles & Admins

### GET /roles

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Super Admin",
      "description": "Toàn quyền hệ thống",
      "color": "#dc2626",
      "permissions": ["*"],
      "isSystem": true,
      "adminCount": 1,
      "createdAt": "..."
    }
  ]
}
```

### POST /roles

**Request**
```json
{
  "name": "Editor",
  "description": "Quản lý nội dung",
  "color": "#16a34a",
  "permissions": ["articles", "pages", "faq", "banners"]
}
```

### PATCH /roles/:id

### DELETE /roles/:id

> Lỗi `422` nếu `isSystem = true` hoặc còn admin đang dùng role này.

---

### GET /admins

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Nguyễn Admin",
      "email": "admin@nexkey.vn",
      "roleId": "uuid",
      "roleName": "Super Admin",
      "status": "HoatDong",
      "lastLogin": "2024-05-27T10:00:00Z",
      "createdAt": "..."
    }
  ]
}
```

### POST /admins

**Request**
```json
{
  "name": "Nguyễn Admin",
  "email": "admin2@nexkey.vn",
  "password": "Pass@123456",
  "roleId": "uuid"
}
```

### PATCH /admins/:id/role

**Request**
```json
{ "roleId": "uuid" }
```

### PATCH /admins/:id/lock

**Request**
```json
{ "locked": true }
```

### DELETE /admins/:id

> Lỗi `422` nếu là Super Admin đầu tiên của hệ thống.

---

## 14. Settings — Cài đặt

### GET /settings

Trả về tất cả cài đặt nhóm theo group.

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "group": "general",
      "settings": {
        "shop_name": "NexKey",
        "shop_domain": "nexkey.vn",
        "shop_email": "contact@nexkey.vn",
        "maintenance_mode": "false",
        "auto_deliver_key": "false"
      }
    },
    {
      "group": "seo",
      "settings": {
        "meta_title": "NexKey - Cung cấp key bản quyền",
        "meta_description": "...",
        "google_analytics_id": ""
      }
    },
    {
      "group": "email",
      "settings": {
        "smtp_host": "",
        "smtp_port": "587",
        "smtp_username": "",
        "smtp_password": ""
      }
    },
    {
      "group": "theme",
      "settings": {
        "primary_color": "#0078d4",
        "accent_color": "#00b4d8"
      }
    }
  ]
}
```

### GET /settings/:group

Lấy settings của 1 group (`general` · `seo` · `email` · `theme`).

### PATCH /settings

Cập nhật một hoặc nhiều settings.

**Request**
```json
{
  "shop_name": "NexKey Store",
  "primary_color": "#1d4ed8",
  "maintenance_mode": "true"
}
```

### POST /settings/email/test

Gửi email test với cấu hình SMTP hiện tại.

**Request**
```json
{ "to": "test@gmail.com" }
```

---

## 15. Payment Gateways — Cổng thanh toán

### GET /payments/gateways

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": "vnpay",
      "name": "VNPay",
      "enabled": false,
      "testMode": true,
      "merchantId": null,
      "webhookUrl": null,
      "updatedAt": "..."
    },
    { "id": "momo", "name": "MoMo", "enabled": false, "testMode": true, ... },
    { "id": "banking", "name": "Banking", "enabled": true, "testMode": false, ... },
    { "id": "card", "name": "Card", "enabled": false, "testMode": true, ... }
  ]
}
```

> `secretKey` không được trả về trong response vì lý do bảo mật.

### PATCH /payments/gateways/:id

**Request**
```json
{
  "enabled": true,
  "testMode": false,
  "merchantId": "MERCHANT_ID_HERE",
  "secretKey": "SECRET_KEY_HERE",
  "webhookUrl": "https://api.nexkey.vn/webhooks/vnpay"
}
```

### POST /payments/gateways/:id/test

Kiểm tra kết nối cổng thanh toán.

**Response 200**
```json
{ "success": true, "data": { "success": true, "message": "Kết nối thành công" } }
```

### GET /payments/stats

Thống kê doanh thu theo phương thức thanh toán.

**Response 200**
```json
{
  "success": true,
  "data": {
    "byMethod": [
      { "method": "VNPay", "count": 85, "revenue": 42500000 },
      { "method": "Banking", "count": 30, "revenue": 15000000 },
      { "method": "MoMo", "count": 5, "revenue": 2500000 }
    ],
    "totalRevenue": 60000000,
    "totalOrders": 120
  }
}
```

---

## Ví dụ tích hợp (JavaScript/TypeScript)

```typescript
const API = 'http://localhost:5000/v1'

// Lưu token sau login
async function login(email: string, password: string) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const data = await res.json()
  if (data.success) {
    localStorage.setItem('token', data.data.token)
  }
  return data
}

// Helper gọi API có auth
async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  })
  return res.json()
}

// Ví dụ sử dụng
const orders = await apiFetch('/orders?page=1&limit=10&status=HoanThanh')
const order  = await apiFetch('/orders/ORD-123456')

await apiFetch('/orders/ORD-123456', {
  method: 'PATCH',
  body: JSON.stringify({ status: 'HoanThanh' })
})
```
