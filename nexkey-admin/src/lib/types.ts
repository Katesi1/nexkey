// ── Enum const objects — khớp số nguyên với API C# ───────────────────────
// Dùng: OrderStatus.HoanThanh === 2, hoặc kiểm tra status === 2

export const OrderStatus = {
  DangXuLy:     1,
  HoanThanh:    2,
  DaHuy:        3,
  HoanTien:     4,
  ChoThanhToan: 5,
} as const;
export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const PaymentMethod = {
  VNPay:   1,
  MoMo:    2,
  Banking: 3,
  Card:    4,
  TienMat: 5,
} as const;
export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export const ProductType = {
  WindowsKey:   1,
  OfficeKey:    2,
  Subscription: 3,
  Account:      4,
  Antivirus:    5,
} as const;
export type ProductType = typeof ProductType[keyof typeof ProductType];

export const ProductStatus = {
  DangBan:  1,
  HetHang:  2,
  TamNgung: 3,
  Nhap:     4,
} as const;
export type ProductStatus = typeof ProductStatus[keyof typeof ProductStatus];

export const CategoryStatus = {
  HienThi: 1,
  An:      2,
} as const;
export type CategoryStatus = typeof CategoryStatus[keyof typeof CategoryStatus];

export const CustomerStatus = {
  HoatDong: 1,
  VIP:      2,
  BiKhoa:   3,
} as const;
export type CustomerStatus = typeof CustomerStatus[keyof typeof CustomerStatus];

export const SupplierStatus = {
  DangHopTac: 1,
  ChoDuyet:   2,
  TamNgung:   3,
} as const;
export type SupplierStatus = typeof SupplierStatus[keyof typeof SupplierStatus];

export const WarehouseStatus = {
  ConHang:  1,
  SapHet:   2,
  HetHang:  3,
  DangNhap: 4,
} as const;
export type WarehouseStatus = typeof WarehouseStatus[keyof typeof WarehouseStatus];

export const LicenseKeyStatus = {
  HoatDong:      1,
  SapHetHan:     2,
  DaHetHan:      3,
  BiKhoa:        4,
  ChuaKichHoat:  5,
} as const;
export type LicenseKeyStatus = typeof LicenseKeyStatus[keyof typeof LicenseKeyStatus];

export const BannerPosition = {
  TrangChuHero:   1,
  TrangChuBanner: 2,
  TrangSanPham:   3,
  ThanhToan:      4,
} as const;
export type BannerPosition = typeof BannerPosition[keyof typeof BannerPosition];

export const BannerStatus = {
  HienThi: 1,
  An:      2,
} as const;
export type BannerStatus = typeof BannerStatus[keyof typeof BannerStatus];

export const ArticleStatus = {
  DaXuatBan: 1,
  Nhap:      2,
  DaLenLich: 3,
} as const;
export type ArticleStatus = typeof ArticleStatus[keyof typeof ArticleStatus];

export const PageStatus = {
  HienThi: 1,
  An:      2,
} as const;
export type PageStatus = typeof PageStatus[keyof typeof PageStatus];

export const FaqStatus = {
  HienThi: 1,
  An:      2,
} as const;
export type FaqStatus = typeof FaqStatus[keyof typeof FaqStatus];

export const ActivityLogType = {
  Order:    1,
  Customer: 2,
  Product:  3,
  Key:      4,
  Payment:  5,
  Admin:    6,
} as const;
export type ActivityLogType = typeof ActivityLogType[keyof typeof ActivityLogType];

export const AdminStatus = {
  HoatDong: 1,
  BiKhoa:   2,
} as const;
export type AdminStatus = typeof AdminStatus[keyof typeof AdminStatus];

// ── Display labels — dùng trong UI ────────────────────────────────────────

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  1: "Đang xử lý",
  2: "Hoàn thành",
  3: "Đã hủy",
  4: "Hoàn tiền",
  5: "Chờ thanh toán",
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  1: "VNPay",
  2: "MoMo",
  3: "Banking",
  4: "Card",
  5: "Tiền mặt",
};

export const PRODUCT_TYPE_LABEL: Record<ProductType, string> = {
  1: "Windows Key",
  2: "Office Key",
  3: "Subscription",
  4: "Account",
  5: "Antivirus",
};

export const PRODUCT_STATUS_LABEL: Record<ProductStatus, string> = {
  1: "Đang bán",
  2: "Hết hàng",
  3: "Tạm ngưng",
  4: "Nháp",
};

export const CATEGORY_STATUS_LABEL: Record<CategoryStatus, string> = {
  1: "Hiển thị",
  2: "Ẩn",
};

export const CUSTOMER_STATUS_LABEL: Record<CustomerStatus, string> = {
  1: "Hoạt động",
  2: "VIP",
  3: "Bị khóa",
};

export const SUPPLIER_STATUS_LABEL: Record<SupplierStatus, string> = {
  1: "Đang hợp tác",
  2: "Chờ duyệt",
  3: "Tạm ngưng",
};

export const WAREHOUSE_STATUS_LABEL: Record<WarehouseStatus, string> = {
  1: "Còn hàng",
  2: "Sắp hết",
  3: "Hết hàng",
  4: "Đang nhập",
};

export const LICENSE_KEY_STATUS_LABEL: Record<LicenseKeyStatus, string> = {
  1: "Hoạt động",
  2: "Sắp hết hạn",
  3: "Đã hết hạn",
  4: "Bị khóa",
  5: "Chưa kích hoạt",
};

export const BANNER_POSITION_LABEL: Record<BannerPosition, string> = {
  1: "Trang chủ - Hero",
  2: "Trang chủ - Banner",
  3: "Trang sản phẩm",
  4: "Thanh toán",
};

export const BANNER_STATUS_LABEL: Record<BannerStatus, string> = {
  1: "Hiển thị",
  2: "Ẩn",
};

export const ARTICLE_STATUS_LABEL: Record<ArticleStatus, string> = {
  1: "Đã xuất bản",
  2: "Nháp",
  3: "Đã lên lịch",
};

export const PAGE_STATUS_LABEL: Record<PageStatus, string> = {
  1: "Hiển thị",
  2: "Ẩn",
};

export const FAQ_STATUS_LABEL: Record<FaqStatus, string> = {
  1: "Hiển thị",
  2: "Ẩn",
};

export const ACTIVITY_LOG_TYPE_LABEL: Record<ActivityLogType, string> = {
  1: "Đơn hàng",
  2: "Khách hàng",
  3: "Sản phẩm",
  4: "License Key",
  5: "Thanh toán",
  6: "Quản trị",
};

export const ADMIN_STATUS_LABEL: Record<AdminStatus, string> = {
  1: "Hoạt động",
  2: "Bị khóa",
};

// ── Order Types ────────────────────────────────────────────────────────────

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

// ── Product Types ──────────────────────────────────────────────────────────

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

// ── Category Types ─────────────────────────────────────────────────────────

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

// ── Customer Types ─────────────────────────────────────────────────────────

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

// ── Supplier Types ─────────────────────────────────────────────────────────

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

// ── Warehouse Types ────────────────────────────────────────────────────────

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
  status: WarehouseStatus;
  updatedAt: string;
};

// ── License Key Types ──────────────────────────────────────────────────────

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
  status: LicenseKeyStatus;
  createdAt: string;
};

// ── Banner Types ───────────────────────────────────────────────────────────

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

// ── Activity Log Types ─────────────────────────────────────────────────────

export type Activity = {
  id: string;
  type: ActivityLogType;
  title: string;
  description: string;
  createdAt: string;
  meta?: Record<string, string>;
  isRead?: boolean;
  adminName?: string;
};

// ── Article Types ──────────────────────────────────────────────────────────

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

// ── Static Page Types ──────────────────────────────────────────────────────

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

// ── FAQ Types ──────────────────────────────────────────────────────────────

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

// ── Admin & Role Types ─────────────────────────────────────────────────────

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

// ── Payment Gateway Types ──────────────────────────────────────────────────

export type PaymentGateway = {
  id: string;
  name: string;
  enabled: boolean;
  testMode: boolean;
  merchantId?: string;
  webhookUrl?: string;
  updatedAt: string;
};

// ── Dashboard Types ────────────────────────────────────────────────────────

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
