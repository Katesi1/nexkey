"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";
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

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { orders } = useStore();
  const order = useMemo(
    () => orders.find((o) => o.id === params.id) ?? null,
    [orders, params.id],
  );

  if (!order) return notFound();

  return (
    <main className="container-page py-8">
      <div className="mb-5 text-sm text-slate-600">
        <Link className="hover:underline" href="/orders">
          Đơn hàng của tôi
        </Link>{" "}
        <span className="text-slate-400">/</span>{" "}
        <span className="text-slate-900">{order.id}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="space-y-4">
          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-900">
              Thông tin đơn hàng
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-xs font-semibold text-slate-500">Mã đơn</div>
                <div className="mt-1 text-sm font-bold text-slate-900">
                  {order.id}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">Ngày mua</div>
                <div className="mt-1 text-sm font-bold text-slate-900">
                  {new Date(order.createdAt).toLocaleString("vi-VN")}
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
                  Phương thức
                </div>
                <div className="mt-1 text-sm font-bold text-slate-900">
                  {order.paymentMethod.toUpperCase()}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-900">
              Danh sách sản phẩm
            </div>
            <div className="mt-4 space-y-3">
              {order.items.map((i) => (
                <div
                  key={i.productId}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-white p-4"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">
                      {i.name}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {formatVnd(i.unitPrice)} • SL: {i.quantity}
                    </div>
                  </div>
                  <div className="text-sm font-black text-slate-900">
                    {formatVnd(i.unitPrice * i.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-900">
              Key/tài khoản đã giao
            </div>
            <div className="mt-4 space-y-3">
              {order.delivered.length === 0 ? (
                <div className="text-sm text-slate-600">
                  Chưa có dữ liệu giao hàng.
                </div>
              ) : (
                order.delivered.map((d) => (
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
                    <div className="mt-3">
                      <Link
                        className="text-sm font-semibold text-indigo-700 hover:underline"
                        href="/guides"
                      >
                        Xem hướng dẫn kích hoạt →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>

        <aside className="space-y-4">
          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-900">
              Thông tin thanh toán
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Tạm tính</span>
                <span className="font-semibold text-slate-900">
                  {formatVnd(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Giảm giá</span>
                <span className="font-semibold text-slate-900">
                  -{formatVnd(order.discount)}
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">Tổng</span>
                <span className="text-lg font-black text-slate-900">
                  {formatVnd(order.total)}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-900">
              Yêu cầu hỗ trợ/bảo hành
            </div>
            <div className="mt-2 text-sm text-slate-600">
              Gửi yêu cầu với mã đơn hàng để đội ngũ xử lý nhanh.
            </div>
            <div className="mt-4">
              <Button href="/support" className="w-full">
                Yêu cầu hỗ trợ
              </Button>
            </div>
          </Card>
        </aside>
      </div>
    </main>
  );
}

