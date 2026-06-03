import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

interface ProductCardProps {
  version: "11" | "10";
  name: string;
  subtitle: string;
  features: string[];
  buttonColor: string;
  hoverColor: string;
  shadowColor: string;
  borderColor: string;
  accent: string;
}

function ProductCard({
  version,
  name,
  subtitle,
  features,
  buttonColor,
  hoverColor,
  shadowColor,
  borderColor,
  accent,
}: ProductCardProps) {
  return (
    <div className={`bg-white dark:bg-[#0a1428] rounded-2xl border ${borderColor} shadow-lg dark:shadow-[#000]/30 hover:shadow-xl transition-shadow duration-300`}>
      <div className="p-4 sm:p-5 flex flex-col gap-4">

        {/* Top: image left + text right */}
        <div className="flex items-center gap-5 sm:gap-6">
          {/* Product box image */}
          <div className="relative w-[110px] h-[145px] sm:w-[150px] sm:h-[198px] lg:w-[170px] lg:h-[224px] flex-shrink-0">
            <Image
              src={`/images/box-window${version}.png`}
              alt={`Windows ${version} Professional`}
              fill
              className="object-contain drop-shadow-xl"
              sizes="140px"
            />
          </div>

          {/* Title + features */}
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <h3 className={`text-[17px] font-bold ${accent} mb-0.5`}>{name}</h3>
              <p className="text-[12px] text-slate-600 dark:text-slate-400 font-medium">{subtitle}</p>
            </div>
            <ul className="space-y-1.5">
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
            Trọn đời
          </div>
          <a
            href="https://zalo.me"
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
    version: "11",
    name: "Windows 11 Pro",
    subtitle: "Key bản quyền trọn đời",
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
    version: "10",
    name: "Windows 10 Pro",
    subtitle: "Key bản quyền trọn đời",
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
];

export function Products() {
  return (
    <section id="products" className="py-20 bg-slate-50 dark:bg-[#050b1a]">
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="text-blue-600 dark:text-blue-400 text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
            Sản phẩm Windows
          </span>
          <h2 className="text-3xl sm:text-[34px] font-extrabold text-slate-900 dark:text-white mb-3">
            Key Windows bản quyền trọn đời
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-[15px]">
            Kích hoạt online – Sử dụng vĩnh viễn – Không gia hạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.version} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
