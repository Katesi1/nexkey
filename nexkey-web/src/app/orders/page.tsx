"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import { fetchShopOrder } from "@/lib/api";
import { formatVnd } from "@/lib/currency";
import type { Order } from "@/lib/types";
import { ORDER_STATUS_LABEL } from "@/lib/types";

// Status number → web Order status (for display)
const STATUS_NUM_TO_STRING: Record<number, Order["status"]> = {
  1: "Chờ thanh toán",
  2: "Đã giao hàng",
  3: "Đã hủy",
  4: "Đã thanh toán",
  5: "Chờ thanh toán",
};

const PAYMENT_NUM_TO_LABEL: Record<number, string> = {
  1: "VNPay", 2: "MoMo", 3: "Banking/VietQR", 4: "Card", 5: "Tiền mặt",
};

export default function OrdersPage() {
  const { orderIds, addOrder } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(orderIds.length > 0);

  useEffect(() => {
    if (orderIds.length === 0) { setLoading(false); return; }

    // Fetch tất cả orders từ API theo IDs đã lưu
    Promise.all(orderIds.map(id => fetchShopOrder(id).catch(() => null)))
      .then(results => {
        const fetched: Order[] = results
          .filter(Boolean)
          .map(api => ({
            id:        api!.id,
            createdAt: api!.createdAt,
            customer: {
              fullName: api!.customerName,
              email:    api!.customerEmail,
              phone:    api!.customerPhone,
            },
            paymentMethod: (["vnpay","momo","bank","bank","bank"][api!.paymentMethod - 1] ?? "bank") as Order["paymentMethod"],
            status:        STATUS_NUM_TO_STRING[api!.status] ?? "Chờ thanh toán",
            items:         (api!.items ?? []).map(i => ({
              productId: i.productId,
              name:      i.name,
              unitPrice: i.price,
              quantity:  i.quantity,
            })),
            subtotal:  api!.total + api!.discount,
            discount:  api!.discount,
            total:     api!.total,
            delivered: (api!.items ?? [])
              .filter(i => i.licenseKey)
              .map(i => ({ productId: i.productId, label: i.name, value: i.licenseKey! })),
          }));
        // Update store cache
        fetched.forEach(o => addOrder(o));
        setOrders(fetched);
      })
      .finally(() => setLoading(false));
  }, [orderIds.join(",")]); // eslint-disable-line

  return (
    <main className="container-page py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Đơn hàng của tôi</h1>
        <p className="mt-1 text-sm text-slate-600">Xem lịch sử đơn hàng và trạng thái giao key/tài khoản.</p>
      </div>

      {loading ? (
        <Card className="p-6 text-sm text-slate-600">Đang tải đơn hàng…</Card>
      ) : orders.length === 0 ? (
        <Card className="p-6">
          <div className="text-sm text-slate-700">Bạn chưa có đơn hàng nào trên thiết bị này.</div>
          <div className="mt-4">
            <Button href="/products" variant="outline">Mua sản phẩm</Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map(o => (
            <Card key={o.id} className="p-5">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <div className="text-sm font-extrabold text-slate-900">{o.id}</div>
                    <div className={`text-xs font-semibold ${
                      o.status === "Đã giao hàng" ? "text-emerald-700"
                      : o.status === "Đã hủy"     ? "text-rose-700"
                      : "text-slate-600"
                    }`}>
                      {o.status}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(o.createdAt).toLocaleString("vi-VN")}
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {o.items.map(i => i.name).join(" • ")}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <div className="text-sm font-black text-slate-900">{formatVnd(o.total)}</div>
                  <Button href={`/orders/${encodeURIComponent(o.id)}`} size="sm">Xem chi tiết</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 text-xs text-slate-500">
        Nếu cần hỗ trợ/bảo hành, hãy vào{" "}
        <Link className="font-semibold hover:underline" href="/support">trang hỗ trợ</Link>{" "}
        và gửi mã đơn hàng.
      </div>
    </main>
  );
}
