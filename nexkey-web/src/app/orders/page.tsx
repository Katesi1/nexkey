"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import { formatVnd } from "@/lib/currency";

export default function OrdersPage() {
  const { orders } = useStore();

  return (
    <main className="container-page py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Đơn hàng của tôi
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Xem lịch sử đơn hàng và trạng thái giao key/tài khoản.
        </p>
      </div>

      {orders.length === 0 ? (
        <Card className="p-6">
          <div className="text-sm text-slate-700">
            Bạn chưa có đơn hàng nào.
          </div>
          <div className="mt-4">
            <Button href="/products" variant="outline">
              Mua sản phẩm
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Card key={o.id} className="p-5">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <div className="text-sm font-extrabold text-slate-900">
                      {o.id}
                    </div>
                    <div
                      className={`text-xs font-semibold ${
                        o.status === "Đã giao hàng"
                          ? "text-emerald-700"
                          : o.status === "Đã hủy"
                            ? "text-rose-700"
                            : "text-slate-600"
                      }`}
                    >
                      {o.status}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(o.createdAt).toLocaleString("vi-VN")}
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {o.items.map((i) => i.name).join(" • ")}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <div className="text-sm font-black text-slate-900">
                    {formatVnd(o.total)}
                  </div>
                  <Button href={`/orders/${encodeURIComponent(o.id)}`} size="sm">
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 text-xs text-slate-500">
        Nếu cần hỗ trợ/bảo hành, hãy vào{" "}
        <Link className="font-semibold hover:underline" href="/support">
          trang hỗ trợ
        </Link>{" "}
        và gửi mã đơn hàng.
      </div>
    </main>
  );
}

