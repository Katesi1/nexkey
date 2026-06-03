import Image from "next/image";

const STEPS = [
  {
    num: 1,
    icon: "/icons/chat-bubble.svg",
    title: "Liên hệ tư vấn",
    desc: "Liên hệ Zalo hoặc Facebook để được tư vấn và báo giá",
  },
  {
    num: 2,
    icon: "/icons/document.svg",
    title: "Cung cấp thông tin",
    desc: "Cung cấp thông tin máy tính để kiểm tra",
  },
  {
    num: 3,
    icon: "/icons/computer-monitor.svg",
    title: "Hỗ trợ kích hoạt",
    desc: "Hỗ trợ bạn kích hoạt key từ xa nhanh chóng",
  },
  {
    num: 4,
    icon: "/icons/check-circle-lifetime.svg",
    title: "Kích hoạt thành công",
    desc: "Kiểm tra và bàn giao – Bảo hành theo cam kết",
  },
];

const Arrow = () => (
  <div className="hidden lg:flex items-center justify-center flex-shrink-0 px-1 mt-6">
    <svg width="32" height="14" viewBox="0 0 32 14" fill="none" className="text-blue-300 dark:text-blue-700">
      <path d="M0 7H24M18 1L24 7L18 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

export function SupportProcess() {
  return (
    <section id="faq" className="py-20">
      <div className="container-page">
        {/* Title */}
        <div className="text-center mb-10">
          <span className="text-blue-600 dark:text-blue-400 text-xs font-bold tracking-[0.2em] uppercase">
            Quy trình hỗ trợ
          </span>
        </div>

        {/* Desktop: flex row with arrows between cards */}
        <div className="hidden lg:flex items-stretch gap-0">
          {STEPS.map((step, i) => (
            <div key={step.num} className="flex items-center flex-1 min-w-0">
              {/* Card */}
              <div className="relative flex-1 flex flex-col items-center text-center gap-3 bg-white dark:bg-[#0a1428] rounded-xl border border-slate-200 dark:border-white/[0.06] p-6 shadow-sm hover:shadow-md transition-shadow">
                {/* Number badge inside card, top-left */}
                <div className="absolute top-3 left-3 w-[30px] h-[30px] rounded-full bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30">
                  <span className="text-white font-extrabold text-[13px] leading-none">{step.num}</span>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center">
                  <Image src={step.icon} alt={step.title} width={24} height={24} className="dark:brightness-[1.3]" />
                </div>

                <h3 className="text-[13px] font-bold text-slate-800 dark:text-white">{step.title}</h3>
                <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </div>

              {/* Arrow between cards */}
              {i < STEPS.length - 1 && <Arrow />}
            </div>
          ))}
        </div>

        {/* Mobile: stacked cards */}
        <div className="flex flex-col gap-6 lg:hidden">
          {STEPS.map((step) => (
            <div key={step.num} className="relative flex flex-col items-center text-center gap-3 bg-white dark:bg-[#0a1428] rounded-xl border border-slate-200 dark:border-white/[0.06] p-6 shadow-sm">
              <div className="absolute top-3 left-3 w-[30px] h-[30px] rounded-full bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30">
                <span className="text-white font-extrabold text-[13px] leading-none">{step.num}</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center">
                <Image src={step.icon} alt={step.title} width={24} height={24} className="dark:brightness-[1.3]" />
              </div>
              <h3 className="text-[13px] font-bold text-slate-800 dark:text-white">{step.title}</h3>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
