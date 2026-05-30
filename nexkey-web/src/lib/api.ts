const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000") + "/api";

// ── Raw API types (matches nexkey-api DTOs) ────────────────────────────────

export type ApiProduct = {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  type: number;         // 1=WindowsKey 2=OfficeKey 3=Subscription 4=Account 5=Antivirus
  price: number;
  comparePrice?: number;
  stock: number;
  sold: number;
  status: number;       // 1=DangBan 2=HetHang 3=TamNgung 4=Nhap
  image?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  productCount: number;
  status: number;       // 1=HienThi 2=An
  createdAt: string;
  updatedAt: string;
};

// ── Fetch helpers ──────────────────────────────────────────────────────────

async function get<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate },
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "API error");
  return json.data as T;
}

// ── Public product & category endpoints ───────────────────────────────────

export async function fetchPublicProducts(params?: {
  status?: number;
  categoryId?: string;
  limit?: number;
}): Promise<ApiProduct[]> {
  const qs = new URLSearchParams();
  qs.set("limit", String(params?.limit ?? 100));
  // Chỉ lấy sản phẩm đang bán (status=1)
  qs.set("status", String(params?.status ?? 1));
  if (params?.categoryId) qs.set("categoryId", params.categoryId);
  const res = await get<ApiProduct[]>(`/products?${qs}`);
  return res;
}

export async function fetchPublicProduct(id: string): Promise<ApiProduct> {
  return get<ApiProduct>(`/products/${id}`, 60);
}

export async function fetchPublicCategories(): Promise<ApiCategory[]> {
  const cats = await get<ApiCategory[]>("/categories", 300);
  // Chỉ lấy danh mục đang hiển thị (status=1)
  return cats.filter(c => c.status === 1 && c.productCount > 0);
}

// ── Shop checkout & order tracking ────────────────────────────────────────

export type ShopCheckoutPayload = {
  fullName:      string;
  email:         string;
  phone?:        string;
  paymentMethod: number;  // 1=VNPay 2=MoMo 3=Banking 4=Card
  note?:         string;
  discount:      number;
  items:         { productId: string; quantity: number }[];
};

export type ApiOrderItem = {
  id:         number;
  productId:  string;
  name:       string;
  price:      number;
  quantity:   number;
  licenseKey: string | null;
};

export type ApiOrder = {
  id:              string;
  customerId:      string;
  customerName:    string;
  customerEmail:   string;
  customerPhone:   string;
  total:           number;
  discount:        number;
  paymentMethod:   number;  // enum number
  status:          number;  // enum number
  note:            string | null;
  createdAt:       string;
  updatedAt:       string;
  items:           ApiOrderItem[];
};

export async function shopCheckout(payload: ShopCheckoutPayload): Promise<ApiOrder> {
  const res = await fetch(`${API_BASE}/shop/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Đặt hàng thất bại");
  return json.data as ApiOrder;
}

export async function fetchShopOrder(id: string): Promise<ApiOrder> {
  return get<ApiOrder>(`/shop/orders/${id}`, 0);  // no cache — realtime status
}
