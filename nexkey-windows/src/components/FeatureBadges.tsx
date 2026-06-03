import Image from "next/image";

const BADGES = [
  { icon: "/icons/shield-authentic.svg",     title: "CHÍNH HÃNG",       desc: "Key bản quyền 100%" },
  { icon: "/icons/lightning-online.svg",     title: "KÍCH HOẠT ONLINE", desc: "Nhanh chóng trong 1 phút" },
  { icon: "/icons/headphones-support.svg",   title: "HỖ TRỢ 24/7",      desc: "Hỗ trợ tận tâm mọi lúc" },
  { icon: "/icons/star-warranty.svg",        title: "BẢO HÀNH DÀI HẠN", desc: "Yên tâm sử dụng" },
  { icon: "/icons/check-circle-lifetime.svg",title: "TRỌN ĐỜI",         desc: "Không giới hạn thời gian" },
];

function BadgeItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-2 flex-shrink-0 w-[160px]">
      <div className="w-11 h-11 flex items-center justify-center">
        <Image src={icon} alt={title} width={38} height={38} className="dark:brightness-[1.3]" />
      </div>
      <div>
        <div className="text-[11px] font-bold text-slate-800 dark:text-white tracking-wide leading-snug">
          {title}
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          {desc}
        </div>
      </div>
    </div>
  );
}

export function FeatureBadges() {
  return (
    <section className="py-7">
      <div className="container-page">
        <div className="relative overflow-hidden">
          {/* fade trái */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-slate-50 dark:from-[#050b1a] to-transparent" />
          {/* fade phải */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-slate-50 dark:from-[#050b1a] to-transparent" />

          {/* track — 4 bản sao để không thấy khoảng trống */}
          <div
            className="flex gap-6"
            style={{ animation: "marquee 20s linear infinite", width: "max-content" }}
          >
            {[...BADGES, ...BADGES, ...BADGES, ...BADGES].map((badge, i) => (
              <BadgeItem key={i} {...badge} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
