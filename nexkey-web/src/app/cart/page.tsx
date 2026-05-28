"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { getProductById } from "@/lib/catalog";
import { formatVnd } from "@/lib/currency";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useStore } from "@/store/useStore";

export default function CartPage() {
  const {
    cart,
    setCartQty,
    removeFromCart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    couponCode,
    setCouponCode,
  } = useStore();

  const lines = useMemo(() => {
    return cart
      .map((l) => ({ ...l, product: getProductById(l.productId) }))
      .filter((l) => l.product);
  }, [cart]);

  return (
    <main className="container-page py-7">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Giỏ hàng
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Kiểm tra sản phẩm, áp mã giảm giá, và tiến hành thanh toán.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-3">
          {lines.length === 0 ? (
            <Card className="p-6">
              <div className="text-sm text-slate-700">
                Giỏ hàng đang trống.
              </div>
              <div className="mt-4">
                <Button href="/products" variant="outline">
                  Xem sản phẩm
                </Button>
              </div>
            </Card>
          ) : (
            lines.map((l) => (
              <Card key={l.productId} className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">
                      {l.product!.name}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      {formatVnd(l.product!.price)} • {l.product!.type}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-lg border border-border bg-white shadow-sm">
                      <button
                        aria-label="Giảm số lượng"
                        className="flex h-9 w-9 items-center justify-center rounded-l-lg text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        onClick={() =>
                          setCartQty(l.productId, Math.max(1, l.quantity - 1))
                        }
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        value={l.quantity}
                        onChange={(e) =>
                          setCartQty(l.productId, Number(e.target.value || 1))
                        }
                        className="h-9 w-12 border-x border-border text-center text-sm font-semibold text-slate-900 focus:outline-none"
                      />
                      <button
                        aria-label="Tăng số lượng"
                        className="flex h-9 w-9 items-center justify-center rounded-r-lg text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        onClick={() =>
                          setCartQty(l.productId, Math.min(99, l.quantity + 1))
                        }
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="w-28 text-right text-sm font-bold text-slate-900">
                      {formatVnd(l.product!.price * l.quantity)}
                    </div>

                    <button
                      aria-label="Xóa sản phẩm"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      onClick={() => removeFromCart(l.productId)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </section>

        <aside className="space-y-4">
          <Card className="p-5">
            <div className="text-sm font-semibold text-slate-900">
              Mã giảm giá
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Ví dụ: NEXKEY10"
                className="h-10 flex-1 rounded-lg border border-border bg-white px-3 text-sm shadow-sm focus:ring-2 focus:ring-ring"
              />
              <Button variant="outline" onClick={() => setCouponCode(couponCode)}>
                Áp dụng
              </Button>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Mã demo: <span className="font-semibold">NEXKEY10</span>,{" "}
              <span className="font-semibold">WELCOME20</span>
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-sm font-semibold text-slate-900">
              Tổng thanh toán
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Tạm tính</span>
                <span className="font-semibold text-slate-900">
                  {formatVnd(cartSubtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Giảm giá</span>
                <span className="font-semibold text-slate-900">
                  -{formatVnd(cartDiscount)}
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">Tổng</span>
                <span className="text-lg font-black text-slate-900">
                  {formatVnd(cartTotal)}
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <Button
                href="/checkout"
                className="w-full"
                disabled={lines.length === 0}
              >
                Tiến hành thanh toán
              </Button>
              <Button href="/products" variant="outline" className="w-full">
                Tiếp tục mua sắm
              </Button>
            </div>
          </Card>

          <div className="text-xs text-slate-500">
            Sau khi thanh toán thành công, key sẽ được gửi qua email và hiển thị
            tại trang{" "}
            <Link className="font-semibold hover:underline" href="/orders">
              đơn hàng
            </Link>
            .
          </div>
        </aside>
      </div>
    </main>
  );
}

