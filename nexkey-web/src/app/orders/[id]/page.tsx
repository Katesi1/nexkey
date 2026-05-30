"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { fetchShopOrder } from "@/lib/api";
import type { ApiOrder } from "@/lib/api";
import { formatVnd } from "@/lib/currency";

const PAYMENT_LABEL: Record<number, string> = {
  1: "VNPay", 2: "MoMo", 3: "Banking / VietQR", 4: "Card", 5: "Tiền mặt",
};

const STATUS_LABEL: Record<number, { text: string; color: string }> = {
  1: { text: "Đang xử lý",     color: "text-blue-700" },
  2: { text: "Hoàn thành",     color: "text-emerald-700" },
  3: { text: "Đã hủy",         color: "text-rose-700" },
  4: { text: "Hoàn tiền",      color: "text-amber-700" },
  5: { text: "Chờ thanh toán", color: "text-slate-600" },
};

function CopyButton({ value }: { value: string }) {
  return (
    <Button variant="outline" size="sm"
      onClick={async () => { try { await navigator.clipboard.writeText(value); } catch {} }}>
      Copy
    </Button>
  );
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }  = use(params);
  const [order,   setOrder]   = useState<ApiOrder | null | undefined>(undefined);

  useEffect(() => {
    fetchShopOrder(decodeURIComponent(id))
      .then(setOrder)
      .catch(() => setOrder(null));
  }, [id]);

  if (order === undefined) {
    return (
      <main className="container-page py-8">
        <div className="text-sm text-slate-500">Đang tải đơn hàng…</div>
      </main>
    );
  }

  if (order === null) return notFound();

  const status  = STATUS_LABEL[order.status] ?? { text: "Không rõ", color: "text-slate-600" };
  const payment = PAYMENT_LABEL[order.paymentMethod] ?? "Không rõ";
  const subtotal = order.total + order.discount;

  return (
    <main className="container-page py-8">
      <div className="mb-5 text-sm text-slate-600">
        <Link className="hover:underline" href="/orders">Đơn hàng của tôi</Link>{" "}
        <span className="text-slate-400">/</span>{" "}
        <span className="text-slate-900">{order.id}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="space-y-4">
          {/* Order info */}
          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-900">Thông tin đơn hàng</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Mã đơn",    value: order.id,       mono: true },
                { label: "Ngày mua",  value: new Date(order.createdAt).toLocaleString("vi-VN") },
                { label: "Khách hàng", value: `${order.customerName} — ${order.customerEmail}` },
                { label: "SĐT",       value: order.customerPhone || "—" },
              ].map(r => (
                <div key={r.label}>
                  <div className="text-xs font-semibold text-slate-500">{r.label}</div>
                  <div className={`mt-1 text-sm font-bold text-slate-900 ${r.mono ? "font-mono" : ""}`}>{r.value}</div>
                </div>
              ))}
              <div>
                <div className="text-xs font-semibold text-slate-500">Trạng thái</div>
                <div className={`mt-1 text-sm font-bold ${status.color}`}>{status.text}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">Phương thức</div>
                <div className="mt-1 text-sm font-bold text-slate-900">{payment}</div>
              </div>
            </div>
          </Card>

          {/* Items */}
          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-900">Danh sách sản phẩm</div>
            <div className="mt-4 space-y-3">
              {order.items.map(i => (
                <div key={i.id} className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-white p-4">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">{i.name}</div>
                    <div className="mt-1 text-xs text-slate-500">{formatVnd(i.price)} • SL: {i.quantity}</div>
                  </div>
                  <div className="text-sm font-black text-slate-900">{formatVnd(i.price * i.quantity)}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Keys / License delivered */}
          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-900">Key / tài khoản đã giao</div>
            <div className="mt-4 space-y-3">
              {order.items.filter(i => i.licenseKey).length === 0 ? (
                <div className="text-sm text-slate-600">
                  {order.status === 2
                    ? "Chưa có key. Vui lòng liên hệ hỗ trợ."
                    : "Key sẽ được giao sau khi thanh toán xác nhận."}
                </div>
              ) : (
                order.items.filter(i => i.licenseKey).map(i => (
                  <div key={i.id} className="rounded-2xl border border-border bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900">{i.name}</div>
                        <div className="mt-1 break-all font-mono text-sm text-slate-700">{i.licenseKey}</div>
                      </div>
                      <CopyButton value={i.licenseKey!} />
                    </div>
                    <div className="mt-3">
                      <Link className="text-sm font-semibold text-indigo-700 hover:underline" href="/guides">
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
          {/* Payment summary */}
          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-900">Thông tin thanh toán</div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Tạm tính</span>
                <span className="font-semibold text-slate-900">{formatVnd(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Giảm giá</span>
                <span className="font-semibold text-slate-900">-{formatVnd(order.discount)}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">Tổng</span>
                <span className="text-lg font-black text-slate-900">{formatVnd(order.total)}</span>
              </div>
            </div>
          </Card>

          {/* Support */}
          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-900">Yêu cầu hỗ trợ/bảo hành</div>
            <div className="mt-2 text-sm text-slate-600">
              Gửi yêu cầu với mã đơn hàng để đội ngũ xử lý nhanh.
            </div>
            <div className="mt-4">
              <Button href="/support" className="w-full">Yêu cầu hỗ trợ</Button>
            </div>
          </Card>
        </aside>
      </div>
    </main>
  );
}
