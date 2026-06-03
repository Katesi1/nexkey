import Image from "next/image";

export function CTASection() {
  return (
    <section
      id="contact"
      className="py-14 bg-gradient-to-r from-[#0a1a45] via-[#0f2060] to-[#0a1a45] dark:from-[#060f2e] dark:via-[#0a1848] dark:to-[#060f2e] relative overflow-hidden"
    >
      {/* Decorative circles */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full bg-white/[0.04] border border-white/[0.08]" />
      <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full bg-white/[0.04] border border-white/[0.08] hidden lg:block" />
      <div className="absolute right-[15%] top-1/2 -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-white/[0.03] border border-white/[0.06] hidden lg:block" />

      <div className="container-page relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-7">
          <div className="flex items-center gap-5">
            <div className="w-[60px] h-[60px] rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 shadow-xl">
              <Image src="/icons/headset-mic.svg" alt="Hỗ trợ" width={28} height={28} className="brightness-0 invert" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white mb-1">Cần hỗ trợ ngay?</h3>
              <p className="text-blue-200 text-[14px] leading-relaxed">
                Đội ngũ của chúng tôi luôn sẵn sàng
                <br className="hidden sm:block" />
                hỗ trợ bạn 24/7
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 flex-shrink-0">
            <a
              href="https://zalo.me/0917379181"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-7 py-4 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:-translate-y-1 hover:shadow-xl transition-all duration-200 text-[15px]"
            >
              <Image src="/icons/zalo.svg" alt="Zalo" width={24} height={24} className="rounded-sm" />
              Chat Zalo ngay
            </a>
            <a
              href="https://www.facebook.com/nguyen.vu.nam.2001"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-7 py-4 bg-[#1877f2] hover:bg-[#1265d8] active:scale-95 border border-white/20 text-white font-bold rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all duration-200 text-[15px] shadow-lg shadow-blue-900/40"
            >
              <Image src="/icons/facebook.svg" alt="Facebook" width={24} height={24} className="brightness-0 invert" />
              Nhắn Facebook
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
