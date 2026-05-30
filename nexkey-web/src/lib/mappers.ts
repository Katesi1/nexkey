import type { Product, ProductCategory, ProductType, ProductBadge } from "@/lib/types";
import type { ApiProduct, ApiCategory } from "@/lib/api";

// ── Vietnamese diacritics → ASCII slug ────────────────────────────────────

const VI_MAP: Record<string, string> = {
  à: "a", á: "a", ã: "a", ä: "a", å: "a",
  ă: "a", ắ: "a", ặ: "a", ằ: "a", ẳ: "a", ẵ: "a",
  â: "a", ấ: "a", ậ: "a", ầ: "a", ẩ: "a", ẫ: "a",
  è: "e", é: "e", ê: "e", ë: "e",
  ế: "e", ệ: "e", ề: "e", ể: "e", ễ: "e",
  ì: "i", í: "i", î: "i", ï: "i", ị: "i", ỉ: "i", ĩ: "i",
  ò: "o", ó: "o", ô: "o", õ: "o", ö: "o",
  ố: "o", ộ: "o", ồ: "o", ổ: "o", ỗ: "o",
  ơ: "o", ớ: "o", ợ: "o", ờ: "o", ở: "o", ỡ: "o",
  ù: "u", ú: "u", û: "u", ü: "u", ụ: "u", ủ: "u", ũ: "u",
  ư: "u", ứ: "u", ự: "u", ừ: "u", ử: "u", ữ: "u",
  ỳ: "y", ý: "y", ỵ: "y", ỷ: "y", ỹ: "y",
  đ: "d", ñ: "n",
};

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map(c => VI_MAP[c] ?? c)
    .join("")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// ── Category mapping ───────────────────────────────────────────────────────

// Maps API category names → web ProductCategory keys
const CAT_MAP: Array<{ match: RegExp; cat: ProductCategory }> = [
  { match: /windows/i,                  cat: "windows" },
  { match: /office|microsoft/i,         cat: "office" },
  { match: /youtube/i,                  cat: "youtube" },
  { match: /google.?one|google drive/i, cat: "google-one" },
  { match: /spotify/i,                  cat: "subscription" as ProductCategory },
  { match: /netflix/i,                  cat: "subscription" as ProductCategory },
  { match: /combo/i,                    cat: "combo" },
  { match: /antivirus|kaspersky|eset/i, cat: "security" as ProductCategory },
];

export function mapCategoryName(name: string): ProductCategory {
  for (const { match, cat } of CAT_MAP) {
    if (match.test(name)) return cat;
  }
  return "windows"; // fallback
}

// ── Product type mapping ───────────────────────────────────────────────────

// API: 1=WindowsKey 2=OfficeKey 3=Subscription 4=Account 5=Antivirus
export function mapProductType(apiType: number): ProductType {
  if (apiType === 3 || apiType === 4) return "Subscription";
  return "Retail";
}

// ── Badge logic ────────────────────────────────────────────────────────────

export function deriveBadges(p: ApiProduct): ProductBadge[] {
  const badges: ProductBadge[] = [];
  if (p.sold > 200)                         badges.push("Bán chạy");
  if (p.comparePrice && p.comparePrice > p.price) badges.push("Ưu đãi");
  return badges;
}

// ── Static content defaults ────────────────────────────────────────────────

const DEFAULT_FAQ = [
  { q: "Bao lâu nhận được key?",       a: "Sau khi thanh toán thành công, hệ thống giao tự động qua email và hiển thị trong trang đơn hàng." },
  { q: "Key dùng được mấy máy?",       a: "Tuỳ loại key. Key Retail thường 1 máy/1 lần kích hoạt theo chính sách sản phẩm." },
  { q: "Không active được thì sao?",   a: "Gửi yêu cầu hỗ trợ/bảo hành. NexKey sẽ hướng dẫn kích hoạt hoặc đổi key theo chính sách." },
];

function defaultGuide(name: string): string {
  if (/windows/i.test(name))
    return "Bước 1: Mở Settings → System → Activation.\nBước 2: Chọn Change product key.\nBước 3: Nhập key và làm theo hướng dẫn.\nBước 4: Liên hệ hỗ trợ 24/7 nếu cần.";
  if (/office/i.test(name))
    return "Bước 1: Cài đặt Office từ office.com.\nBước 2: Mở Word → Account → Change Product Key.\nBước 3: Nhập key và kích hoạt online.";
  if (/youtube/i.test(name))
    return "Bước 1: Mở email giao hàng.\nBước 2: Làm theo link/điều hướng nhận gói.\nBước 3: Kiểm tra trạng thái Premium trong YouTube.";
  if (/google/i.test(name))
    return "Bước 1: Mở email nhận gói.\nBước 2: Đăng nhập tài khoản Google.\nBước 3: Xác nhận nâng cấp Google One.";
  return "Bước 1: Nhận thông tin từ email giao hàng.\nBước 2: Làm theo hướng dẫn được gửi kèm.\nBước 3: Liên hệ hỗ trợ nếu cần thêm trợ giúp.";
}

const DEFAULT_WARRANTY = "Bảo hành kích hoạt. Nếu key lỗi/không kích hoạt được do nguyên nhân từ key, NexKey hỗ trợ đổi key theo chính sách.";

const DEFAULT_BULLETS = [
  "Giao tự động qua email",
  "Hỗ trợ kích hoạt 24/7",
  "Bảo hành rõ ràng",
  "Hàng chính hãng",
];

// ── Main mapper ────────────────────────────────────────────────────────────

export function mapApiProduct(
  p: ApiProduct,
  allProducts: ApiProduct[] = [],
): Product {
  const slug = toSlug(p.name);
  const category = mapCategoryName(p.categoryName);

  // Related: same category, different product, max 4
  const relatedSlugs = allProducts
    .filter(r => r.id !== p.id && mapCategoryName(r.categoryName) === category)
    .slice(0, 4)
    .map(r => toSlug(r.name));

  return {
    id:              p.id,
    slug,
    name:            p.name,
    category,
    type:            mapProductType(p.type),
    price:           p.price,
    compareAtPrice:  p.comparePrice ?? undefined,
    rating:          4.8,
    reviewCount:     p.sold,
    inStock:         p.status === 1 && p.stock > 0,
    badges:          deriveBadges(p),
    shortBullets:    p.description
      ? p.description.split(/[.\n]/).filter(s => s.trim().length > 10).slice(0, 4).map(s => s.trim())
      : DEFAULT_BULLETS,
    description:     p.description ?? `${p.name} chính hãng. Giao tự động, kích hoạt online nhanh chóng.`,
    activationGuide: defaultGuide(p.name),
    warrantyPolicy:  DEFAULT_WARRANTY,
    faq:             DEFAULT_FAQ,
    relatedSlugs,
  };
}

// ── Category mapper for web UI ─────────────────────────────────────────────

export type WebCategory = {
  id: string;
  key: ProductCategory;
  name: string;
  slug: string;
  icon: string;
  color: string;
  productCount: number;
};

export function mapApiCategory(c: ApiCategory): WebCategory {
  return {
    id:           c.id,
    key:          mapCategoryName(c.name),
    name:         c.name,
    slug:         c.slug,
    icon:         c.icon,
    color:        c.color,
    productCount: c.productCount,
  };
}
