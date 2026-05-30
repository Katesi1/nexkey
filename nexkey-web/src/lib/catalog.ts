import type { Product, ProductCategory } from "@/lib/types";

// Label hiển thị cho danh mục
export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  windows:      "Windows",
  office:       "Office",
  youtube:      "YouTube Premium",
  "google-one": "Google One",
  combo:        "Combo",
  subscription: "Subscription",
  security:     "Bảo mật",
};

// ── Runtime product cache ──────────────────────────────────────────────────
// Được populate khi user fetch sản phẩm từ API.
// Cart/checkout dùng để look up product details theo id hoặc slug.

const _byId   = new Map<string, Product>();
const _bySlug = new Map<string, Product>();

export function cacheProducts(products: Product[]): void {
  products.forEach(p => {
    _byId.set(p.id, p);
    _bySlug.set(p.slug, p);
  });
}

export function getProductById(id: string): Product | null {
  return _byId.get(id) ?? null;
}

export function getProductBySlug(slug: string): Product | null {
  return _bySlug.get(slug) ?? null;
}

export function getCachedProducts(): Product[] {
  return Array.from(_byId.values());
}
