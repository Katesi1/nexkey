"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CATEGORY_LABEL } from "@/lib/catalog";
import { ProductCategoryIcon } from "@/lib/productIcons";
import type { ProductCategory } from "@/lib/types";
import { Card } from "@/components/ui/Card";

// ── Types ──────────────────────────────────────────────────────────
type Step = { title: string; detail: string };
type LicenseType = { name: string; desc: string; transferable: boolean };
type ErrorEntry = { code: string; meaning: string; fix: string };
type GuideImage = { src: string; alt: string; caption: string };

type Guide = {
  category: ProductCategory;
  title: string;
  subtitle: string;
  steps: Step[];
  licenseTypes?: LicenseType[];
  errors?: ErrorEntry[];
  notes: string[];
  images: [GuideImage, GuideImage];
};

// ── Unsplash images (CC0 – free) ───────────────────────────────────
const U = "https://images.unsplash.com";
const P = "?w=600&h=380&auto=format&fit=crop&q=80";

// ── Guide data (nguồn: support.microsoft.com, support.google.com) ──
const GUIDES: Guide[] = [
  {
    category: "windows",
    title: "Kích hoạt Windows bằng Product Key",
    subtitle:
      "Áp dụng cho Windows 10 & Windows 11 — key Retail / OEM / Volume",
    steps: [
      {
        title: "Mở cài đặt Activation",
        detail:
          "Windows 11: Nhấn Start → Settings → System → Activation.\n" +
          "Windows 10: Nhấn Start → Settings → Update & Security → Activation.",
      },
      {
        title: "Chọn Change product key",
        detail:
          "Trong mục Activation status, nhấn vào nút Change product key (hoặc Enter a product key nếu chưa có).",
      },
      {
        title: "Nhập key 25 ký tự",
        detail:
          "Nhập đúng định dạng: XXXXX-XXXXX-XXXXX-XXXXX-XXXXX (Windows tự thêm dấu gạch ngang). Nhấn Next.",
      },
      {
        title: "Kích hoạt online",
        detail:
          "Windows tự kết nối máy chủ Microsoft để xác thực. Quá trình mất 1–2 phút. Trạng thái chuyển sang Windows is activated là thành công.",
      },
      {
        title: "Liên kết tài khoản Microsoft (khuyến nghị)",
        detail:
          "Vào Activation → Add a Microsoft account để gắn license vào tài khoản. Giúp khôi phục bản quyền nếu sau này đổi phần cứng.",
      },
    ],
    licenseTypes: [
      {
        name: "Retail (FPP)",
        desc:
          "Mua lẻ tại cửa hàng hoặc online. Có thể chuyển sang máy khác sau khi hủy kích hoạt máy cũ. Liên kết với tài khoản Microsoft.",
        transferable: true,
      },
      {
        name: "OEM",
        desc:
          "Đi kèm theo máy tính mới. Gắn cứng vào bo mạch chủ (motherboard). Không chuyển sang máy khác được nếu thay mainboard.",
        transferable: false,
      },
      {
        name: "Volume (MAK / KMS)",
        desc:
          "Dành cho doanh nghiệp và tổ chức lớn. Một key có thể kích hoạt nhiều máy. Không bán lẻ tới người dùng cá nhân.",
        transferable: false,
      },
    ],
    errors: [
      {
        code: "0xC004C003",
        meaning: "Key không hợp lệ hoặc đã bị sử dụng quá số lần cho phép.",
        fix: "Kiểm tra lại key, liên hệ hỗ trợ nếu mua đúng nguồn.",
      },
      {
        code: "0xC004F213",
        meaning:
          "Không tìm thấy product key, thường xảy ra sau khi cài lại Windows hoặc đổi mainboard.",
        fix: "Chạy Activation Troubleshooter: Settings → Activation → Troubleshoot, đăng nhập tài khoản Microsoft.",
      },
      {
        code: "0xC004F034",
        meaning: "Key không khớp với phiên bản Windows đang dùng (Home / Pro).",
        fix: "Kiểm tra phiên bản Windows: Settings → System → About. Key Home không kích hoạt được Windows Pro.",
      },
    ],
    notes: [
      "Tắt VPN / proxy trước khi kích hoạt — máy chủ Microsoft có thể từ chối kết nối qua VPN.",
      "Key phải đúng phiên bản: Home ↔ Home, Pro ↔ Pro. Mua nhầm phiên bản sẽ báo lỗi.",
      "Nếu dùng slmgr (nâng cao): mở CMD as Admin, gõ slmgr /ipk XXXXX-XXXXX-XXXXX-XXXXX-XXXXX rồi slmgr /ato.",
    ],
    images: [
      {
        src: `${U}/photo-1538370621607-4919ce7889b3${P}`,
        alt: "Giao diện Windows Settings",
        caption: "Settings → System → Activation (Windows 11)",
      },
      {
        src: `${U}/photo-1690627931320-16ac56eb2588${P}`,
        alt: "Kích hoạt Windows online",
        caption: 'Nhập key → Next → "Windows is activated"',
      },
    ],
  },

  {
    category: "office",
    title: "Kích hoạt Microsoft Office 2021 / 2019",
    subtitle: "Áp dụng cho Office Retail — kích hoạt qua office.com/setup",
    steps: [
      {
        title: "Truy cập trang setup chính thức",
        detail:
          "Mở trình duyệt, vào https://office.com/setup (hoặc microsoft365.com/setup).",
      },
      {
        title: "Đăng nhập tài khoản Microsoft",
        detail:
          "Đăng nhập bằng tài khoản Microsoft bạn muốn gắn license. Nếu chưa có, tạo mới miễn phí tại account.microsoft.com.",
      },
      {
        title: "Nhập product key 25 ký tự",
        detail:
          "Nhập key không có dấu gạch ngang (Office tự xử lý định dạng). Key có dạng XXXXX-XXXXX-XXXXX-XXXXX-XXXXX.",
      },
      {
        title: "Tải và cài đặt Office",
        detail:
          "Sau khi nhập key hợp lệ, nhấn Install Office. File installer sẽ tải về (~4 GB). Chạy file và chờ hoàn tất.",
      },
      {
        title: "Kích hoạt khi mở lần đầu",
        detail:
          "Mở Word / Excel → đăng nhập đúng tài khoản Microsoft vừa redeem key. Office tự kích hoạt. Kiểm tra tại File → Account → Product Information.",
      },
    ],
    notes: [
      "Office 2021 / 2019 Retail bắt buộc liên kết tài khoản Microsoft — không kích hoạt offline được.",
      "Gỡ hoàn toàn bản Office cũ trước khi cài. Dùng công cụ: aka.ms/SaRA-OfficeUninstall.",
      "Không dùng bản Office crack/pirate trước đó — có thể gây xung đột kích hoạt.",
      "Key Retail Office chỉ dùng được 1 tài khoản Microsoft. Không thể chuyển sang tài khoản khác.",
    ],
    errors: [
      {
        code: "0x4004F00C",
        meaning:
          "Office chưa được kích hoạt hoặc subscription hết hạn (thường với Microsoft 365).",
        fix: "Kiểm tra lại tài khoản Microsoft tại account.microsoft.com/subscriptions.",
      },
      {
        code: "0x8007007B",
        meaning: "Key sai định dạng hoặc nhập thiếu ký tự.",
        fix: "Nhập lại key cẩn thận, không bỏ ký tự. Kiểm tra email giao hàng để copy đúng key.",
      },
    ],
    images: [
      {
        src: `${U}/photo-1633114128174-2f8aa49759b0${P}`,
        alt: "Truy cập office.com/setup",
        caption: "Bước 1 — Vào office.com/setup và đăng nhập",
      },
      {
        src: `${U}/photo-1633114127408-af671c774b39${P}`,
        alt: "Nhập Product Key Office",
        caption: "Bước 3 — Nhập key và tải Office về máy",
      },
    ],
  },

  {
    category: "youtube",
    title: "Kích hoạt YouTube Premium",
    subtitle:
      "Nhận gói qua liên kết email hoặc redeem code tại youtube.com/redeem",
    steps: [
      {
        title: "Kiểm tra email giao hàng",
        detail:
          "Mở email nhận từ NexKey sau thanh toán. Email chứa liên kết kích hoạt hoặc mã code dạng XXXX-XXXX-XXXX.",
      },
      {
        title: "Đăng nhập đúng tài khoản Google",
        detail:
          "Quan trọng: đăng nhập đúng tài khoản Google bạn muốn nhận Premium. Nếu có nhiều tài khoản, kiểm tra avatar góc trên phải tại youtube.com.",
      },
      {
        title: "Kích hoạt qua liên kết hoặc redeem code",
        detail:
          "Cách A — Click trực tiếp liên kết trong email, xác nhận nâng cấp.\n" +
          "Cách B — Vào youtube.com/redeem, nhập code, nhấn Redeem.",
      },
      {
        title: "Xác nhận trạng thái Premium",
        detail:
          "Sau khi kích hoạt: mở YouTube → nhấn avatar → Purchases and memberships. Trạng thái hiển thị YouTube Premium — Active là thành công.",
      },
    ],
    notes: [
      "Không chia sẻ link kích hoạt hoặc code cho người khác — link chỉ dùng một lần.",
      "Đảm bảo đăng nhập đúng tài khoản Google trước khi nhấn link. Kích hoạt nhầm tài khoản không hoàn tác được.",
      "Nếu đang dùng Premium trả phí hàng tháng, hãy hủy trước để tránh bị trừ tiền song song.",
      "Gói Family Plan: người được mời phải có cùng địa chỉ gia đình (Google xác thực theo vị trí).",
    ],
    images: [
      {
        src: `${U}/photo-1540655037529-dec987208707${P}`,
        alt: "Trang youtube.com/redeem",
        caption: "Bước 3B — Vào youtube.com/redeem và nhập code",
      },
      {
        src: `${U}/photo-1521302200778-33500795e128${P}`,
        alt: "Xác nhận YouTube Premium Active",
        caption: "Bước 4 — Kiểm tra Purchases and memberships",
      },
    ],
  },

  {
    category: "google-one",
    title: "Kích hoạt Google One",
    subtitle:
      "Nâng cấp dung lượng lưu trữ Google Drive / Gmail / Photos qua link kích hoạt",
    steps: [
      {
        title: "Nhận liên kết kích hoạt trong email",
        detail:
          "NexKey gửi email kèm URL kích hoạt duy nhất (dạng: g.co/one/... hoặc one.google.com/...). Mỗi liên kết chỉ dùng được một lần.",
      },
      {
        title: "Đăng nhập đúng tài khoản Google",
        detail:
          "Trước khi nhấn link, đăng nhập tài khoản Google muốn nhận gói. Kiểm tra tại myaccount.google.com.",
      },
      {
        title: "Nhấn link và chọn Activate plan",
        detail:
          "Nhấn link trong email → trang Google One hiển thị chi tiết gói. Nhấn Activate plan để xác nhận. Nếu đang có gói cũ, Google sẽ hỏi có hủy gói cũ không.",
      },
      {
        title: "Kiểm tra dung lượng mới",
        detail:
          "Vào one.google.com hoặc drive.google.com. Dung lượng mới hiển thị ngay sau kích hoạt (VD: 100 GB / 200 GB / 2 TB).",
      },
    ],
    notes: [
      "Nếu đang có gói Google One trả phí, hủy trước tại one.google.com/settings để tránh bị trừ tiền.",
      "Google One không áp dụng cho tài khoản Google Workspace (doanh nghiệp/trường học).",
      "Dung lượng được chia sẻ giữa Google Drive, Gmail và Google Photos cùng một tài khoản.",
      "Không đăng nhập qua VPN khi kích hoạt — Google có thể chặn xác thực theo quốc gia.",
    ],
    images: [
      {
        src: `${U}/photo-1667984390538-3dea7a3fe33d${P}`,
        alt: "Đăng nhập tài khoản Google",
        caption: "Bước 2 — Đăng nhập đúng tài khoản Google",
      },
      {
        src: `${U}/photo-1667984390553-7f439e6ae401${P}`,
        alt: "Xác nhận nâng cấp Google One",
        caption: "Bước 3 — Nhấn Activate plan và kiểm tra dung lượng",
      },
    ],
  },
];

// ── Component ──────────────────────────────────────────────────────
export default function GuidesPage() {
  const categories = useMemo(
    () => ["windows", "office", "youtube", "google-one"] as ProductCategory[],
    [],
  );
  const [active, setActive] = useState<ProductCategory>("windows");
  const guide = GUIDES.find((g) => g.category === active)!;

  return (
    <main className="container-page py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Hướng dẫn kích hoạt
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Thông tin chính xác từ{" "}
          <a href="https://support.microsoft.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-900">Microsoft Support</a>
          {" "}và{" "}
          <a href="https://support.google.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-900">Google Support</a>.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* ── Sidebar ── */}
        <aside className="space-y-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold shadow-sm transition-colors ${
                active === c
                  ? "border-transparent bg-slate-900 text-white"
                  : "border-border bg-white text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span className={active === c ? "opacity-80" : "opacity-60"}>
                <ProductCategoryIcon category={c} size={20} />
              </span>
              {CATEGORY_LABEL[c]}
            </button>
          ))}
        </aside>

        {/* ── Content ── */}
        <div className="space-y-4">
          {/* Header card */}
          <Card className="overflow-hidden p-0">
            <div className="border-b border-border bg-slate-50 px-6 py-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {CATEGORY_LABEL[active]}
              </div>
              <h2 className="mt-0.5 text-xl font-extrabold tracking-tight text-slate-900">
                {guide.title}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{guide.subtitle}</p>
            </div>

            <div className="p-6">
              {/* Images */}
              <div className="grid gap-4 sm:grid-cols-2">
                {guide.images.map((img) => (
                  <figure
                    key={img.src}
                    className="overflow-hidden rounded-2xl border border-border bg-slate-50"
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                    <figcaption className="px-4 py-2 text-xs text-slate-500">
                      {img.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>

              {/* Steps */}
              <div className="mt-6">
                <div className="mb-4 text-sm font-semibold text-slate-900">
                  Các bước thực hiện
                </div>
                <ol className="space-y-4">
                  {guide.steps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {step.title}
                        </div>
                        <p className="mt-0.5 whitespace-pre-line text-sm leading-6 text-slate-600">
                          {step.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Card>

          {/* License types (Windows & Office only) */}
          {guide.licenseTypes && (
            <Card className="p-6">
              <div className="mb-4 text-sm font-semibold text-slate-900">
                Phân loại key license
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {guide.licenseTypes.map((lt) => (
                  <div
                    key={lt.name}
                    className="rounded-2xl border border-border bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">
                        {lt.name}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          lt.transferable
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {lt.transferable ? "Chuyển được" : "Không chuyển"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-600">
                      {lt.desc}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Error codes */}
          {guide.errors && (
            <Card className="p-6">
              <div className="mb-4 text-sm font-semibold text-slate-900">
                Lỗi thường gặp & cách xử lý
              </div>
              <div className="space-y-3">
                {guide.errors.map((err) => (
                  <div
                    key={err.code}
                    className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-rose-100 px-1.5 py-0.5 font-mono text-xs font-bold text-rose-700">
                        {err.code}
                      </code>
                      <span className="text-xs font-semibold text-rose-800">
                        {err.meaning}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-rose-700">
                      ✦ {err.fix}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Notes */}
          <Card className="p-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-700">
              <span>⚠️</span> Lưu ý quan trọng
            </div>
            <ul className="space-y-2">
              {guide.notes.map((note) => (
                <li
                  key={note}
                  className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-2.5 text-sm text-amber-900"
                >
                  <span className="mt-0.5 shrink-0 text-amber-500">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </Card>

          <p className="text-right text-xs text-slate-400">
            Ảnh:{" "}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-600"
            >
              Unsplash
            </a>{" "}
            (CC0) · Nội dung:{" "}
            <a
              href="https://support.microsoft.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-600"
            >
              Microsoft Support
            </a>
            ,{" "}
            <a
              href="https://support.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-600"
            >
              Google Support
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
