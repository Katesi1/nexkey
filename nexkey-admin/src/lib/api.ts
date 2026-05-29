const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const API_BASE = API_ORIGIN + "/v1";

/** Chuyển path upload thành URL đầy đủ trỏ về API server. */
export const uploadUrl = (path: string | null | undefined): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path}`;
};

export const TOKEN_KEY = "nexkey_admin_token";

// ─── Token helpers ─────────────────────────────────────────────────────────
export const getToken = (): string | null =>
  typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

export const setToken = (t: string): void =>
  localStorage.setItem(TOKEN_KEY, t);

export const clearToken = (): void =>
  localStorage.removeItem(TOKEN_KEY);

// ─── Enum maps — API ↔ Frontend ────────────────────────────────────────────
const ORDER_STATUS_FROM: Record<string, string> = {
  DangXuLy: "Đang xử lý",
  HoanThanh: "Hoàn thành",
  DaHuy: "Đã hủy",
  HoanTien: "Hoàn tiền",
  ChoThanhToan: "Chờ thanh toán",
};
const ORDER_STATUS_TO: Record<string, string> = Object.fromEntries(
  Object.entries(ORDER_STATUS_FROM).map(([k, v]) => [v, k]),
);

const PAYMENT_FROM: Record<string, string> = {
  VNPay: "VNPay", MoMo: "MoMo", Banking: "Banking", Card: "Card", TienMat: "Tiền mặt",
};
const PAYMENT_TO: Record<string, string> = Object.fromEntries(
  Object.entries(PAYMENT_FROM).map(([k, v]) => [v, k]),
);

const PRODUCT_TYPE_FROM: Record<string, string> = {
  WindowsKey: "Windows Key", OfficeKey: "Office Key",
  Subscription: "Subscription", Account: "Account", Antivirus: "Antivirus",
};
const PRODUCT_TYPE_TO: Record<string, string> = Object.fromEntries(
  Object.entries(PRODUCT_TYPE_FROM).map(([k, v]) => [v, k]),
);

const PRODUCT_STATUS_FROM: Record<string, string> = {
  DangBan: "Đang bán", HetHang: "Hết hàng", TamNgung: "Tạm ngưng", Nhap: "Nháp",
};
const PRODUCT_STATUS_TO: Record<string, string> = Object.fromEntries(
  Object.entries(PRODUCT_STATUS_FROM).map(([k, v]) => [v, k]),
);

const CAT_STATUS_FROM: Record<string, string> = { HienThi: "Hiển thị", An: "Ẩn" };
const CAT_STATUS_TO: Record<string, string> = { "Hiển thị": "HienThi", "Ẩn": "An" };

const CUSTOMER_STATUS_FROM: Record<string, string> = {
  HoatDong: "Hoạt động", VIP: "VIP", BiKhoa: "Bị khóa",
};
const CUSTOMER_STATUS_TO: Record<string, string> = Object.fromEntries(
  Object.entries(CUSTOMER_STATUS_FROM).map(([k, v]) => [v, k]),
);

const SUPPLIER_STATUS_FROM: Record<string, string> = {
  DangHopTac: "Đang hợp tác", ChoDuyet: "Chờ duyệt", TamNgung: "Tạm ngưng",
};
const SUPPLIER_STATUS_TO: Record<string, string> = Object.fromEntries(
  Object.entries(SUPPLIER_STATUS_FROM).map(([k, v]) => [v, k]),
);

const STOCK_STATUS_FROM: Record<string, string> = {
  ConHang: "Còn hàng", SapHet: "Sắp hết", HetHang: "Hết hàng", DangNhap: "Đang nhập",
};

const KEY_STATUS_FROM: Record<string, string> = {
  HoatDong: "Hoạt động", SapHetHan: "Sắp hết hạn", DaHetHan: "Đã hết hạn",
  BiKhoa: "Bị khóa", ChuaKichHoat: "Chưa kích hoạt",
};
const KEY_STATUS_TO: Record<string, string> = Object.fromEntries(
  Object.entries(KEY_STATUS_FROM).map(([k, v]) => [v, k]),
);

const BANNER_POS_FROM: Record<string, string> = {
  TrangChuHero: "Trang chủ - Hero", TrangChuBanner: "Trang chủ - Banner",
  TrangSanPham: "Trang sản phẩm", ThanhToan: "Thanh toán",
};
const BANNER_POS_TO: Record<string, string> = Object.fromEntries(
  Object.entries(BANNER_POS_FROM).map(([k, v]) => [v, k]),
);

const BANNER_STATUS_FROM: Record<string, string> = { HienThi: "Hiển thị", An: "Ẩn" };
const BANNER_STATUS_TO: Record<string, string> = { "Hiển thị": "HienThi", "Ẩn": "An" };

const ACTIVITY_TYPE_FROM: Record<string, string> = {
  Order: "order", Customer: "customer", Product: "product",
  Key: "key", Payment: "payment", Admin: "admin",
};

// ─── Response types ────────────────────────────────────────────────────────
export interface ApiMeta { total: number; page: number; limit: number; totalPages: number }
export interface ApiResponse<T> {
  success: boolean; data: T; error?: string; meta?: ApiMeta;
}

// ─── Base request ──────────────────────────────────────────────────────────
type Params = Record<string, string | number | boolean | undefined | null>;

async function request<T = unknown>(
  method: string,
  path: string,
  body?: unknown,
  params?: Params,
): Promise<ApiResponse<T>> {
  const token = getToken();
  const url = new URL(`${API_BASE}${path}`);

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    }
  }

  const headers: Record<string, string> = {};
  if (!(body instanceof FormData)) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.success) throw new Error(json.error ?? "Có lỗi xảy ra");
  return json;
}

const get  = <T>(path: string, params?: Params) => request<T>("GET",    path, undefined, params);
const post = <T>(path: string, body?: unknown)  => request<T>("POST",   path, body);
const patch = <T>(path: string, body?: unknown) => request<T>("PATCH",  path, body);
const del  = <T>(path: string, body?: unknown)  => request<T>("DELETE", path, body);

// ─── Response mappers ──────────────────────────────────────────────────────
import type {
  Order, Product, Category, Customer, Supplier,
  WarehouseItem, LicenseKey, Banner, Activity,
  Article, StaticPage, FaqItem, AdminInfo, Admin, Role, PaymentGateway,
} from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapOrder(d: any): Order {
  return {
    id: d.id,
    customerId: d.customerId,
    customerName: d.customerName,
    customerEmail: d.customerEmail,
    customerPhone: d.customerPhone,
    total: d.total,
    discount: d.discount ?? 0,
    paymentMethod: (PAYMENT_FROM[d.paymentMethod] ?? d.paymentMethod) as Order["paymentMethod"],
    status: (ORDER_STATUS_FROM[d.status] ?? d.status) as Order["status"],
    createdAt: d.createdAt,
    note: d.note ?? undefined,
    items: (d.items ?? []).map((i: any) => ({
      productId: i.productId,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      licenseKey: i.licenseKey ?? undefined,
    })),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(d: any): Product {
  return {
    id: d.id,
    name: d.name,
    sku: d.sku,
    categoryId: d.categoryId,
    categoryName: d.categoryName,
    type: (PRODUCT_TYPE_FROM[d.type] ?? d.type) as Product["type"],
    price: d.price,
    comparePrice: d.comparePrice ?? undefined,
    stock: d.stock,
    sold: d.sold,
    status: (PRODUCT_STATUS_FROM[d.status] ?? d.status) as Product["status"],
    image: d.image ?? undefined,
    description: d.description ?? undefined,
    createdAt: d.createdAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCategory(d: any): Category {
  return {
    id: d.id,
    name: d.name,
    slug: d.slug,
    icon: d.icon ?? "",
    color: d.color ?? "#000",
    productCount: d.productCount ?? 0,
    status: (CAT_STATUS_FROM[d.status] ?? d.status) as Category["status"],
    createdAt: d.createdAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCustomer(d: any): Customer {
  return {
    id: d.id,
    fullName: d.fullName,
    email: d.email,
    phone: d.phone,
    avatar: d.avatar ?? undefined,
    totalOrders: d.totalOrders ?? 0,
    totalSpending: d.totalSpending ?? 0,
    status: (CUSTOMER_STATUS_FROM[d.status] ?? d.status) as Customer["status"],
    joinedAt: d.joinedAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSupplier(d: any): Supplier {
  return {
    id: d.id,
    companyName: d.companyName,
    taxCode: d.taxCode,
    contactPerson: d.contactPerson,
    email: d.email,
    phone: d.phone,
    suppliedProducts: d.suppliedProducts ?? 0,
    debt: d.debt ?? 0,
    status: (SUPPLIER_STATUS_FROM[d.status] ?? d.status) as Supplier["status"],
    createdAt: d.createdAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapWarehouse(d: any): WarehouseItem {
  return {
    id: d.id,
    productId: d.productId,
    productName: d.productName,
    sku: d.sku,
    warehouse: d.warehouse,
    quantity: d.quantity,
    unit: d.unit,
    costPrice: d.costPrice,
    inventoryValue: d.inventoryValue ?? d.quantity * d.costPrice,
    status: (STOCK_STATUS_FROM[d.status] ?? d.status) as WarehouseItem["status"],
    updatedAt: d.updatedAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapKey(d: any): LicenseKey {
  return {
    id: d.id,
    key: d.key,
    productId: d.productId,
    productName: d.productName,
    customerId: d.customerId ?? undefined,
    customerName: d.customerName ?? undefined,
    orderId: d.orderId ?? undefined,
    activatedAt: d.activatedAt ?? undefined,
    expiresAt: d.expiresAt ?? undefined,
    status: (KEY_STATUS_FROM[d.status] ?? d.status) as LicenseKey["status"],
    createdAt: d.createdAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBanner(d: any): Banner {
  return {
    id: d.id,
    title: d.title,
    image: d.image,
    link: d.link ?? undefined,
    position: (BANNER_POS_FROM[d.position] ?? d.position) as Banner["position"],
    sortOrder: d.sortOrder,
    status: (BANNER_STATUS_FROM[d.status] ?? d.status) as Banner["status"],
    createdAt: d.createdAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapActivity(d: any): Activity & { isRead: boolean; adminName?: string } {
  return {
    id: d.id,
    type: (ACTIVITY_TYPE_FROM[d.type] ?? d.type.toLowerCase()) as Activity["type"],
    title: d.title,
    description: d.description,
    createdAt: d.createdAt,
    meta: d.meta ?? undefined,
    isRead: d.isRead ?? false,
    adminName: d.adminName,
  };
}

// ─── Auth ──────────────────────────────────────────────────────────────────
export const auth = {
  login: async (email: string, password: string) => {
    const res = await post<{ token: string; admin: AdminInfo }>("/auth/login", { email, password });
    setToken(res.data.token);
    return res.data;
  },
  logout: async () => {
    try { await post("/auth/logout"); } catch { /* ignore */ }
    clearToken();
  },
  me: (): Promise<AdminInfo> => get<AdminInfo>("/auth/me").then(r => r.data),
  changePassword: (currentPassword: string, newPassword: string) =>
    post<{ message: string }>("/auth/change-password", { currentPassword, newPassword }),
};

// ─── Orders ────────────────────────────────────────────────────────────────
export const ordersApi = {
  list: async (params: {
    page?: number; limit?: number; search?: string;
    status?: string; payment_method?: string;
    min_amount?: number; max_amount?: number;
  } = {}) => {
    const p: Params = {
      ...params,
      status: params.status ? ORDER_STATUS_TO[params.status] : undefined,
      payment_method: params.payment_method ? PAYMENT_TO[params.payment_method] : undefined,
    };
    const res = await get<unknown[]>("/orders", p);
    return { data: res.data.map(mapOrder), meta: res.meta! };
  },
  stats: () => get<{
    dangXuLy: number; hoanThanh: number; daHuy: number;
    hoanTien: number; choThanhToan: number; tongDoanhThu: number;
  }>("/orders/stats").then(r => r.data),
  get: (id: string) => get<unknown>(`/orders/${id}`).then(r => mapOrder(r.data)),
  create: (body: unknown) => post<unknown>("/orders", body),
  update: (id: string, body: { status?: string; note?: string }) =>
    patch<unknown>(`/orders/${id}`, {
      ...body,
      status: body.status ? ORDER_STATUS_TO[body.status] ?? body.status : undefined,
    }),
  delete: (id: string) => del(`/orders/${id}`),
  refund: (id: string) => post(`/orders/${id}/refund`),
  exportUrl: () => `${API_BASE}/orders/export?token=${getToken()}`,
};

// ─── Products ──────────────────────────────────────────────────────────────
export const productsApi = {
  list: async (params: {
    page?: number; limit?: number; search?: string;
    status?: string; category_id?: string; type?: string;
  } = {}) => {
    const p: Params = {
      ...params,
      status: params.status ? PRODUCT_STATUS_TO[params.status] : undefined,
      type: params.type ? PRODUCT_TYPE_TO[params.type] : undefined,
    };
    const res = await get<unknown[]>("/products", p);
    return { data: res.data.map(mapProduct), meta: res.meta! };
  },
  get: (id: string) => get<unknown>(`/products/${id}`).then(r => mapProduct(r.data)),
  create: (body: Record<string, unknown>) =>
    post<unknown>("/products", {
      ...body,
      status: body.status ? PRODUCT_STATUS_TO[body.status as string] ?? body.status : undefined,
      type: body.type ? PRODUCT_TYPE_TO[body.type as string] ?? body.type : undefined,
    }),
  update: (id: string, body: Record<string, unknown>) =>
    patch<unknown>(`/products/${id}`, {
      ...body,
      status: body.status ? PRODUCT_STATUS_TO[body.status as string] ?? body.status : undefined,
      type: body.type ? PRODUCT_TYPE_TO[body.type as string] ?? body.type : undefined,
    }),
  delete: (id: string) => del(`/products/${id}`),
  updateStock: (id: string, quantity: number, action: "add" | "subtract") =>
    patch(`/products/${id}/stock`, { quantity, action }),
  exportUrl: () => `${API_BASE}/products/export?token=${getToken()}`,
};

// ─── Categories ────────────────────────────────────────────────────────────
export const categoriesApi = {
  list: (params?: { status?: string; search?: string }) =>
    get<unknown[]>("/categories", {
      ...params,
      status: params?.status ? CAT_STATUS_TO[params.status] : undefined,
    } as Params).then(r => r.data.map(mapCategory)),
  get: (id: string) => get<unknown>(`/categories/${id}`).then(r => mapCategory(r.data)),
  create: (body: Record<string, unknown>) =>
    post<unknown>("/categories", {
      ...body,
      status: body.status ? CAT_STATUS_TO[body.status as string] ?? body.status : undefined,
    }),
  update: (id: string, body: Record<string, unknown>) =>
    patch<unknown>(`/categories/${id}`, {
      ...body,
      status: body.status ? CAT_STATUS_TO[body.status as string] ?? body.status : undefined,
    }),
  toggle: (id: string) => patch(`/categories/${id}/toggle`),
  delete: (id: string) => del(`/categories/${id}`),
};

// ─── Customers ─────────────────────────────────────────────────────────────
export const customersApi = {
  list: async (params: {
    page?: number; limit?: number; search?: string;
    status?: string; min_spending?: number; max_spending?: number;
  } = {}) => {
    const p: Params = {
      ...params,
      status: params.status ? CUSTOMER_STATUS_TO[params.status] : undefined,
    };
    const res = await get<unknown[]>("/customers", p);
    return { data: res.data.map(mapCustomer), meta: res.meta! };
  },
  get: (id: string) => get<unknown>(`/customers/${id}`).then(r => r.data),
  create: (body: Record<string, unknown>) =>
    post<unknown>("/customers", {
      ...body,
      status: body.status ? CUSTOMER_STATUS_TO[body.status as string] ?? body.status : undefined,
    }),
  update: (id: string, body: Record<string, unknown>) =>
    patch<unknown>(`/customers/${id}`, {
      ...body,
      status: body.status ? CUSTOMER_STATUS_TO[body.status as string] ?? body.status : undefined,
    }),
  lock: (id: string, locked: boolean) => patch(`/customers/${id}/lock`, { locked }),
  delete: (id: string) => del(`/customers/${id}`),
  exportUrl: () => `${API_BASE}/customers/export?token=${getToken()}`,
};

// ─── Suppliers ─────────────────────────────────────────────────────────────
export const suppliersApi = {
  list: (params?: { status?: string; search?: string; has_debt?: boolean }) =>
    get<unknown[]>("/suppliers", {
      ...params,
      status: params?.status ? SUPPLIER_STATUS_TO[params.status] : undefined,
    } as Params).then(r => r.data.map(mapSupplier)),
  get: (id: string) => get<unknown>(`/suppliers/${id}`).then(r => mapSupplier(r.data)),
  create: (body: Record<string, unknown>) =>
    post<unknown>("/suppliers", {
      ...body,
      status: body.status ? SUPPLIER_STATUS_TO[body.status as string] ?? body.status : undefined,
    }),
  update: (id: string, body: Record<string, unknown>) =>
    patch<unknown>(`/suppliers/${id}`, {
      ...body,
      status: body.status ? SUPPLIER_STATUS_TO[body.status as string] ?? body.status : undefined,
    }),
  updateDebt: (id: string, amount: number, action: "add" | "subtract") =>
    patch(`/suppliers/${id}/debt`, { amount, action }),
  delete: (id: string) => del(`/suppliers/${id}`),
};

// ─── Warehouse ─────────────────────────────────────────────────────────────
export const warehouseApi = {
  list: async (params: {
    page?: number; limit?: number; search?: string; warehouse?: string; status?: string;
  } = {}) => {
    const res = await get<unknown[]>("/warehouse", params as Params);
    return { data: res.data.map(mapWarehouse), meta: res.meta! };
  },
  summary: () => get<{
    byWarehouse: { warehouse: string; quantity: number; value: number }[];
    totalValue: number; totalQuantity: number;
  }>("/warehouse/summary").then(r => r.data),
  get: (id: string) => get<unknown>(`/warehouse/${id}`).then(r => mapWarehouse(r.data)),
  create: (body: unknown) => post<unknown>("/warehouse", body),
  import: (id: string, quantity: number, costPrice: number) =>
    patch(`/warehouse/${id}/import`, { quantity, costPrice }),
  exportItem: (id: string, quantity: number) =>
    patch(`/warehouse/${id}/export`, { quantity }),
};

// ─── License Keys ──────────────────────────────────────────────────────────
export const keysApi = {
  list: async (params: {
    page?: number; limit?: number; search?: string;
    status?: string; product_id?: string;
  } = {}) => {
    const p: Params = {
      ...params,
      status: params.status ? KEY_STATUS_TO[params.status] : undefined,
    };
    const res = await get<unknown[]>("/keys", p);
    return { data: res.data.map(mapKey), meta: res.meta! };
  },
  get: (id: string) => get<unknown>(`/keys/${id}`).then(r => mapKey(r.data)),
  create: (body: Record<string, unknown>) =>
    post<unknown>("/keys", {
      ...body,
      status: body.status ? KEY_STATUS_TO[body.status as string] ?? body.status : undefined,
    }),
  createBulk: (body: Record<string, unknown>) =>
    post<unknown>("/keys/bulk", {
      ...body,
      status: body.status ? KEY_STATUS_TO[body.status as string] ?? body.status : undefined,
    }),
  assign: (keyId: string, orderId: string, customerId: string) =>
    post("/keys/assign", { keyId, orderId, customerId }),
  update: (id: string, body: Record<string, unknown>) =>
    patch<unknown>(`/keys/${id}`, {
      ...body,
      status: body.status ? KEY_STATUS_TO[body.status as string] ?? body.status : undefined,
    }),
  lock: (id: string, locked: boolean) => patch(`/keys/${id}/lock`, { locked }),
  delete: (id: string) => del(`/keys/${id}`),
};

// ─── Banners ───────────────────────────────────────────────────────────────
export const bannersApi = {
  list: (params?: { position?: string; status?: string }) =>
    get<unknown[]>("/banners", {
      position: params?.position ? BANNER_POS_TO[params.position] : undefined,
      status: params?.status ? BANNER_STATUS_TO[params.status] : undefined,
    } as Params).then(r => r.data.map(mapBanner)),
  get: (id: string) => get<unknown>(`/banners/${id}`).then(r => mapBanner(r.data)),
  create: (body: Record<string, unknown>) =>
    post<unknown>("/banners", {
      ...body,
      position: body.position ? BANNER_POS_TO[body.position as string] ?? body.position : undefined,
      status: body.status ? BANNER_STATUS_TO[body.status as string] ?? body.status : undefined,
    }),
  update: (id: string, body: Record<string, unknown>) =>
    patch<unknown>(`/banners/${id}`, {
      ...body,
      position: body.position ? BANNER_POS_TO[body.position as string] ?? body.position : undefined,
      status: body.status ? BANNER_STATUS_TO[body.status as string] ?? body.status : undefined,
    }),
  toggle: (id: string) => patch(`/banners/${id}/toggle`),
  reorder: (items: { id: string; sortOrder: number }[]) => patch("/banners/reorder", items),
  upload: async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await post<{ url: string }>("/banners/upload", fd);
    return res.data.url;
  },
  delete: (id: string) => del(`/banners/${id}`),
};

// ─── Articles ──────────────────────────────────────────────────────────────
export const articlesApi = {
  list: (params?: {
    page?: number; limit?: number; search?: string;
    status?: string; category?: string;
  }) =>
    get<Article[]>("/articles", params as Params).then(r => ({ data: r.data, meta: r.meta! })),
  get: (id: string) => get<Article>(`/articles/${id}`).then(r => r.data),
  create: (body: unknown) => post<Article>("/articles", body),
  update: (id: string, body: unknown) => patch<Article>(`/articles/${id}`, body),
  publish: (id: string) => post(`/articles/${id}/publish`),
  delete: (id: string) => del(`/articles/${id}`),
};

// ─── Static Pages ──────────────────────────────────────────────────────────
export const pagesApi = {
  list: () => get<StaticPage[]>("/pages").then(r => r.data),
  get: (id: string) => get<StaticPage>(`/pages/${id}`).then(r => r.data),
  create: (body: unknown) => post<StaticPage>("/pages", body),
  update: (id: string, body: unknown) => patch<StaticPage>(`/pages/${id}`, body),
  delete: (id: string) => del(`/pages/${id}`),
};

// ─── FAQ ───────────────────────────────────────────────────────────────────
export const faqApi = {
  list: (params?: {
    page?: number; limit?: number; search?: string;
    status?: string; category?: string;
  }) =>
    get<FaqItem[]>("/faq", params as Params).then(r => ({ data: r.data, meta: r.meta! })),
  get: (id: string) => get<FaqItem>(`/faq/${id}`).then(r => r.data),
  create: (body: unknown) => post<FaqItem>("/faq", body),
  update: (id: string, body: unknown) => patch<FaqItem>(`/faq/${id}`, body),
  toggle: (id: string) => patch(`/faq/${id}/toggle`),
  reorder: (items: { id: string; sortOrder: number }[]) => patch("/faq/reorder", items),
  delete: (id: string) => del(`/faq/${id}`),
};

// ─── Activity Logs ─────────────────────────────────────────────────────────
export const logsApi = {
  list: (params?: {
    page?: number; limit?: number; search?: string;
    type?: string; is_read?: boolean;
  }) =>
    get<unknown[]>("/logs", params as Params).then(r => ({
      data: r.data.map(mapActivity),
      meta: r.meta!,
    })),
  markRead: (id: string) => patch(`/logs/${id}/read`),
  markAllRead: () => patch("/logs/read-all"),
  deleteOld: (beforeDays: number) => del("/logs", { beforeDays }),
};

// ─── Admins & Roles ────────────────────────────────────────────────────────
export const adminsApi = {
  list: () => get<Admin[]>("/admins").then(r => r.data),
  create: (body: { name: string; email: string; password: string; roleId: string }) =>
    post<Admin>("/admins", body),
  assignRole: (id: string, roleId: string) => patch(`/admins/${id}/role`, { roleId }),
  lock: (id: string, locked: boolean) => patch(`/admins/${id}/lock`, { locked }),
  delete: (id: string) => del(`/admins/${id}`),
};

export const rolesApi = {
  list: () => get<Role[]>("/roles").then(r => r.data),
  create: (body: { name: string; description: string; color: string; permissions: string[] }) =>
    post<Role>("/roles", body),
  update: (id: string, body: unknown) => patch<Role>(`/roles/${id}`, body),
  delete: (id: string) => del(`/roles/${id}`),
};

// ─── Settings ──────────────────────────────────────────────────────────────
export const settingsApi = {
  list: () =>
    get<{ group: string; settings: Record<string, string> }[]>("/settings").then(r => r.data),
  getGroup: (group: string) =>
    get<Record<string, string>>(`/settings/${group}`).then(r => r.data),
  update: (body: Record<string, string>) => patch("/settings", body),
  testEmail: (to: string) => post<{ message: string }>("/settings/email/test", { to }),
};

// ─── Payment Gateways ──────────────────────────────────────────────────────
export const paymentsApi = {
  gateways: () => get<PaymentGateway[]>("/payments/gateways").then(r => r.data),
  updateGateway: (id: string, body: unknown) => patch(`/payments/gateways/${id}`, body),
  testGateway: (id: string) =>
    post<{ success: boolean; message: string }>(`/payments/gateways/${id}/test`).then(r => r.data),
  stats: () =>
    get<{
      byMethod: { method: string; count: number; revenue: number }[];
      totalRevenue: number; totalOrders: number;
    }>("/payments/stats").then(r => r.data),
};

// ─── Dashboard ─────────────────────────────────────────────────────────────
export const dashboardApi = {
  stats: () =>
    get<{
      dangXuLy: number; hoanThanh: number; daHuy: number;
      hoanTien: number; choThanhToan: number; tongDoanhThu: number;
      totalOrders: number; totalCustomers: number; totalProducts: number;
    }>("/dashboard/stats").then(r => r.data),
  revenue: (period: "7d" | "1m" | "3m" | "6m" | "1y") =>
    get<{ label: string; revenue: number; orders: number }[]>(
      "/orders/revenue", { period }
    ).then(r => r.data),
};
