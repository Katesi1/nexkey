import Image from "next/image";

const REASONS = [
  {
    icon: "/icons/shield-authentic.svg",
    title: "Uy tín hàng đầu",
    desc: "Hàng nghìn khách hàng đã tin tưởng",
  },
  {
    icon: "/icons/star-warranty.svg",
    title: "Kích hoạt 100%",
    desc: "Cam kết kích hoạt thành công",
  },
  {
    icon: "/icons/headphones-support.svg",
    title: "Hỗ trợ tận tâm",
    desc: "Hỗ trợ trước – trong – sau khi kích hoạt",
  },
  {
    icon: "/icons/thumbs-up.svg",
    title: "Giá tốt nhất",
    desc: "Chi phí hợp lý – Cạnh tranh",
  },
  {
    icon: "/icons/padlock.svg",
    title: "Bảo mật tuyệt đối",
    desc: "Thông tin khách hàng được bảo mật",
  },
];

export function WhyChooseUs() {
  return (
    <section id="guides" className="py-20">
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="text-blue-600 dark:text-blue-400 text-xs font-bold tracking-[0.2em] uppercase block">
            Vì sao chọn NexKey?
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {REASONS.map((r) => (
            <div key={r.title} className="flex flex-col items-center text-center gap-3 group">
              <div className="w-14 h-14 rounded-full border-2 border-blue-100 dark:border-blue-500/25 bg-blue-50/50 dark:bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Image
                  src={r.icon}
                  alt={r.title}
                  width={28}
                  height={28}
                  className="dark:brightness-[1.3]"
                />
              </div>
              <div>
                <div className="text-[13px] font-bold text-slate-800 dark:text-white leading-snug mb-1">
                  {r.title}
                </div>
                <div className="text-[12px] text-slate-500 dark:text-slate-400 leading-snug">
                  {r.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
