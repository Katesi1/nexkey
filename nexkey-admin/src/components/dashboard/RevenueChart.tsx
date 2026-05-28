"use client";

import { useState, useRef, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  revenueWeekly,
  revenue1Month,
  revenue3Months,
  revenue6Months,
  revenueMonthly,
} from "@/lib/mock-data";

type Period = "7d" | "1m" | "3m" | "6m" | "1y";

const PERIODS: { value: Period; label: string }[] = [
  { value: "7d", label: "7 ngày" },
  { value: "1m", label: "1 tháng" },
  { value: "3m", label: "3 tháng" },
  { value: "6m", label: "6 tháng" },
  { value: "1y", label: "1 năm" },
];

const DATA_MAP: Record<Period, typeof revenueWeekly> = {
  "7d": revenueWeekly,
  "1m": revenue1Month,
  "3m": revenue3Months,
  "6m": revenue6Months,
  "1y": revenueMonthly,
};

const formatY = (v: number) => {
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(0) + "M";
  if (v >= 1_000) return (v / 1_000).toFixed(0) + "K";
  return String(v);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const revenue = payload[0]?.value as number;
  return (
    <div
      style={{
        background: "#0d1226",
        border: "1px solid #1e2a50",
        borderRadius: 8,
        padding: "10px 14px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#8b5cf6",
          }}
        />
        <span style={{ color: "#94a3b8", fontSize: 11 }}>Doanh thu:</span>
        <span style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 600 }}>
          {new Intl.NumberFormat("vi-VN").format(revenue)}đ
        </span>
      </div>
    </div>
  );
};

export function RevenueChart() {
  const [period, setPeriod] = useState<Period>("7d");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const data = DATA_MAP[period];
  const currentLabel = PERIODS.find((p) => p.value === period)?.label ?? "";

  return (
    <div className="glass-card" style={{ height: "100%", padding: "20px 24px 16px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#e2e8f0",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Biểu đồ doanh thu
        </div>

        {/* Dropdown */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            onClick={() => setIsOpen((o) => !o)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              border: "1px solid #1e2a50",
              background: "#0a0e1a",
              color: "#94a3b8",
              userSelect: "none",
            }}
          >
            {currentLabel}
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              style={{
                transition: "transform 0.15s",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <path
                d="M2 3.5L5 6.5L8 3.5"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {isOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                background: "#0a0e1a",
                border: "1px solid #1e2a50",
                borderRadius: 8,
                overflow: "hidden",
                zIndex: 50,
                minWidth: 110,
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              }}
            >
              {PERIODS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => { setPeriod(p.value); setIsOpen(false); }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "8px 14px",
                    textAlign: "left",
                    fontSize: 12,
                    fontWeight: period === p.value ? 600 : 400,
                    color: period === p.value ? "#a78bfa" : "#94a3b8",
                    background: period === p.value ? "rgba(139,92,246,0.12)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.1s, color 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    if (period !== p.value) {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (period !== p.value) {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    }
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div style={{ margin: "0 -8px" }}>
        <ResponsiveContainer width="100%" height={210}>
          <AreaChart data={data} margin={{ top: 8, right: 28, left: 4, bottom: 4 }}>
            <defs>
              <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2a50" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              padding={{ left: 16, right: 16 }}
            />
            <YAxis
              tickFormatter={formatY}
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={38}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              fill="url(#gradRevenue)"
              dot={false}
              activeDot={{ r: 5, fill: "#8b5cf6", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
