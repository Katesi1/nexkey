"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatVnd } from "@/lib/currency";
import { getProductById, cacheProducts, getCachedProducts } from "@/lib/catalog";
import { fetchPublicProducts } from "@/lib/api";
import { mapApiProduct } from "@/lib/mappers";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import type { PaymentMethod } from "@/lib/types";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    placeOrder,
    user,
  } = useStore();

  const [ready, setReady] = useState(getCachedProducts().length > 0);

  useEffect(() => {
    if (getCachedProducts().length > 0) { setReady(true); return; }
    fetchPublicProducts()
      .then(api => {
        cacheProducts(api.map(p => mapApiProduct(p, api)));
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  const lines = useMemo(
    () => ready
      ? cart.map((l) => ({ ...l, product: getProductById(l.productId) })).filter((l) => l.product)
      : [],
    [cart, ready],
  );

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [method, setMethod] = useState<PaymentMethod>("vietqr");
  const [note, setNote]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  return (
    <main className="container-page py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Thanh toán
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Điền thông tin khách hàng và chọn phương thức thanh toán (mock).
        </p>
      </div>

      {lines.length === 0 ? (
        <Card className="p-6">
          <div className="text-sm text-slate-700">
            Bạn chưa có sản phẩm trong giỏ.
          </div>
          <div className="mt-4">
            <Button href="/products" variant="outline">
              Quay lại sản phẩm
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <section className="space-y-4">
            <Card className="p-6">
              <div className="text-sm font-semibold text-slate-900">
                Thông tin khách
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <div className="text-xs font-semibold text-slate-600">
                    Họ tên
                  </div>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-border bg-white px-3 text-sm shadow-sm focus:ring-2 focus:ring-ring"
                    placeholder="Nguyễn Văn A"
                  />
                </label>
                <label className="block">
                  <div className="text-xs font-semibold text-slate-600">Email</div>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-border bg-white px-3 text-sm shadow-sm focus:ring-2 focus:ring-ring"
                    placeholder="email@example.com"
                  />
                </label>
                <label className="block">
                  <div className="text-xs font-semibold text-slate-600">
                    Số điện thoại
                  </div>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-border bg-white px-3 text-sm shadow-sm focus:ring-2 focus:ring-ring"
                    placeholder="0900xxxxxx"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <div className="text-xs font-semibold text-slate-600">
                    Ghi chú (tuỳ chọn)
                  </div>
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-border bg-white px-3 text-sm shadow-sm focus:ring-2 focus:ring-ring"
                    placeholder="Ví dụ: cần hỗ trợ kích hoạt"
                  />
                </label>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-sm font-semibold text-slate-900">
                Phương thức thanh toán
              </div>
              <div className="mt-4 grid gap-2">
                {[
                  { id: "bank", label: "Chuyển khoản ngân hàng" },
                  { id: "vietqr", label: "VietQR" },
                  { id: "momo", label: "MoMo" },
                  { id: "vnpay", label: "VNPay" },
                ].map((m) => (
                  <label
                    key={m.id}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-white p-4 hover:bg-slate-50"
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={method === m.id}
                      onChange={() => setMethod(m.id as PaymentMethod)}
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900">
                        {m.label}
                      </div>
                      <div className="text-xs text-slate-500">
                        Mô phỏng thanh toán — sẽ nối API thật sau.
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </Card>
          </section>

          <aside className="space-y-4">
            <Card className="p-6">
              <div className="text-sm font-semibold text-slate-900">
                Tóm tắt đơn hàng
              </div>
              <div className="mt-4 space-y-3">
                {lines.map((l) => (
                  <div key={l.productId} className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <div className="line-clamp-2 text-sm font-semibold text-slate-900">
                        {l.product!.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        SL: {l.quantity}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {formatVnd(l.product!.price * l.quantity)}
                    </div>
                  </div>
                ))}
                <div className="h-px bg-border" />
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-slate-900">
                    {formatVnd(cartSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Giảm giá</span>
                  <span className="font-semibold text-slate-900">
                    -{formatVnd(cartDiscount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-slate-900">
                    Tổng
                  </span>
                  <span className="text-lg font-black text-slate-900">
                    {formatVnd(cartTotal)}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-border bg-slate-50 p-4 text-xs text-slate-600">
                Sau khi thanh toán thành công, key sẽ được gửi qua email và hiển
                thị tại trang đơn hàng.
              </div>

              {error && (
                <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}
              <div className="mt-5 space-y-2">
                <Button
                  className="w-full"
                  disabled={loading || !fullName || !email}
                  onClick={async () => {
                    if (!fullName.trim() || !email.trim()) {
                      setError("Vui lòng điền họ tên và email.");
                      return;
                    }
                    setLoading(true);
                    setError(null);
                    try {
                      const order = await placeOrder({
                        customer: { fullName, email, phone },
                        paymentMethod: method,
                        note: note || undefined,
                      });
                      router.push(`/order-success?orderId=${encodeURIComponent(order.id)}`);
                    } catch (e) {
                      setError(e instanceof Error ? e.message : "Đặt hàng thất bại. Vui lòng thử lại.");
                      setLoading(false);
                    }
                  }}
                >
                  {loading ? "Đang xử lý…" : "Xác nhận thanh toán"}
                </Button>
                <Button href="/cart" variant="outline" className="w-full">
                  Quay lại giỏ hàng
                </Button>
              </div>
            </Card>

            <div className="text-xs text-slate-500">
              Bằng việc thanh toán, bạn đồng ý với điều khoản và chính sách của
              NexKey. Xem{" "}
              <Link className="font-semibold hover:underline" href="/support">
                hỗ trợ/bảo hành
              </Link>{" "}
              khi cần.
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

