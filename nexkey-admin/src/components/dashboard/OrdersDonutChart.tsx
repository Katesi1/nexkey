"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type Slice = { name: string; value: number; color: string };

type Props = {
  stats: { hoanThanh: number; dangXuLy: number; daHuy: number; hoanTien: number } | null;
};

const DEFAULT_DATA: Slice[] = [
  { name: "Hoàn thành", value: 0, color: "#10b981" },
  { name: "Đang xử lý", value: 0, color: "#3b82f6" },
  { name: "Đã hủy",     value: 0, color: "#ef4444" },
  { name: "Hoàn tiền",  value: 0, color: "#f59e0b" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, total }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{ background: "#0d1226", border: "1px solid #1e2a50", borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
      <div style={{ color: "#e2e8f0", fontWeight: 600 }}>{d.name}</div>
      <div style={{ color: "#94a3b8" }}>
        {d.value} đơn ({total > 0 ? ((d.value / total) * 100).toFixed(1) : 0}%)
      </div>
    </div>
  );
};

export function OrdersDonutChart({ stats }: Props) {
  const [hovered, setHovered] = useState(false);

  const data: Slice[] = stats ? [
    { name: "Hoàn thành", value: stats.hoanThanh, color: "#10b981" },
    { name: "Đang xử lý", value: stats.dangXuLy,  color: "#3b82f6" },
    { name: "Đã hủy",     value: stats.daHuy,      color: "#ef4444" },
    { name: "Hoàn tiền",  value: stats.hoanTien,   color: "#f59e0b" },
  ] : DEFAULT_DATA;

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="glass-card" style={{ height: "100%", padding: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>
        Thống kê đơn hàng
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ position: "relative", width: 160, height: 160, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={76}
                paddingAngle={2} dataKey="value"
                startAngle={90} endAngle={-270}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip total={total} />} />
            </PieChart>
          </ResponsiveContainer>

          {!hovered && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#e2e8f0", lineHeight: 1 }}>
                {total.toLocaleString("vi-VN")}
              </div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>Tổng</div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, minWidth: 0 }}>
          {data.map((d) => (
            <div key={d.name}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, flexShrink: 0, boxShadow: `0 0 6px ${d.color}99` }} />
                <span style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 500 }}>{d.name}</span>
              </div>
              <div style={{ paddingLeft: 18, color: "#64748b", fontSize: 11 }}>
                {d.value.toLocaleString("vi-VN")} ({total > 0 ? ((d.value / total) * 100).toFixed(1) : 0}%)
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
