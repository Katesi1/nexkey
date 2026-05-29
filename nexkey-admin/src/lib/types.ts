// - Order Types -

export type OrderStatus = "Hoàn thành" | "Đang xử lý" | "Đã hủy" | "Hoàn tiền" | "Chờ thanh toán";

export type PaymentMethod = "VNPay" | "MoMo" | "Banking" | "Card" | "Tiền mặt";

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  licenseKey?: string;
};

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  discount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  note?: string;
};

// - Product Types -

export type ProductType = "Windows Key" | "Office Key" | "Subscription" | "Account" | "Antivirus";

export type ProductStatus = "Đang bán" | "Hết hàng" | "Tạm ngưng" | "Nháp";

export type Product = {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  type: ProductType;
  price: number;
  comparePrice?: number;
  stock: number;
  sold: number;
  status: ProductStatus;
  image?: string;
  description?: string;
  createdAt: string;
};

// - Category Types -

export type CategoryStatus = "Hiển thị" | "Ẩn";

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  productCount: number;
  status: CategoryStatus;
  createdAt: string;
};

// - Customer Types -

export type CustomerStatus = "Hoạt động" | "VIP" | "Bị khóa";

export type Customer = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  totalOrders: number;
  totalSpending: number;
  status: CustomerStatus;
  joinedAt: string;
};

// - Supplier Types -

export type SupplierStatus = "Đang hợp tác" | "Chờ duyệt" | "Tạm ngưng";

export type Supplier = {
  id: string;
  companyName: string;
  taxCode: string;
  contactPerson: string;
  email: string;
  phone: string;
  suppliedProducts: number;
  debt: number;
  status: SupplierStatus;
  createdAt: string;
};

// - Warehouse Types -

export type StockStatus = "Còn hàng" | "Sắp hết" | "Hết hàng" | "Đang nhập";

export type WarehouseItem = {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  warehouse: string;
  quantity: number;
  unit: string;
  costPrice: number;
  inventoryValue: number;
  status: StockStatus;
  updatedAt: string;
};

// - Key/License Types -

export type KeyStatus = "Hoạt động" | "Sắp hết hạn" | "Đã hết hạn" | "Bị khóa" | "Chưa kích hoạt";

export type LicenseKey = {
  id: string;
  key: string;
  productId: string;
  productName: string;
  customerId?: string;
  customerName?: string;
  orderId?: string;
  activatedAt?: string;
  expiresAt?: string;
  status: KeyStatus;
  createdAt: string;
};

// - Banner Types -

export type BannerPosition = "Trang chủ - Hero" | "Trang chủ - Banner" | "Trang sản phẩm" | "Thanh toán";

export type BannerStatus = "Hiển thị" | "Ẩn";

export type Banner = {
  id: string;
  title: string;
  image: string;
  link?: string;
  position: BannerPosition;
  sortOrder: number;
  status: BannerStatus;
  createdAt: string;
};

// - Activity Types -

export type ActivityType = "order" | "customer" | "product" | "key" | "payment" | "admin";

export type Activity = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  createdAt: string;
  meta?: Record<string, string>;
  isRead?: boolean;
  adminName?: string;
};

// - Article Types -

export type ArticleStatus = "DaXuatBan" | "Nhap" | "DaLenLich";
export type ArticleCategory = "Hướng dẫn" | "Tin tức" | "Khuyến mãi" | "Cập nhật" | "Bảo mật";

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  category: ArticleCategory;
  status: ArticleStatus;
  author: string;
  thumbnail?: string;
  tags: string[];
  views: number;
  publishedAt?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
};

// - Static Page Types -

export type PageStatus = "HienThi" | "An";

export type StaticPage = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  status: PageStatus;
  isSystem: boolean;
  wordCount?: number;
  createdAt: string;
  updatedAt: string;
};

// - FAQ Types -

export type FaqStatus = "HienThi" | "An";
export type FaqCategory = "Sản phẩm" | "Thanh toán" | "Key & Kích hoạt" | "Bảo hành" | "Khác";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  status: FaqStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

// - Admin & Role Types -

export type AdminStatus = "HoatDong" | "BiKhoa";

export type Admin = {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  status: AdminStatus;
  lastLogin?: string;
  createdAt: string;
};

export type Role = {
  id: string;
  name: string;
  description?: string;
  color: string;
  permissions: string[];
  isSystem: boolean;
  adminCount: number;
  createdAt: string;
};

export type AdminInfo = {
  id: string;
  name: string;
  email: string;
  status: AdminStatus;
  role: {
    id: string;
    name: string;
    color: string;
    permissions: string[];
  };
};

// - Payment Gateway Types -

export type PaymentGateway = {
  id: string;
  name: string;
  enabled: boolean;
  testMode: boolean;
  merchantId?: string;
  webhookUrl?: string;
  updatedAt: string;
};

// - Dashboard Types -

export type StatCardData = {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
  color: "blue" | "green" | "purple" | "amber" | "cyan" | "rose";
};

export type RevenuePoint = {
  label: string;
  revenue: number;
  orders: number;
};

export type PaymentStat = {
  method: PaymentMethod;
  count: number;
  total: number;
  percentage: number;
};
