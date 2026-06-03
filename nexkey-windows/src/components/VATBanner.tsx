import { FileText, CheckCircle2, Building2, ArrowRight } from "lucide-react";

const POINTS = [
  "Hóa đơn điện tử theo Nghị định 123/2020/NĐ-CP",
  "Hợp lệ để hạch toán chi phí doanh nghiệp",
  "Khấu trừ thuế GTGT đầy đủ",
  "Gửi qua email trong 1–2 ngày làm việc",
];

export function VATBanner() {
  return (
    <section className="py-10">
      <div className="container-page">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 shadow-xl shadow-emerald-500/20">
          {/* decorative blobs */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 right-32 w-28 h-28 rounded-full bg-white/[0.06]" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 px-7 py-8 sm:px-10 sm:py-9">

            {/* Icon */}
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg">
              <FileText size={32} className="text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-white/90 text-[11px] font-bold tracking-widest uppercase mb-2">
                <Building2 size={11} />
                Dành cho cá nhân &amp; doanh nghiệp
              </div>
              <h3 className="text-white font-extrabold text-xl sm:text-2xl mb-1">
                Hỗ trợ xuất hóa đơn VAT đầy đủ
              </h3>
              <p className="text-emerald-100 text-[13.5px] mb-4">
                Mua key Windows và nhận hóa đơn đỏ hợp lệ — hạch toán chi phí, khấu trừ thuế GTGT dễ dàng.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-6">
                {POINTS.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-200 flex-shrink-0" />
                    <span className="text-white text-[12.5px]">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="flex-shrink-0">
              <a
                href="https://zalo.me/0325992001"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-emerald-50 active:scale-95 text-emerald-700 font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 text-sm whitespace-nowrap"
              >
                Yêu cầu hóa đơn
                <ArrowRight size={15} />
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
