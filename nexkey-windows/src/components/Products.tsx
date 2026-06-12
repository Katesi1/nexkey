import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import {
  WINDOWS_KEY_ORIGINAL_PRICE,
  WINDOWS_KEY_SALE_PRICE,
  OFFICE_KEY_ORIGINAL_PRICE,
  OFFICE_KEY_SALE_PRICE,
  discountPercent,
  formatVnd,
} from "@/lib/pricing";

interface ProductCardProps {
  id: string;
  image: string;
  imageAlt: string;
  name: string;
  subtitle: string;
  salePrice: number;
  originalPrice: number;
  /** Đơn vị giá hiển thị cạnh giá bán, vd "/năm". Để trống nếu trọn đời. */
  priceUnit?: string;
  /** Nhãn thời hạn ở nút dưới, vd "Trọn đời" hoặc "1 năm". */
  term: string;
  features: string[];
  buttonColor: string;
  hoverColor: string;
  shadowColor: string;
  borderColor: string;
  accent: string;
  wide?: boolean;
}

function ProductPrice({
  accent,
  salePrice,
  originalPrice,
  priceUnit,
}: {
  accent: string;
  salePrice: number;
  originalPrice: number;
  priceUnit?: string;
}) {
  const percentOff = discountPercent(originalPrice, salePrice);

  return (
    <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-500 text-white text-[10px] font-extrabold tracking-wide uppercase">
        Giá sốc
      </span>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className={`text-[22px] sm:text-[24px] font-extrabold leading-none ${accent}`}>
          {formatVnd(salePrice)}
          {priceUnit && (
            <span className="text-[13px] font-semibold text-slate-500 dark:text-slate-400">{priceUnit}</span>
          )}
        </span>
        <span className="text-[13px] text-slate-400 dark:text-slate-500 line-through">
          {formatVnd(originalPrice)}
          {priceUnit}
        </span>
        <span className="text-[11px] font-bold text-red-500 dark:text-red-400">
          -{percentOff}%
        </span>
      </div>
    </div>
  );
}

function ProductCard({
  image,
  imageAlt,
  name,
  subtitle,
  salePrice,
  originalPrice,
  priceUnit,
  term,
  features,
  buttonColor,
  hoverColor,
  shadowColor,
  borderColor,
  accent,
  wide,
}: ProductCardProps) {
  return (
    <div className={`bg-white dark:bg-[#0a1428] rounded-2xl border ${borderColor} shadow-lg dark:shadow-[#000]/30 hover:shadow-xl transition-shadow duration-300 ${wide ? "lg:col-span-2" : ""}`}>
      <div className="p-4 sm:p-5 flex flex-col gap-4">

        {/* Top: image left + text right */}
        <div className="flex items-center gap-5 sm:gap-6">
          {/* Product box image */}
          <div className="relative w-[110px] h-[145px] sm:w-[150px] sm:h-[198px] lg:w-[170px] lg:h-[224px] flex-shrink-0">
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-contain drop-shadow-xl"
              sizes="140px"
            />
          </div>

          {/* Title + features */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="space-y-2">
              <div>
                <h3 className={`text-[17px] font-bold ${accent} mb-0.5`}>{name}</h3>
                <p className="text-[12px] text-slate-600 dark:text-slate-400 font-medium">{subtitle}</p>
              </div>
              <ProductPrice accent={accent} salePrice={salePrice} originalPrice={originalPrice} priceUnit={priceUnit} />
            </div>
            <ul className={`space-y-1.5 ${wide ? "sm:grid sm:grid-cols-2 sm:gap-x-6 sm:space-y-0 sm:gap-y-1.5" : ""}`}>
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 size={13} className={`${accent} flex-shrink-0`} />
                  <span className="text-[12px] text-slate-700 dark:text-slate-300">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom: buttons */}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex justify-center items-center py-2 rounded-xl border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-200 text-[13px] font-semibold">
            {term}
          </div>
          <a
            href="https://zalo.me/0325992001"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 flex justify-center items-center gap-2 py-2 ${buttonColor} ${hoverColor} text-white text-[13px] font-bold rounded-xl ${shadowColor} hover:shadow-lg hover:-translate-y-0.5 transition-all`}
          >
            <Image src="/icons/zalo.svg" alt="Zalo" width={18} height={18} className="rounded-sm" />
            Liên hệ ngay
          </a>
        </div>
      </div>
    </div>
  );
}

const PRODUCTS: ProductCardProps[] = [
  {
    id: "win11",
    image: "/images/box-window11.png",
    imageAlt: "Windows 11 Professional",
    name: "Windows 11 Pro",
    subtitle: "Key bản quyền trọn đời",
    salePrice: WINDOWS_KEY_SALE_PRICE,
    originalPrice: WINDOWS_KEY_ORIGINAL_PRICE,
    term: "Trọn đời",
    features: [
      "Key chính hãng 100%",
      "Kích hoạt online vĩnh viễn",
      "Sử dụng trọn đời – không gia hạn",
      "Tương thích mọi cấu hình",
    ],
    buttonColor: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    shadowColor: "shadow-blue-500/25",
    borderColor: "border-slate-200 dark:border-blue-900/40",
    accent: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "win10",
    image: "/images/box-window10.png",
    imageAlt: "Windows 10 Professional",
    name: "Windows 10 Pro",
    subtitle: "Key bản quyền trọn đời",
    salePrice: WINDOWS_KEY_SALE_PRICE,
    originalPrice: WINDOWS_KEY_ORIGINAL_PRICE,
    term: "Trọn đời",
    features: [
      "Key chính hãng 100%",
      "Kích hoạt online vĩnh viễn",
      "Sử dụng trọn đời – không gia hạn",
      "Tương thích mọi cấu hình",
    ],
    buttonColor: "bg-purple-600",
    hoverColor: "hover:bg-purple-700",
    shadowColor: "shadow-purple-500/25",
    borderColor: "border-slate-200 dark:border-purple-900/40",
    accent: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "office",
    image: "/images/box-office.svg",
    imageAlt: "Microsoft Office Professional",
    name: "Microsoft Office 365",
    subtitle: "Trọn bộ Word · Excel · PowerPoint · Outlook",
    salePrice: OFFICE_KEY_SALE_PRICE,
    originalPrice: OFFICE_KEY_ORIGINAL_PRICE,
    priceUnit: "/năm",
    term: "1 năm",
    features: [
      "Tài khoản chính hãng 100%",
      "Kích hoạt online ngay",
      "Gói bản quyền 12 tháng",
      "Đầy đủ ứng dụng Office",
      "Tương thích Windows 10 & 11",
      "Hỗ trợ cài đặt từ xa",
    ],
    buttonColor: "bg-orange-600",
    hoverColor: "hover:bg-orange-700",
    shadowColor: "shadow-orange-500/25",
    borderColor: "border-slate-200 dark:border-orange-900/40",
    accent: "text-orange-600 dark:text-orange-400",
    wide: true,
  },
];

export function Products() {
  return (
    <section id="products" className="py-20 bg-slate-50 dark:bg-[#050b1a]">
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="text-blue-600 dark:text-blue-400 text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
            Sản phẩm Windows &amp; Office
          </span>
          <h2 className="text-3xl sm:text-[34px] font-extrabold text-slate-900 dark:text-white mb-3">
            Key Windows &amp; Office bản quyền trọn đời
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-[15px]">
            Windows trọn đời – Office chỉ từ{" "}
            <span className="font-bold text-red-500 dark:text-red-400">
              {formatVnd(OFFICE_KEY_SALE_PRICE)}/năm
            </span>
          </p>
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-full">
            <svg className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[13px] font-semibold text-green-700 dark:text-green-400">Hỗ trợ xuất hóa đơn VAT đầy đủ theo yêu cầu</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
