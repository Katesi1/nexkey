export type ProductCategory =
  | "windows"
  | "office"
  | "youtube"
  | "google-one"
  | "combo";

export type ProductType = "Retail" | "Subscription" | "Combo";

export type ProductBadge = "Bán chạy" | "Ưu đãi" | "Mới";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  type: ProductType;
  price: number;
  compareAtPrice?: number;
  rating: number; // 0..5
  reviewCount: number;
  inStock: boolean;
  badges?: ProductBadge[];
  shortBullets: string[];
  description: string;
  activationGuide: string;
  warrantyPolicy: string;
  faq: Array<{ q: string; a: string }>;
  relatedSlugs: string[];
};

export type CartLine = {
  productId: string;
  quantity: number;
};

export type PaymentMethod = "bank" | "vietqr" | "momo" | "vnpay";

export type OrderStatus =
  | "Chờ thanh toán"
  | "Đã thanh toán"
  | "Đã giao hàng"
  | "Đã hủy";

export type OrderItem = {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
};

export type DeliveredItem = {
  productId: string;
  label: string;
  value: string;
  hint?: string;
};

export type Order = {
  id: string;
  createdAt: string; // ISO
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  delivered: DeliveredItem[];
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
};

