import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-slate-950 text-slate-200">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand-from via-brand-via to-brand-to text-white">
                <span className="text-sm font-semibold tracking-tight">NK</span>
              </div>
              <div>
                <div className="text-base font-semibold tracking-tight">NexKey</div>
                <div className="text-sm text-slate-400">
                  Digital keys & subscriptions
                </div>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-400">
              Chuyên cung cấp key Windows/Office và các gói subscription chính
              hãng. Giao tự động sau thanh toán, hỗ trợ 24/7.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-white">Liên kết nhanh</div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link className="hover:text-white" href="/products">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/guides">
                  Hướng dẫn kích hoạt
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/support">
                  Hỗ trợ & bảo hành
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/orders">
                  Đơn hàng của tôi
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-white">Thanh toán</div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Chuyển khoản ngân hàng</li>
              <li>VietQR</li>
              <li>MoMo</li>
              <li>VNPay</li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-white">Hỗ trợ</div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Email: support@nexkey.vn</li>
              <li>Hotline: 24/7</li>
              <li>Thời gian giao: tự động</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-800 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} NexKey. All rights reserved.</div>
          <div className="flex gap-4">
            <span>Chính sách bảo hành</span>
            <span>Điều khoản</span>
            <span>Bảo mật</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

