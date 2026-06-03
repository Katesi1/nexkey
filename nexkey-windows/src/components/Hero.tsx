import Image from "next/image";
import { CheckCircle2, MapPin } from "lucide-react";

const FEATURES = [
  "Key bản quyền chính hãng",
  "Hỗ trợ cài đặt từ xa",
  "Kích hoạt online 100%",
  "Bảo hành dài hạn",
  "Sử dụng trọn đời – Không gia hạn",
  "Uy tín – Nhanh chóng – An toàn",
];

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white dark:bg-[#050b1a] pt-16"
    >
      <div className="container-page">
        <div className="flex items-center gap-8 py-12 sm:py-14 lg:py-16">

          {/* Left: content */}
          <div className="flex-1 min-w-0 z-10">

            {/* Label */}
            <span className="inline-block px-3 sm:px-4 py-1.5 bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 text-[11px] sm:text-xs font-bold tracking-[0.15em] uppercase rounded-full border border-blue-200 dark:border-blue-500/30 mb-4 sm:mb-5">
              Dịch vụ kích hoạt Windows chính hãng
            </span>

            {/* Heading */}
            <h1 className="text-[28px] sm:text-[34px] lg:text-[40px] xl:text-[44px] font-extrabold text-slate-900 dark:text-white leading-[1.2] tracking-tight mb-3 sm:mb-4">
              Windows 11 &amp; Windows 10
              <span className="block text-blue-600 dark:text-blue-400 mt-1">
                Key bản quyền trọn đời
              </span>
            </h1>

            {/* Sub */}
            <p className="text-[13.5px] sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed mb-5 sm:mb-6">
              Cung cấp key Windows chính hãng – Kích hoạt online 100%
              <br className="hidden sm:block" />
              Hỗ trợ cài đặt từ xa nhanh chóng – Bảo hành uy tín.
            </p>

            {/* Feature checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 mb-6 sm:mb-7">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-blue-500 dark:text-blue-400 flex-shrink-0" />
                  <span className="text-[13px] sm:text-[13.5px] text-slate-800 dark:text-slate-200">{f}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-5">
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-all text-sm"
              >
                <Image src="/icons/zalo.svg" alt="Zalo" width={20} height={20} className="rounded-sm flex-shrink-0" />
                Liên hệ Zalo
              </a>
              <a
                href="https://www.facebook.com/nguyen.vu.nam.2001"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 bg-[#1877f2] hover:bg-[#1265d8] active:scale-95 text-white font-bold rounded-xl hover:-translate-y-0.5 transition-all text-sm shadow-md"
              >
                <Image src="/icons/facebook.svg" alt="Facebook" width={20} height={20} className="brightness-0 invert flex-shrink-0" />
                Nhắn Facebook
              </a>
            </div>

            {/* Trust line */}
            <p className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <MapPin size={13} className="text-blue-400 flex-shrink-0" />
              Tư vấn nhanh – Báo giá ngay – Hỗ trợ tận tâm
            </p>

          </div>

          {/* Right: banner image — ẩn trên mobile, hiện từ md+ */}
          <div className="hidden md:flex flex-shrink-0 items-center justify-end w-[50%] lg:w-[52%] xl:w-[55%]">
            <Image
              src="/images/banner-win-crop.png"
              alt="Windows 11 & Windows 10"
              width={860}
              height={600}
              className="w-full h-auto object-contain drop-shadow-2xl"
              quality={95}
              priority
            />
          </div>

        </div>
      </div>
    </section>
  );
}
