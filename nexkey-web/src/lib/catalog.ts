import type { Product, ProductCategory } from "@/lib/types";

export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  windows: "Windows",
  office: "Office",
  youtube: "YouTube Premium",
  "google-one": "Google One",
  combo: "Combo",
};

const baseFaq = [
  {
    q: "Bao lâu nhận được key?",
    a: "Sau khi thanh toán thành công, hệ thống sẽ giao tự động qua email và hiển thị trong trang đơn hàng.",
  },
  {
    q: "Key dùng được mấy máy?",
    a: "Tuỳ loại key. Với key Retail thường 1 máy/1 lần kích hoạt theo chính sách sản phẩm.",
  },
  {
    q: "Không active được thì sao?",
    a: "Bạn có thể gửi yêu cầu hỗ trợ/bảo hành. NexKey sẽ hướng dẫn kích hoạt hoặc đổi key theo chính sách.",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "p_win_11_pro",
    slug: "windows-11-pro",
    name: "Windows 11 Pro",
    category: "windows",
    type: "Retail",
    price: 390000,
    compareAtPrice: 490000,
    rating: 4.9,
    reviewCount: 1258,
    inStock: true,
    badges: ["Bán chạy", "Ưu đãi"],
    shortBullets: [
      "Giao tự động qua email",
      "Key Retail - Active online",
      "Hỗ trợ kích hoạt 24/7",
      "Bảo hành rõ ràng",
    ],
    description:
      "Windows 11 Pro bản quyền chính hãng, tối ưu cho công việc và bảo mật. Kích hoạt online nhanh chóng, giao key tự động ngay sau thanh toán.",
    activationGuide:
      "Bước 1: Mở Settings → System → Activation.\nBước 2: Chọn Change product key.\nBước 3: Nhập key và làm theo hướng dẫn.\nBước 4: Nếu cần, liên hệ hỗ trợ 24/7.",
    warrantyPolicy:
      "Bảo hành kích hoạt. Nếu key lỗi/không kích hoạt được do nguyên nhân từ key, NexKey hỗ trợ đổi key theo chính sách.",
    faq: baseFaq,
    relatedSlugs: ["windows-10-pro", "office-2021-pro-plus"],
  },
  {
    id: "p_win_10_pro",
    slug: "windows-10-pro",
    name: "Windows 10 Pro",
    category: "windows",
    type: "Retail",
    price: 290000,
    compareAtPrice: 390000,
    rating: 4.8,
    reviewCount: 846,
    inStock: true,
    badges: ["Bán chạy"],
    shortBullets: [
      "Giao tự động qua email",
      "Key Retail - Active online",
      "Hỗ trợ cài đặt",
      "Bảo hành rõ ràng",
    ],
    description:
      "Windows 10 Pro ổn định, tương thích cao. Giao key tự động, kích hoạt online nhanh.",
    activationGuide:
      "Bước 1: Control Panel → System.\nBước 2: Change product key.\nBước 3: Nhập key và kích hoạt online.",
    warrantyPolicy:
      "Bảo hành kích hoạt theo chính sách NexKey. Hỗ trợ đổi key nếu lỗi xác thực.",
    faq: baseFaq,
    relatedSlugs: ["windows-11-pro"],
  },
  {
    id: "p_office_2021_pp",
    slug: "office-2021-pro-plus",
    name: "Office 2021 Pro Plus",
    category: "office",
    type: "Retail",
    price: 690000,
    compareAtPrice: 890000,
    rating: 4.9,
    reviewCount: 622,
    inStock: true,
    badges: ["Ưu đãi"],
    shortBullets: [
      "Giao tự động sau thanh toán",
      "Hỗ trợ cài đặt từ xa",
      "Bảo hành rõ ràng",
      "Active online",
    ],
    description:
      "Bộ Office 2021 Pro Plus gồm Word/Excel/PowerPoint/Outlook… Kích hoạt online, dùng ổn định.",
    activationGuide:
      "Bước 1: Cài đặt Office.\nBước 2: Mở Word → Account.\nBước 3: Change Product Key.\nBước 4: Nhập key, đăng nhập nếu được yêu cầu.",
    warrantyPolicy:
      "Bảo hành kích hoạt. Hỗ trợ xử lý lỗi cài đặt/kích hoạt trong thời gian bảo hành.",
    faq: baseFaq,
    relatedSlugs: ["windows-11-pro", "windows-10-pro"],
  },
  {
    id: "p_yt_premium_1m",
    slug: "youtube-premium-1-thang",
    name: "YouTube Premium (1 tháng)",
    category: "youtube",
    type: "Subscription",
    price: 79000,
    rating: 4.7,
    reviewCount: 312,
    inStock: true,
    badges: ["Ưu đãi"],
    shortBullets: [
      "Xem không quảng cáo",
      "Phát nền, tải offline",
      "Giao tự động sau thanh toán",
      "Hỗ trợ nhanh",
    ],
    description:
      "Gói YouTube Premium 1 tháng. Hỗ trợ nâng cấp/thiết lập nhanh chóng sau thanh toán.",
    activationGuide:
      "Bước 1: Mở email giao hàng.\nBước 2: Làm theo link/điều hướng nhận gói.\nBước 3: Kiểm tra trạng thái Premium trong ứng dụng YouTube.",
    warrantyPolicy:
      "Bảo hành theo thời gian gói. Nếu lỗi kích hoạt do hệ thống, NexKey hỗ trợ xử lý/đổi phương án.",
    faq: baseFaq,
    relatedSlugs: ["google-one-100gb-1-thang"],
  },
  {
    id: "p_gone_100gb_1m",
    slug: "google-one-100gb-1-thang",
    name: "Google One 100GB (1 tháng)",
    category: "google-one",
    type: "Subscription",
    price: 29000,
    rating: 4.6,
    reviewCount: 201,
    inStock: true,
    badges: ["Mới"],
    shortBullets: [
      "Tăng dung lượng Google Drive",
      "Chia sẻ gia đình (tuỳ gói)",
      "Giao tự động",
      "Hỗ trợ 24/7",
    ],
    description:
      "Google One 100GB giúp tăng dung lượng Drive/Gmail/Photos. Giao tự động và hỗ trợ kích hoạt nhanh.",
    activationGuide:
      "Bước 1: Mở email nhận gói.\nBước 2: Đăng nhập tài khoản Google.\nBước 3: Xác nhận nâng cấp Google One.",
    warrantyPolicy:
      "Bảo hành theo thời gian gói và chính sách NexKey. Hỗ trợ xử lý lỗi kích hoạt.",
    faq: baseFaq,
    relatedSlugs: ["youtube-premium-1-thang"],
  },
  {
    id: "p_combo_work_1m",
    slug: "combo-work-1-thang",
    name: "Combo Work: YouTube Premium + Google One (1 tháng)",
    category: "combo",
    type: "Combo",
    price: 99000,
    compareAtPrice: 129000,
    rating: 4.8,
    reviewCount: 144,
    inStock: true,
    badges: ["Bán chạy", "Ưu đãi"],
    shortBullets: [
      "Tiết kiệm chi phí",
      "Giao tự động",
      "Hỗ trợ 24/7",
      "Dùng ngay sau thanh toán",
    ],
    description:
      "Combo tiết kiệm cho nhu cầu giải trí + lưu trữ. Giao tự động và hướng dẫn kích hoạt chi tiết.",
    activationGuide:
      "Bước 1: Nhận thông tin giao hàng từ email.\nBước 2: Kích hoạt YouTube Premium theo hướng dẫn.\nBước 3: Kích hoạt Google One theo hướng dẫn.",
    warrantyPolicy:
      "Bảo hành theo từng thành phần trong combo. Hỗ trợ xử lý lỗi kích hoạt nhanh.",
    faq: baseFaq,
    relatedSlugs: ["youtube-premium-1-thang", "google-one-100gb-1-thang"],
  },
];

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export function getProductById(id: string) {
  return PRODUCTS.find((p) => p.id === id) ?? null;
}

