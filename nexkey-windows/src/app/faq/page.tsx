import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";

const FAQ_ITEMS = [
  {
    question: "Key Windows bản quyền là gì?",
    answer:
      "Key Windows bản quyền (Product Key) là một chuỗi ký tự 25 chữ số dùng để kích hoạt hệ điều hành Windows với Microsoft. Key được cấp phép hợp lệ theo chính sách OEM hoặc Retail của Microsoft, giúp máy tính của bạn hoạt động đầy đủ tính năng, nhận cập nhật bảo mật và không bị giới hạn bởi thông báo \"Windows chưa được kích hoạt\".",
  },
  {
    question: "Sau khi mua key, tôi kích hoạt như thế nào?",
    answer:
      "Sau khi nhận được key, bạn thực hiện kích hoạt theo các bước: Vào Settings → System → Activation → Change product key → Nhập key 25 ký tự → Nhấn Next và chờ xác nhận. Toàn bộ quá trình diễn ra online và hoàn tất trong vài phút. NexKey cũng hỗ trợ kích hoạt từ xa qua Zalo nếu bạn cần trợ giúp.",
  },
  {
    question: "Key có sử dụng vĩnh viễn không hay phải gia hạn?",
    answer:
      "Key Windows tại NexKey là bản quyền vĩnh viễn (lifetime), không cần gia hạn định kỳ. Sau khi kích hoạt thành công, Windows được bản quyền mãi mãi trên máy tính của bạn. Bạn cũng được nhận miễn phí tất cả các bản cập nhật tính năng và bảo mật từ Microsoft.",
  },
  {
    question: "Một key có thể dùng cho mấy máy tính?",
    answer:
      "Mỗi key chỉ kích hoạt được cho một máy tính duy nhất. Đây là chính sách cấp phép chuẩn của Microsoft. Nếu bạn cần kích hoạt cho nhiều máy, vui lòng mua số lượng key tương ứng. NexKey có giá ưu đãi cho đơn hàng số lượng lớn.",
  },
  {
    question: "Key có hoạt động với Windows 11 Home không?",
    answer:
      "Có. NexKey cung cấp key riêng biệt cho từng phiên bản: Windows 11 Home, Windows 11 Pro, Windows 10 Home và Windows 10 Pro. Hãy chắc chắn bạn chọn đúng phiên bản phù hợp với máy tính của mình. Nếu không chắc, đội ngũ hỗ trợ sẵn sàng tư vấn miễn phí qua Zalo.",
  },
  {
    question: "Tôi có thể tự cài đặt hay cần hỗ trợ?",
    answer:
      "Bạn hoàn toàn có thể tự kích hoạt theo hướng dẫn chi tiết mà NexKey gửi kèm. Tuy nhiên, nếu gặp khó khăn, đội ngũ kỹ thuật hỗ trợ từ xa 24/7 qua Zalo — hoàn toàn miễn phí. Chúng tôi có thể kết nối điều khiển từ xa (TeamViewer / AnyDesk) để hỗ trợ trực tiếp nếu cần.",
  },
  {
    question: "Nếu key không kích hoạt được thì sao?",
    answer:
      "Trường hợp key không kích hoạt được do lỗi từ phía nhà cung cấp, NexKey sẽ cấp key thay thế miễn phí trong vòng 24 giờ theo chính sách bảo hành trọn đời. Bạn chỉ cần liên hệ qua Zalo kèm thông tin đơn hàng và mô tả lỗi gặp phải.",
  },
  {
    question: "Thanh toán bằng hình thức nào?",
    answer:
      "NexKey hỗ trợ nhiều hình thức thanh toán tiện lợi: chuyển khoản ngân hàng (Vietcombank, Techcombank, MB Bank...), ví MoMo, ZaloPay và tiền mặt (đối với khách hàng ở TP.HCM). Sau khi thanh toán xác nhận, key được gửi tức thì qua Zalo hoặc tin nhắn.",
  },
  {
    question: "Mua key xong bao lâu nhận được?",
    answer:
      "Key được giao tức thì ngay sau khi xác nhận thanh toán — thường trong vòng 5 đến 15 phút trong giờ hành chính. Ngoài giờ hoặc ban đêm, thời gian giao không quá 30 phút. NexKey hoạt động 24/7 nên bạn không cần lo lắng về việc chờ đợi lâu.",
  },
  {
    question: "Có hỗ trợ sau khi mua không?",
    answer:
      "Có. NexKey cam kết hỗ trợ kỹ thuật miễn phí trọn đời sau mua. Dù bạn gặp vấn đề kích hoạt, cài đặt lại Windows hay bất kỳ câu hỏi nào liên quan, đội ngũ kỹ thuật luôn sẵn sàng hỗ trợ qua Zalo và Facebook 24/7.",
  },
  {
    question: "NexKey có xuất hóa đơn VAT không?",
    answer:
      "Có. NexKey hỗ trợ xuất hóa đơn VAT (hóa đơn đỏ) đầy đủ theo yêu cầu cho cá nhân và doanh nghiệp. Để yêu cầu hóa đơn, bạn cung cấp thông tin gồm: tên công ty / cá nhân, mã số thuế, địa chỉ và email nhận hóa đơn. Hóa đơn được xuất và gửi qua email trong vòng 1–2 ngày làm việc sau khi hoàn tất giao dịch.",
  },
  {
    question: "Hóa đơn VAT có giá trị pháp lý không?",
    answer:
      "Có. Hóa đơn do NexKey xuất là hóa đơn điện tử theo Nghị định 123/2020/NĐ-CP, có đầy đủ giá trị pháp lý để doanh nghiệp hạch toán chi phí, khấu trừ thuế GTGT và làm chứng từ kế toán. Nếu bạn cần hóa đơn ngay khi thanh toán, hãy thông báo trước khi đặt hàng để chúng tôi chuẩn bị.",
  },
];

export default function FAQPage() {
  return (
    <div className="bg-slate-50 dark:bg-[#050b1a] min-h-screen transition-colors duration-300">
      <Header />

      <main className="pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-600 to-blue-700 dark:from-[#0a1e4a] dark:to-[#060f2a] py-14 sm:py-20">
          <div className="container-page text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              <span>💬</span>
              <span>Hỗ trợ khách hàng</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Câu hỏi thường gặp
            </h1>
            <p className="text-blue-100 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
              Giải đáp nhanh những thắc mắc phổ biến nhất về key Windows bản
              quyền tại NexKey.
            </p>
          </div>
        </section>

        {/* FAQ List */}
        <section className="py-12 sm:py-16">
          <div className="container-page max-w-3xl">
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, index) => (
                <details
                  key={index}
                  className="group border border-slate-200 dark:border-white/[0.08] rounded-xl bg-white dark:bg-[#0a1428] shadow-sm hover:shadow-md dark:hover:shadow-black/20 transition-shadow overflow-hidden"
                >
                  <summary className="cursor-pointer flex items-start justify-between gap-4 px-5 py-4 select-none">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center mt-0.5">
                        {index + 1}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-snug">
                        {item.question}
                      </span>
                    </div>
                    <span className="flex-shrink-0 w-5 h-5 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center text-slate-400 dark:text-slate-500 mt-0.5 transition-transform group-open:rotate-45">
                      <svg viewBox="0 0 12 12" className="w-3 h-3 fill-current">
                        <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-5 pb-4 pt-1 border-t border-slate-100 dark:border-white/[0.05] bg-slate-50/50 dark:bg-white/[0.02]">
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed pl-9">
                      {item.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 p-8 text-center shadow-lg shadow-blue-500/20">
              <p className="text-white/90 text-sm mb-2">
                Không tìm thấy câu trả lời bạn cần?
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-5">
                Liên hệ trực tiếp với NexKey
              </h2>
              <a
                href="https://zalo.me/0325992001"
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
          </div>
        </section>
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
