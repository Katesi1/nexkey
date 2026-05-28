import type {
  Order,
  Product,
  Category,
  Customer,
  Supplier,
  WarehouseItem,
  LicenseKey,
  Banner,
  Activity,
  RevenuePoint,
  PaymentStat,
} from "./types";

// - Revenue Chart Data -

export const revenueWeekly: RevenuePoint[] = [
  { label: "25/06", revenue: 28_000_000, orders: 82 },
  { label: "26/06", revenue: 22_000_000, orders: 65 },
  { label: "27/06", revenue: 48_000_000, orders: 140 },
  { label: "28/06", revenue: 65_420_000, orders: 189 },
  { label: "29/06", revenue: 72_000_000, orders: 208 },
  { label: "30/06", revenue: 68_000_000, orders: 196 },
  { label: "01/07", revenue: 85_000_000, orders: 246 },
];

export const revenue1Month: RevenuePoint[] = [
  { label: "T1", revenue: 45_000_000, orders: 130 },
  { label: "T2", revenue: 58_000_000, orders: 168 },
  { label: "T3", revenue: 52_000_000, orders: 150 },
  { label: "T4", revenue: 75_000_000, orders: 217 },
];

export const revenue3Months: RevenuePoint[] = [
  { label: "Th4", revenue: 185_000_000, orders: 540 },
  { label: "Th5", revenue: 230_000_000, orders: 668 },
  { label: "Th6", revenue: 268_000_000, orders: 778 },
];

export const revenue6Months: RevenuePoint[] = [
  { label: "Th1", revenue: 140_000_000, orders: 410 },
  { label: "Th2", revenue: 165_000_000, orders: 480 },
  { label: "Th3", revenue: 155_000_000, orders: 450 },
  { label: "Th4", revenue: 185_000_000, orders: 540 },
  { label: "Th5", revenue: 230_000_000, orders: 668 },
  { label: "Th6", revenue: 268_000_000, orders: 778 },
];

export const revenueMonthly: RevenuePoint[] = [
  { label: "T1", revenue: 185_000_000, orders: 520 },
  { label: "T2", revenue: 210_000_000, orders: 610 },
  { label: "T3", revenue: 198_000_000, orders: 578 },
  { label: "T4", revenue: 245_000_000, orders: 720 },
  { label: "T5", revenue: 268_000_000, orders: 785 },
  { label: "T6", revenue: 312_000_000, orders: 910 },
  { label: "T7", revenue: 295_000_000, orders: 865 },
  { label: "T8", revenue: 340_000_000, orders: 1020 },
  { label: "T9", revenue: 325_000_000, orders: 965 },
  { label: "T10", revenue: 380_000_000, orders: 1100 },
  { label: "T11", revenue: 420_000_000, orders: 1230 },
  { label: "T12", revenue: 485_000_000, orders: 1450 },
];

// - Payment Stats -

export const paymentStats: PaymentStat[] = [
  { method: "Banking", count: 512, total: 142_000_000, percentage: 41 },
  { method: "VNPay", count: 348, total: 98_000_000, percentage: 28 },
  { method: "MoMo", count: 248, total: 68_000_000, percentage: 20 },
  { method: "Card", count: 140, total: 36_000_000, percentage: 11 },
];

// - Categories -

export const categories: Category[] = [
  { id: "cat-1", name: "Windows", slug: "windows", icon: "🪟", color: "#0078d4", productCount: 8, status: "Hiển thị", createdAt: "2024-01-10T08:00:00Z" },
  { id: "cat-2", name: "Microsoft Office", slug: "microsoft-office", icon: "📊", color: "#d83b01", productCount: 6, status: "Hiển thị", createdAt: "2024-01-10T08:00:00Z" },
  { id: "cat-3", name: "Google", slug: "google", icon: "🔍", color: "#4285f4", productCount: 4, status: "Hiển thị", createdAt: "2024-01-12T09:00:00Z" },
  { id: "cat-4", name: "YouTube Premium", slug: "youtube-premium", icon: "▶️", color: "#ff0000", productCount: 3, status: "Hiển thị", createdAt: "2024-01-12T09:00:00Z" },
  { id: "cat-5", name: "Spotify", slug: "spotify", icon: "🎵", color: "#1db954", productCount: 2, status: "Hiển thị", createdAt: "2024-01-15T10:00:00Z" },
  { id: "cat-6", name: "Netflix", slug: "netflix", icon: "🎬", color: "#e50914", productCount: 2, status: "Hiển thị", createdAt: "2024-01-15T10:00:00Z" },
  { id: "cat-7", name: "Canva Pro", slug: "canva-pro", icon: "🎨", color: "#00c4cc", productCount: 1, status: "Hiển thị", createdAt: "2024-01-18T11:00:00Z" },
  { id: "cat-8", name: "Phần mềm khác", slug: "other-software", icon: "📦", color: "#8b5cf6", productCount: 12, status: "Hiển thị", createdAt: "2024-01-20T12:00:00Z" },
  { id: "cat-9", name: "Key Windows", slug: "key-windows", icon: "🔑", color: "#0078d4", productCount: 3, status: "Hiển thị", createdAt: "2024-01-22T09:00:00Z" },
  { id: "cat-10", name: "Key Office", slug: "key-office", icon: "🗝️", color: "#d83b01", productCount: 1, status: "Hiển thị", createdAt: "2024-01-22T09:00:00Z" },
  { id: "cat-11", name: "Phần mềm diệt virus", slug: "antivirus", icon: "🛡️", color: "#10b981", productCount: 4, status: "Hiển thị", createdAt: "2024-02-01T08:00:00Z" },
  { id: "cat-12", name: "Khác", slug: "other", icon: "💼", color: "#64748b", productCount: 7, status: "Ẩn", createdAt: "2024-02-05T10:00:00Z" },
];

// - Products -

export const products: Product[] = [
  { id: "p-1", name: "Windows 11 Pro", sku: "WIN11PRO", categoryId: "cat-1", categoryName: "Windows", type: "Windows Key", price: 245_000, stock: 98, sold: 412, status: "Đang bán", createdAt: "2024-01-15T08:00:00Z" },
  { id: "p-2", name: "Office 365 Pro Plus", sku: "O365PP", categoryId: "cat-2", categoryName: "Microsoft Office", type: "Office Key", price: 285_000, stock: 45, sold: 316, status: "Đang bán", createdAt: "2024-01-16T08:00:00Z" },
  { id: "p-3", name: "Windows 10 Pro", sku: "WIN10PRO", categoryId: "cat-1", categoryName: "Windows", type: "Windows Key", price: 180_000, stock: 123, sold: 768, status: "Đang bán", createdAt: "2024-01-17T08:00:00Z" },
  { id: "p-4", name: "Office 2021 Professional", sku: "OFF2021PRO", categoryId: "cat-2", categoryName: "Microsoft Office", type: "Office Key", price: 350_000, stock: 23, sold: 198, status: "Đang bán", createdAt: "2024-01-18T08:00:00Z" },
  { id: "p-5", name: "Google One 100GB", sku: "GONE100", categoryId: "cat-3", categoryName: "Google", type: "Subscription", price: 35_000, stock: 200, sold: 892, status: "Đang bán", createdAt: "2024-01-20T08:00:00Z" },
  { id: "p-6", name: "YouTube Premium 1 năm", sku: "YTP1Y", categoryId: "cat-4", categoryName: "YouTube Premium", type: "Subscription", price: 149_000, stock: 80, sold: 316, status: "Đang bán", createdAt: "2024-01-21T08:00:00Z" },
  { id: "p-7", name: "Spotify Premium 3 tháng", sku: "SPT3M", categoryId: "cat-5", categoryName: "Spotify", type: "Subscription", price: 89_000, stock: 150, sold: 245, status: "Đang bán", createdAt: "2024-01-22T08:00:00Z" },
  { id: "p-8", name: "Adobe Creative Cloud", sku: "ADCC1Y", categoryId: "cat-8", categoryName: "Phần mềm khác", type: "Subscription", price: 890_000, stock: 12, sold: 87, status: "Đang bán", createdAt: "2024-01-25T08:00:00Z" },
  { id: "p-9", name: "Kaspersky Total Security", sku: "KASTS1Y", categoryId: "cat-11", categoryName: "Phần mềm diệt virus", type: "Antivirus", price: 285_000, stock: 60, sold: 134, status: "Đang bán", createdAt: "2024-01-28T08:00:00Z" },
  { id: "p-10", name: "ESET Internet Security", sku: "ESET1Y", categoryId: "cat-11", categoryName: "Phần mềm diệt virus", type: "Antivirus", price: 320_000, stock: 0, sold: 67, status: "Hết hàng", createdAt: "2024-02-01T08:00:00Z" },
  { id: "p-11", name: "Netflix Premium 1 tháng", sku: "NETFPREM", categoryId: "cat-6", categoryName: "Netflix", type: "Account", price: 180_000, stock: 35, sold: 278, status: "Đang bán", createdAt: "2024-02-05T08:00:00Z" },
  { id: "p-12", name: "Canva Pro 1 năm", sku: "CANVA1Y", categoryId: "cat-7", categoryName: "Canva Pro", type: "Subscription", price: 199_000, stock: 45, sold: 215, status: "Đang bán", createdAt: "2024-02-10T08:00:00Z" },
];

// - Customers -

export const customers: Customer[] = [
  { id: "c-1", fullName: "Nguyễn Văn An", email: "nguyenvanan@gmail.com", phone: "0912 456 789", totalOrders: 24, totalSpending: 12_400_000, status: "VIP", joinedAt: "2023-05-12T08:00:00Z" },
  { id: "c-2", fullName: "Trần Thị Bình", email: "tranthibinh@gmail.com", phone: "0987 654 321", totalOrders: 8, totalSpending: 3_200_000, status: "Hoạt động", joinedAt: "2023-08-20T08:00:00Z" },
  { id: "c-3", fullName: "Lê Hoàng", email: "lehoang@gmail.com", phone: "0901 234 567", totalOrders: 31, totalSpending: 18_500_000, status: "VIP", joinedAt: "2023-03-14T08:00:00Z" },
  { id: "c-4", fullName: "Phạm Thị Cúc", email: "phamthicuc@gmail.com", phone: "0945 678 901", totalOrders: 5, totalSpending: 1_850_000, status: "Hoạt động", joinedAt: "2024-01-05T08:00:00Z" },
  { id: "c-5", fullName: "Hoàng Tuấn", email: "hoangtuan@gmail.com", phone: "0935 890 123", totalOrders: 16, totalSpending: 6_400_000, status: "Hoạt động", joinedAt: "2023-11-22T08:00:00Z" },
  { id: "c-6", fullName: "Vũ Thị Mai", email: "vuthimai@gmail.com", phone: "0978 345 678", totalOrders: 2, totalSpending: 480_000, status: "Bị khóa", joinedAt: "2024-02-10T08:00:00Z" },
  { id: "c-7", fullName: "Đặng Thảo", email: "dangthao@gmail.com", phone: "0968 901 234", totalOrders: 41, totalSpending: 21_200_000, status: "VIP", joinedAt: "2022-12-01T08:00:00Z" },
  { id: "c-8", fullName: "Bùi Văn Khánh", email: "buivankhanh@gmail.com", phone: "0921 567 890", totalOrders: 7, totalSpending: 2_100_000, status: "Hoạt động", joinedAt: "2024-01-18T08:00:00Z" },
  { id: "c-9", fullName: "Quang Yến", email: "quangyen@gmail.com", phone: "0900 012 345", totalOrders: 12, totalSpending: 4_800_000, status: "Hoạt động", joinedAt: "2023-09-30T08:00:00Z" },
  { id: "c-10", fullName: "Trương Thị Lan", email: "truongthilan@gmail.com", phone: "0956 789 012", totalOrders: 19, totalSpending: 8_900_000, status: "VIP", joinedAt: "2023-06-15T08:00:00Z" },
];

// - Suppliers -

export const suppliers: Supplier[] = [
  { id: "s-1", companyName: "Microsoft Việt Nam", taxCode: "0101234567", contactPerson: "Nguyễn Quân", email: "partner.vn@microsoft.com", phone: "024 3938 5768", suppliedProducts: 12, debt: 0, status: "Đang hợp tác", createdAt: "2024-01-01T08:00:00Z" },
  { id: "s-2", companyName: "Google LLC Vietnam", taxCode: "0312456789", contactPerson: "Hoàng MyBi", email: "dealer.vn@google.com", phone: "028 3930 6789", suppliedProducts: 6, debt: 15_000_000, status: "Đang hợp tác", createdAt: "2024-01-05T08:00:00Z" },
  { id: "s-3", companyName: "IVT Software Distribution", taxCode: "0201234567", contactPerson: "Lê Trung", email: "info@ivtsoftware.vn", phone: "024 3750 0000", suppliedProducts: 0, debt: 0, status: "Chờ duyệt", createdAt: "2024-02-20T08:00:00Z" },
  { id: "s-4", companyName: "Adobe Systems Vietnam", taxCode: "0412345678", contactPerson: "Phạm Duy An", email: "partner@adobe.vn", phone: "028 7300 9999", suppliedProducts: 3, debt: 8_000_000, status: "Đang hợp tác", createdAt: "2024-01-12T08:00:00Z" },
  { id: "s-5", companyName: "Kaspersky Lab Vietnam", taxCode: "0512345678", contactPerson: "Huỳnh Phi", email: "partners@kaspersky.vn", phone: "024 3730 5000", suppliedProducts: 4, debt: 0, status: "Đang hợp tác", createdAt: "2024-01-15T08:00:00Z" },
  { id: "s-6", companyName: "NetSolu Vietnam", taxCode: "0612345678", contactPerson: "Nguyễn Văn Đức", email: "netsolu@netsolu.vn", phone: "024 1520 0000", suppliedProducts: 8, debt: 22_000_000, status: "Tạm ngưng", createdAt: "2023-11-01T08:00:00Z" },
  { id: "s-7", companyName: "VietSoft Technology", taxCode: "0712345678", contactPerson: "Tú Liên", email: "contact@vietsoft.vn", phone: "024 3729 3000", suppliedProducts: 0, debt: 0, status: "Chờ duyệt", createdAt: "2024-03-01T08:00:00Z" },
];

// - Warehouse Items -

export const warehouseItems: WarehouseItem[] = [
  { id: "w-1", productId: "p-1", productName: "Windows 11 Pro", sku: "WIN11PRO", warehouse: "Kho chính", quantity: 98, unit: "Key", costPrice: 180_000, inventoryValue: 17_640_000, status: "Còn hàng", updatedAt: "2024-05-26T08:00:00Z" },
  { id: "w-2", productId: "p-2", productName: "Office 365 Pro Plus", sku: "O365PP", warehouse: "Kho chính", quantity: 45, unit: "Key", costPrice: 210_000, inventoryValue: 9_450_000, status: "Còn hàng", updatedAt: "2024-05-26T08:00:00Z" },
  { id: "w-3", productId: "p-3", productName: "Windows 10 Pro", sku: "WIN10PRO", warehouse: "Kho chính", quantity: 123, unit: "Key", costPrice: 130_000, inventoryValue: 15_990_000, status: "Còn hàng", updatedAt: "2024-05-26T08:00:00Z" },
  { id: "w-4", productId: "p-4", productName: "Office 2021 Professional", sku: "OFF2021PRO", warehouse: "Kho chính", quantity: 23, unit: "Key", costPrice: 260_000, inventoryValue: 5_980_000, status: "Sắp hết", updatedAt: "2024-05-25T08:00:00Z" },
  { id: "w-5", productId: "p-5", productName: "Google One 100GB", sku: "GONE100", warehouse: "Kho đối tác", quantity: 200, unit: "Acc", costPrice: 25_000, inventoryValue: 5_000_000, status: "Còn hàng", updatedAt: "2024-05-24T08:00:00Z" },
  { id: "w-6", productId: "p-6", productName: "YouTube Premium 1 năm", sku: "YTP1Y", warehouse: "Kho chính", quantity: 80, unit: "Acc", costPrice: 110_000, inventoryValue: 8_800_000, status: "Còn hàng", updatedAt: "2024-05-26T08:00:00Z" },
  { id: "w-7", productId: "p-7", productName: "Spotify Premium 3 tháng", sku: "SPT3M", warehouse: "Kho đối tác", quantity: 150, unit: "Acc", costPrice: 65_000, inventoryValue: 9_750_000, status: "Còn hàng", updatedAt: "2024-05-23T08:00:00Z" },
  { id: "w-8", productId: "p-8", productName: "Adobe Creative Cloud", sku: "ADCC1Y", warehouse: "Kho chính", quantity: 12, unit: "Key", costPrice: 650_000, inventoryValue: 7_800_000, status: "Sắp hết", updatedAt: "2024-05-20T08:00:00Z" },
  { id: "w-9", productId: "p-9", productName: "Kaspersky Total Security", sku: "KASTS1Y", warehouse: "Kho chi nhánh", quantity: 60, unit: "Key", costPrice: 210_000, inventoryValue: 12_600_000, status: "Còn hàng", updatedAt: "2024-05-26T08:00:00Z" },
  { id: "w-10", productId: "p-10", productName: "ESET Internet Security", sku: "ESET1Y", warehouse: "Kho chính", quantity: 0, unit: "Key", costPrice: 240_000, inventoryValue: 0, status: "Hết hàng", updatedAt: "2024-05-15T08:00:00Z" },
];

// - License Keys -

export const licenseKeys: LicenseKey[] = [
  { id: "k-1", key: "NEXK-WIN11-A8B2-C4D6", productId: "p-1", productName: "Windows 11 Pro", customerId: "c-1", customerName: "Nguyễn Văn An", orderId: "ORD-A8B2C4", activatedAt: "2024-03-15T10:00:00Z", expiresAt: "2025-03-15T10:00:00Z", status: "Hoạt động", createdAt: "2024-03-15T09:00:00Z" },
  { id: "k-2", key: "NEXK-OFF365-R7S9-T1U3", productId: "p-2", productName: "Office 365 Pro Plus", customerId: "c-3", customerName: "Lê Hoàng", orderId: "ORD-R7S9T1", activatedAt: "2024-04-01T09:00:00Z", expiresAt: "2024-06-15T09:00:00Z", status: "Sắp hết hạn", createdAt: "2024-04-01T08:00:00Z" },
  { id: "k-3", key: "NEXK-WIN11-P2Q4-M6N8", productId: "p-1", productName: "Windows 11 Pro", customerId: "c-7", customerName: "Đặng Thảo", orderId: "ORD-P2Q4M6", activatedAt: "2023-12-01T08:00:00Z", expiresAt: "2024-12-01T08:00:00Z", status: "Hoạt động", createdAt: "2023-12-01T07:00:00Z" },
  { id: "k-4", key: "NEXK-YTP-X5Y7-Z9W1", productId: "p-6", productName: "YouTube Premium 1 năm", customerId: "c-5", customerName: "Hoàng Tuấn", orderId: "ORD-X5Y7Z9", activatedAt: "2023-06-01T08:00:00Z", expiresAt: "2024-06-01T08:00:00Z", status: "Đã hết hạn", createdAt: "2023-06-01T07:00:00Z" },
  { id: "k-5", key: "NEXK-WIN10-K3L5-J7H9", productId: "p-3", productName: "Windows 10 Pro", customerId: "c-2", customerName: "Trần Thị Bình", orderId: "ORD-K3L5J7", activatedAt: "2024-05-10T08:00:00Z", expiresAt: "2025-05-10T08:00:00Z", status: "Hoạt động", createdAt: "2024-05-10T07:00:00Z" },
  { id: "k-6", key: "NEXK-OFF21-F4G6-E8D2", productId: "p-4", productName: "Office 2021 Professional", status: "Chưa kích hoạt", createdAt: "2024-05-20T08:00:00Z" },
  { id: "k-7", key: "NEXK-WIN11-B1C3-D5E7", productId: "p-1", productName: "Windows 11 Pro", customerId: "c-9", customerName: "Quang Yến", orderId: "ORD-B1C3D5", activatedAt: "2024-01-20T08:00:00Z", expiresAt: "2025-01-20T08:00:00Z", status: "Bị khóa", createdAt: "2024-01-20T07:00:00Z" },
  { id: "k-8", key: "NEXK-KAS-G8H2-I4J6", productId: "p-9", productName: "Kaspersky Total Security", customerId: "c-10", customerName: "Trương Thị Lan", orderId: "ORD-G8H2I4", activatedAt: "2024-04-25T08:00:00Z", expiresAt: "2025-04-25T08:00:00Z", status: "Hoạt động", createdAt: "2024-04-25T07:00:00Z" },
  { id: "k-9", key: "NEXK-SPT-N2O4-P6Q8", productId: "p-7", productName: "Spotify Premium 3 tháng", status: "Chưa kích hoạt", createdAt: "2024-05-22T08:00:00Z" },
  { id: "k-10", key: "NEXK-ADCC-R5S7-T9U3", productId: "p-8", productName: "Adobe Creative Cloud", customerId: "c-4", customerName: "Phạm Thị Cúc", orderId: "ORD-R5S7T9", activatedAt: "2024-05-01T08:00:00Z", expiresAt: "2025-05-01T08:00:00Z", status: "Hoạt động", createdAt: "2024-05-01T07:00:00Z" },
];

// - Orders -

export const orders: Order[] = [
  {
    id: "ORD-A8B2C4", customerId: "c-1", customerName: "Nguyễn Văn An",
    customerEmail: "nguyenvanan@gmail.com", customerPhone: "0912 456 789",
    items: [{ productId: "p-1", name: "Windows 11 Pro", price: 245_000, quantity: 1, licenseKey: "NEXK-WIN11-A8B2-C4D6" }],
    total: 245_000, discount: 0, paymentMethod: "VNPay", status: "Hoàn thành", createdAt: "2024-05-27T10:32:00Z",
  },
  {
    id: "ORD-R7S9T1", customerId: "c-3", customerName: "Lê Hoàng",
    customerEmail: "lehoang@gmail.com", customerPhone: "0901 234 567",
    items: [{ productId: "p-2", name: "Office 365 Pro Plus", price: 285_000, quantity: 1, licenseKey: "NEXK-OFF365-R7S9-T1U3" }],
    total: 285_000, discount: 0, paymentMethod: "Banking", status: "Hoàn thành", createdAt: "2024-05-27T09:15:00Z",
  },
  {
    id: "ORD-M4N6O8", customerId: "c-5", customerName: "Hoàng Tuấn",
    customerEmail: "hoangtuan@gmail.com", customerPhone: "0935 890 123",
    items: [
      { productId: "p-6", name: "YouTube Premium 1 năm", price: 149_000, quantity: 1 },
      { productId: "p-7", name: "Spotify Premium 3 tháng", price: 89_000, quantity: 1 },
    ],
    total: 238_000, discount: 0, paymentMethod: "MoMo", status: "Đang xử lý", createdAt: "2024-05-27T08:50:00Z",
  },
  {
    id: "ORD-K3L5J7", customerId: "c-2", customerName: "Trần Thị Bình",
    customerEmail: "tranthibinh@gmail.com", customerPhone: "0987 654 321",
    items: [{ productId: "p-3", name: "Windows 10 Pro", price: 180_000, quantity: 1, licenseKey: "NEXK-WIN10-K3L5-J7H9" }],
    total: 180_000, discount: 0, paymentMethod: "VNPay", status: "Hoàn thành", createdAt: "2024-05-26T16:20:00Z",
  },
  {
    id: "ORD-P9Q1R3", customerId: "c-7", customerName: "Đặng Thảo",
    customerEmail: "dangthao@gmail.com", customerPhone: "0968 901 234",
    items: [{ productId: "p-8", name: "Adobe Creative Cloud", price: 890_000, quantity: 1 }],
    total: 890_000, discount: 89_000, paymentMethod: "Card", status: "Đang xử lý", createdAt: "2024-05-26T14:05:00Z",
  },
  {
    id: "ORD-S4T6U8", customerId: "c-4", customerName: "Phạm Thị Cúc",
    customerEmail: "phamthicuc@gmail.com", customerPhone: "0945 678 901",
    items: [{ productId: "p-5", name: "Google One 100GB", price: 35_000, quantity: 2 }],
    total: 70_000, discount: 0, paymentMethod: "MoMo", status: "Hoàn thành", createdAt: "2024-05-26T11:30:00Z",
  },
  {
    id: "ORD-V2W4X6", customerId: "c-9", customerName: "Quang Yến",
    customerEmail: "quangyen@gmail.com", customerPhone: "0900 012 345",
    items: [{ productId: "p-12", name: "Canva Pro 1 năm", price: 199_000, quantity: 1 }],
    total: 199_000, discount: 0, paymentMethod: "Banking", status: "Chờ thanh toán", createdAt: "2024-05-26T10:15:00Z",
  },
  {
    id: "ORD-Y1Z3A5", customerId: "c-6", customerName: "Vũ Thị Mai",
    customerEmail: "vuthimai@gmail.com", customerPhone: "0978 345 678",
    items: [{ productId: "p-11", name: "Netflix Premium 1 tháng", price: 180_000, quantity: 1 }],
    total: 180_000, discount: 0, paymentMethod: "VNPay", status: "Đã hủy", createdAt: "2024-05-25T15:00:00Z",
  },
  {
    id: "ORD-B7C9D2", customerId: "c-10", customerName: "Trương Thị Lan",
    customerEmail: "truongthilan@gmail.com", customerPhone: "0956 789 012",
    items: [{ productId: "p-9", name: "Kaspersky Total Security", price: 285_000, quantity: 1, licenseKey: "NEXK-KAS-G8H2-I4J6" }],
    total: 285_000, discount: 0, paymentMethod: "Banking", status: "Hoàn thành", createdAt: "2024-05-25T09:40:00Z",
  },
  {
    id: "ORD-E4F6G8", customerId: "c-8", customerName: "Bùi Văn Khánh",
    customerEmail: "buivankhanh@gmail.com", customerPhone: "0921 567 890",
    items: [{ productId: "p-4", name: "Office 2021 Professional", price: 350_000, quantity: 1 }],
    total: 350_000, discount: 0, paymentMethod: "MoMo", status: "Hoàn tiền", createdAt: "2024-05-24T13:20:00Z",
  },
];

// - Banners -

export const banners: Banner[] = [
  { id: "b-1", title: "Windows 11 Pro - Giá cực hot!", image: "/banners/win11.jpg", link: "/products/windows-11-pro", position: "Trang chủ - Hero", sortOrder: 1, status: "Hiển thị", createdAt: "2024-05-01T08:00:00Z" },
  { id: "b-2", title: "Office 365 - Combo tiết kiệm", image: "/banners/office365.jpg", link: "/products/office-365", position: "Trang chủ - Hero", sortOrder: 2, status: "Hiển thị", createdAt: "2024-05-05T08:00:00Z" },
  { id: "b-3", title: "Ưu đãi cuối tuần - Giảm 20%", image: "/banners/weekend.jpg", link: "/products", position: "Trang chủ - Banner", sortOrder: 1, status: "Hiển thị", createdAt: "2024-05-10T08:00:00Z" },
  { id: "b-4", title: "Adobe Creative Cloud - Bản quyền chính hãng", image: "/banners/adobe.jpg", link: "/products/adobe-creative-cloud", position: "Trang sản phẩm", sortOrder: 1, status: "Ẩn", createdAt: "2024-05-15T08:00:00Z" },
];

// - Activities -

export const activities: Activity[] = [
  { id: "a-1", type: "order", title: "Đơn hàng mới", description: "Nguyễn Văn An đặt Windows 11 Pro", createdAt: "2024-05-27T10:32:00Z", meta: { orderId: "ORD-A8B2C4" } },
  { id: "a-2", type: "customer", title: "Khách hàng mới", description: "Bùi Văn Khánh vừa đăng ký tài khoản", createdAt: "2024-05-27T09:50:00Z" },
  { id: "a-3", type: "key", title: "Key đã giao", description: "Key Windows 11 Pro đã được giao cho Nguyễn Văn An", createdAt: "2024-05-27T10:33:00Z" },
  { id: "a-4", type: "payment", title: "Thanh toán thành công", description: "ORD-R7S9T1 thanh toán qua Banking - 285.000đ", createdAt: "2024-05-27T09:15:00Z" },
  { id: "a-5", type: "product", title: "Sản phẩm mới", description: "Canva Pro 1 năm vừa được thêm vào", createdAt: "2024-05-26T15:00:00Z" },
  { id: "a-6", type: "order", title: "Đơn hàng bị hủy", description: "ORD-Y1Z3A5 bị hủy bởi Vũ Thị Mai", createdAt: "2024-05-25T15:05:00Z" },
  { id: "a-7", type: "admin", title: "Cập nhật giá", description: "Windows 11 Pro được cập nhật giá từ 250.000đ → 245.000đ", createdAt: "2024-05-25T10:00:00Z" },
];

// - Top Products -

export const topProducts = [
  { id: "p-3", name: "Windows 10 Pro", category: "Windows", sold: 768, revenue: 138_240_000, icon: "windows", color: "#0078d4" },
  { id: "p-2", name: "Office 365 Pro Plus", category: "Microsoft Office", sold: 316, revenue: 90_060_000, icon: "office", color: "#d83b01" },
  { id: "p-6", name: "YouTube Premium", category: "YouTube", sold: 316, revenue: 47_084_000, icon: "youtube", color: "#ff0000" },
  { id: "p-5", name: "Google One 100GB", category: "Google", sold: 892, revenue: 31_220_000, icon: "google-one", color: "#4285f4" },
  { id: "p-1", name: "Windows 11 Pro", category: "Windows", sold: 412, revenue: 100_940_000, icon: "windows", color: "#0078d4" },
];
