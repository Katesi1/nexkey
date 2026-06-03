import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";

const WARRANTY_STEPS = [
  {
    step: "01",
    title: "Liên hệ hỗ trợ",
    description:
      "Nhắn tin qua Zalo hoặc Facebook kèm mã đơn hàng và mô tả vấn đề bạn gặp phải.",
  },
  {
    step: "02",
    title: "Kiểm tra & xác nhận",
    description:
      "Đội ngũ kỹ thuật xác minh thông tin đơn hàng và kiểm tra lỗi key trong vòng 30 phút.",
  },
  {
    step: "03",
    title: "Cấp key thay thế",
    description:
      "Key mới được gửi ngay lập tức sau khi xác nhận lỗi từ phía nhà cung cấp, hoàn toàn miễn phí.",
  },
];

const COVERED_CASES = [
  {
    icon: "🔑",
    title: "Key lỗi do nhà cung cấp",
    description:
      "Key không kích hoạt được ngay từ đầu do lỗi kỹ thuật hoặc key đã được sử dụng trước đó.",
  },
  {
    icon: "🚫",
    title: "Key bị thu hồi không rõ lý do",
    description:
      "Microsoft thu hồi key mà không có cảnh báo trước và không liên quan đến hành vi của người dùng.",
  },
  {
    icon: "📦",
    title: "Key không đúng phiên bản",
    description:
      "Key không tương thích với phiên bản Windows đã cam kết tại thời điểm mua hàng.",
  },
];

const NOT_COVERED_CASES = [
  {
    icon: "🔄",
    title: "Tự ý cài lại / format không thông báo",
    description:
      "Cài đặt lại Windows hoặc format ổ cứng mà không báo trước để được hỗ trợ chuyển key.",
  },
  {
    icon: "💀",
    title: "Dùng phần mềm crack kèm theo",
    description:
      "Cài đặt các công cụ kích hoạt lậu, KMS activator hoặc phần mềm không bản quyền cùng lúc.",
  },
  {
    icon: "📋",
    title: "Vi phạm điều khoản Microsoft",
    description:
      "Sử dụng key trái với chính sách cấp phép của Microsoft, bao gồm dùng cho nhiều thiết bị hoặc bán lại.",
  },
];

export default function BaoHanhPage() {
  return (
    <div className="bg-slate-50 dark:bg-[#050b1a] min-h-screen transition-colors duration-300">
      <Header />

      <main className="pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-600 to-blue-700 dark:from-[#0a1e4a] dark:to-[#060f2a] py-14 sm:py-20">
          <div className="container-page text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              <span>🛡️</span>
              <span>Cam kết chất lượng</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Chính sách bảo hành
            </h1>
            <p className="text-blue-100 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
              NexKey cam kết bảo hành trọn đời cho mọi key Windows bản quyền —
              mua một lần, dùng vĩnh viễn.
            </p>
          </div>
        </section>

        <div className="container-page py-12 sm:py-16 space-y-12">

          {/* Thời hạn bảo hành */}
          <section>
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/60 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-500/20 p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-blue-600 dark:bg-blue-500/30 flex items-center justify-center text-3xl shadow-md shadow-blue-500/20">
                ♾️
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Thời hạn bảo hành: Trọn đời (Lifetime)
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  Không giống các nơi bán khác có thời hạn bảo hành 3–12 tháng,
                  NexKey bảo hành <strong className="text-blue-600 dark:text-blue-400">vĩnh viễn</strong> cho toàn bộ key
                  mua tại shop. Bạn sử dụng bao lâu, chúng tôi hỗ trợ bấy lâu — không
                  phát sinh thêm bất kỳ chi phí nào.
                </p>
              </div>
            </div>
          </section>

          {/* Phạm vi bảo hành */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
              <span className="text-2xl">✅</span>
              Phạm vi được bảo hành
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {COVERED_CASES.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-green-200 dark:border-green-500/20 bg-white dark:bg-[#0a1428] p-5 shadow-sm hover:shadow-md dark:hover:shadow-black/20 transition-shadow"
                >
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Quy trình bảo hành */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
              <span className="text-2xl">📋</span>
              Quy trình bảo hành
            </h2>
            <div className="relative">
              {/* Connecting line */}
              <div className="hidden sm:block absolute top-8 left-[calc(16.666%+1px)] right-[calc(16.666%+1px)] h-0.5 bg-blue-200 dark:bg-blue-500/20" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
                {WARRANTY_STEPS.map((item) => (
                  <div key={item.step} className="flex flex-col items-center text-center">
                    <div className="relative z-10 w-16 h-16 rounded-2xl bg-blue-600 dark:bg-blue-500/30 border-4 border-slate-50 dark:border-[#050b1a] flex items-center justify-center mb-4 shadow-md shadow-blue-500/20">
                      <span className="text-white font-bold text-lg">{item.step}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Điều kiện KHÔNG bảo hành */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
              <span className="text-2xl">⚠️</span>
              Trường hợp không được bảo hành
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {NOT_COVERED_CASES.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-red-200 dark:border-red-500/20 bg-white dark:bg-[#0a1428] p-5 shadow-sm"
                >
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Cam kết */}
          <section>
            <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0a1428] p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2.5">
                <span className="text-2xl">🤝</span>
                Cam kết của NexKey
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: "⚡", text: "Phản hồi bảo hành trong vòng 24 giờ kể từ khi nhận được yêu cầu." },
                  { icon: "🆓", text: "Hoàn toàn miễn phí — không thu thêm bất kỳ khoản phí nào cho bảo hành." },
                  { icon: "🔒", text: "Key thay thế được kiểm tra kỹ trước khi gửi, đảm bảo hoạt động 100%." },
                  { icon: "📞", text: "Hỗ trợ kỹ thuật 24/7 qua Zalo và Facebook — không giới hạn số lần liên hệ." },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <span className="flex-shrink-0 text-lg">{item.icon}</span>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section>
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 p-8 text-center shadow-lg shadow-blue-500/20">
              <p className="text-white/90 text-sm mb-2">
                Cần bảo hành hoặc có câu hỏi về chính sách?
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-5">
                Liên hệ trực tiếp với NexKey ngay hôm nay
              </h2>
              <a
                href="https://zalo.me/0917379181"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-white text-blue-700 font-bold px-7 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-md text-sm sm:text-base"
              >
                <svg viewBox="0 0 40 40" className="w-5 h-5 flex-shrink-0" fill="none">
                  <rect width="40" height="40" rx="8" fill="#0068FF" />
                  <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">Z</text>
                </svg>
                Liên hệ ngay qua Zalo
              </a>
            </div>
          </section>

        </div>
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
