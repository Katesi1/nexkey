import { Phone, Clock, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0d1526] dark:bg-[#030810] text-slate-300 border-t border-slate-800 dark:border-white/[0.04]">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* Col 1: Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-md shadow-blue-700/30">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <div>
                <div className="font-bold text-white text-[14px]">NexKey</div>
                <div className="text-[10px] text-slate-500">Windows License Service</div>
              </div>
            </div>
            <p className="text-[12px] text-slate-400 leading-relaxed">
              Chuyên cung cấp key Windows bản quyền chính hãng – Kích hoạt
              online 100% – Hỗ trợ từ xa 24/7 – Uy tín hàng đầu.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-sky-500 hover:bg-sky-600 flex items-center justify-center transition-colors"
                aria-label="Zalo"
              >
                <MessageCircle size={13} className="text-white" />
              </a>
            </div>
          </div>

          {/* Col 2: Products */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-[13px]">Sản phẩm</h4>
            <ul className="space-y-2.5">
              {["Windows 11 Pro", "Windows 10 Pro"].map((item) => (
                <li key={item}>
                  <a href="#products" className="text-[12px] text-slate-400 hover:text-blue-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Support */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-[13px]">Hỗ trợ</h4>
            <ul className="space-y-2.5">
              {["Hướng dẫn kích hoạt", "Câu hỏi thường gặp", "Chính sách bảo hành"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[12px] text-slate-400 hover:text-blue-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-[13px]">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone size={12} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-[12px] text-slate-400">Zalo: 0917 379 181</span>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle size={12} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-[12px] text-slate-400">Facebook: NexKey Support</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={12} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-[12px] text-slate-400">Thời gian: 24/7 tất cả các ngày</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 dark:border-white/[0.04]">
        <div className="container-page py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[11px] text-slate-500">© 2024 NexKey. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors">
              Chính sách bảo mật
            </a>
            <a href="#" className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors">
              Điều khoản sử dụng
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
