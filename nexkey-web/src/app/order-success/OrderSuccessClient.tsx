"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import { formatVnd } from "@/lib/currency";

function CopyButton({ value }: { value: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          // ignore
        }
      }}
    >
      Copy
    </Button>
  );
}

export function OrderSuccessClient() {
  const sp = useSearchParams();
  const { orders } = useStore();
  const orderId = sp.get("orderId");

  const order = useMemo(() => {
    if (orderId) return orders.find((o) => o.id === orderId) ?? null;
    return orders[0] ?? null;
  }, [orders, orderId]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
          ✓
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Đặt hàng thành công!
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Cảm ơn bạn đã mua hàng tại NexKey.
          </p>
        </div>
      </div>

      {!order ? (
        <Card className="mt-6 p-6">
          <div className="text-sm text-slate-700">
            Không tìm thấy đơn hàng. Vui lòng vào trang đơn hàng của tôi.
          </div>
          <div className="mt-4">
            <Button href="/orders" variant="outline">
              Xem đơn hàng của tôi
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <Card className="mt-6 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-xs font-semibold text-slate-500">
                  Mã đơn hàng
                </div>
                <div className="mt-1 text-sm font-bold text-slate-900">
                  {order.id}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">
                  Trạng thái
                </div>
                <div className="mt-1 text-sm font-bold text-emerald-700">
                  {order.status}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">
                  Tổng tiền
                </div>
                <div className="mt-1 text-sm font-bold text-slate-900">
                  {formatVnd(order.total)}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">
                  Email nhận hàng
                </div>
                <div className="mt-1 text-sm font-bold text-slate-900">
                  {order.customer.email}
                </div>
              </div>
            </div>
          </Card>

          <Card className="mt-4 p-6">
            <div className="text-sm font-semibold text-slate-900">
              Key / tài khoản được giao
            </div>
            <div className="mt-4 space-y-3">
              {order.delivered.map((d) => (
                <div
                  key={`${d.productId}-${d.value}`}
                  className="rounded-2xl border border-border bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900">
                        {d.label}
                      </div>
                      <div className="mt-1 break-all font-mono text-sm text-slate-700">
                        {d.value}
                      </div>
                      {d.hint ? (
                        <div className="mt-1 text-xs text-slate-500">
                          {d.hint}
                        </div>
                      ) : null}
                    </div>
                    <CopyButton value={d.value} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button href="/guides" variant="outline">
                Xem hướng dẫn kích hoạt
              </Button>
              <Button href="/orders" variant="secondary">
                Xem đơn hàng của tôi
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

