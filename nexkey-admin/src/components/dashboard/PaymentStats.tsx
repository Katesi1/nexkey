"use client";

import { paymentsApi } from "@/lib/api";
import { PAYMENT_METHOD_LABEL, type PaymentMethod } from "@/lib/types";
import { formatVND } from "@/lib/utils";

type StatRow = { method: PaymentMethod; count: number; revenue: number; percentage: number };

type Props = {
  data: {
    byMethod: { method: PaymentMethod; count: number; revenue: number }[];
    totalRevenue: number;
    totalOrders: number;
  } | null;
};

const METHOD_ICONS: Record<number, string> = {
  1: "💳", 2: "🎀", 3: "🏦", 4: "💰", 5: "💵",
};

export function PaymentStats({ data }: Props) {
  const stats: StatRow[] = data
    ? data.byMethod.map(m => ({
        method: m.method,
        count: m.count,
        revenue: m.revenue,
        percentage: data.totalRevenue > 0 ? Math.round((m.revenue / data.totalRevenue) * 100) : 0,
      }))
    : [];

  return (
    <div className="glass-card" style={{ padding: "20px 24px 24px" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>
        Phương thức thanh toán
      </div>

      {stats.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px 0", color: "#334155", fontSize: 12 }}>
          Đang tải...
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {stats.map((stat, i) => {
            const colors = ["#3b82f6", "#a855f7", "#ec4899", "#f59e0b"];
            const cc = colors[i] ?? "#64748b";
            return (
              <div key={stat.method}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{METHOD_ICONS[stat.method] ?? "💳"}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>
                      {PAYMENT_METHOD_LABEL[stat.method]}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: cc }}>{stat.percentage}%</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 6 }}>
                  {stat.count.toLocaleString("vi-VN")} giao dịch · {formatVND(stat.revenue)}
                </div>
                <div style={{ height: 3, background: "rgba(30,42,80,0.8)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${stat.percentage}%`, background: cc, borderRadius: 99 }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
