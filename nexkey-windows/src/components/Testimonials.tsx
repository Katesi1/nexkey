import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    stars: 5,
    text: "Kích hoạt Windows 11 Pro nhanh chóng, hỗ trợ nhiệt tình, key dùng ổn định.",
    name: "Minh Tuấn",
    initials: "MT",
    color: "from-blue-500 to-blue-700",
  },
  {
    stars: 5,
    text: "Hỗ trợ cài đặt từ xa chuyên nghiệp, giải đáp mọi thắc mắc rất nhanh.",
    name: "Hoàng Nam",
    initials: "HN",
    color: "from-green-500 to-emerald-700",
  },
  {
    stars: 5,
    text: "Mua key Windows 10 Pro trọn đời, giá tốt, uy tín, sẽ ủng hộ lâu dài.",
    name: "Thảo Vy",
    initials: "TV",
    color: "from-purple-500 to-purple-700",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-20 bg-white dark:bg-[#060d20]">
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="text-blue-600 dark:text-blue-400 text-xs font-bold tracking-[0.2em] uppercase block">
            Khách hàng nói gì về chúng tôi
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-slate-50 dark:bg-[#0a1428] rounded-2xl border border-slate-200 dark:border-white/[0.06] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
            >
              <Stars count={t.stars} />

              <p className="text-[13.5px] text-slate-700 dark:text-slate-300 leading-relaxed flex-1">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-200 dark:border-white/[0.06]">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-xs font-bold">{t.initials}</span>
                </div>
                <span className="text-[13px] font-semibold text-slate-800 dark:text-white">
                  {t.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
