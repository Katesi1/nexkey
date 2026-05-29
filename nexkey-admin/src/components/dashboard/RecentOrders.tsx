"use client";

import { useState, useEffect } from "react";
import { ordersApi } from "@/lib/api";
import { formatVND, formatDateTime } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/ui/Badge";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Order } from "@/lib/types";

const PAYMENT_ICONS: Record<string, string> = {
  VNPay: "💳", MoMo: "🎀", Banking: "🏦", Card: "💰", "Tiền mặt": "💵",
};

const PAGE_SIZE = 10;

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    ordersApi.list({ page, limit: PAGE_SIZE }).then(res => {
      setOrders(res.data);
      setTotalPages(res.meta.totalPages);
      setTotal(res.meta.total);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="glass-card">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(30,42,80,0.6)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Đơn hàng mới nhất
        </div>
        <Link href="/orders" style={{ display: "flex", alignItems: "center", gap: 4, color: "#3b82f6", fontSize: 12, textDecoration: "none" }}>
          Xem tất cả <ArrowRight size={13} />
        </Link>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: "14%" }} />
          <col style={{ width: "22%" }} />
          <col style={{ width: "26%" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "11%" }} />
        </colgroup>
        <thead>
          <tr style={{ background: "rgba(10,14,26,0.9)", borderBottom: "1px solid rgba(30,42,80,0.8)" }}>
            {["Mã đơn", "Khách hàng", "Sản phẩm", "Thanh toán", "Trạng thái", "Tổng tiền"].map((h, i) => (
              <th key={h} style={{ padding: i === 0 ? "10px 12px 10px 20px" : i === 5 ? "10px 20px 10px 12px" : "10px 12px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#475569" }}>
              <span style={{ display: "inline-block", width: 20, height: 20, border: "2px solid #334155", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            </td></tr>
          ) : orders.map((order, idx) => (
            <tr key={order.id} style={{ borderBottom: idx < orders.length - 1 ? "1px solid rgba(30,42,80,0.4)" : "none", transition: "background 0.12s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(22,32,64,0.7)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>

              <td style={{ padding: "12px 12px 12px 20px" }}>
                <div style={{ color: "#3b82f6", fontSize: 11.5, fontWeight: 600, fontFamily: "monospace" }}>#{order.id}</div>
                <div style={{ fontSize: 10, color: "#334155", marginTop: 2 }}>{formatDateTime(order.createdAt)}</div>
              </td>

              <td style={{ padding: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "white", fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {order.customerName[0]}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.customerName}</div>
                    <div style={{ fontSize: 10, color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.customerEmail}</div>
                  </div>
                </div>
              </td>

              <td style={{ padding: "12px" }}>
                <div style={{ fontSize: 12, color: "#cbd5e1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {order.items.map(i => i.name).join(", ")}
                </div>
                {order.items.length > 1 && (
                  <div style={{ fontSize: 10, color: "#475569" }}>+{order.items.length - 1} sản phẩm</div>
                )}
              </td>

              <td style={{ padding: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 13 }}>{PAYMENT_ICONS[order.paymentMethod] ?? "💳"}</span>
                  <span style={{ fontSize: 11, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.paymentMethod}</span>
                </div>
              </td>

              <td style={{ padding: "12px" }}>
                <OrderStatusBadge status={order.status} />
              </td>

              <td style={{ padding: "12px 20px 12px 12px" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#10b981" }}>{formatVND(order.total)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: "1px solid rgba(30,42,80,0.5)" }}>
          <span style={{ fontSize: 11, color: "#475569" }}>
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} / {total} đơn hàng
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <PagBtn onClick={() => setPage(p => p - 1)} disabled={page === 1}><ChevronLeft size={14} /></PagBtn>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
              <PagBtn key={p} onClick={() => setPage(p)} active={p === page}>{p}</PagBtn>
            ))}
            <PagBtn onClick={() => setPage(p => p + 1)} disabled={page === totalPages}><ChevronRight size={14} /></PagBtn>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function PagBtn({ children, onClick, disabled = false, active = false }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; active?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: active ? 700 : 400, cursor: disabled ? "default" : "pointer", border: "1px solid", borderColor: active ? "#3b82f6" : "rgba(30,42,80,0.8)", background: active ? "rgba(59,130,246,0.15)" : "transparent", color: disabled ? "#334155" : active ? "#60a5fa" : "#94a3b8", transition: "all 0.15s" }}>
      {children}
    </button>
  );
}
