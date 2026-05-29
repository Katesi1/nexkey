"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard, StatsGrid } from "@/components/ui/StatCard";
import { OrderStatusBadge } from "@/components/ui/Badge";
import { Button, ActionButtons } from "@/components/ui/Button";
import { ordersApi } from "@/lib/api";
import type { ApiMeta } from "@/lib/api";
import { formatVND, formatDateTime } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";
import {
  Search, Filter, Download, Plus, X, User, Package,
  CreditCard, KeyRound, RotateCcw, XCircle, ChevronLeft, ChevronRight,
} from "lucide-react";

const TABS = ["Tất cả", "Đang xử lý", "Hoàn thành", "Đã hủy", "Hoàn tiền"] as const;
const PAGE_SIZE = 10;

const PAYMENT_ICONS: Record<string, string> = {
  VNPay: "💳", MoMo: "🎀", Banking: "🏦", Card: "💰", "Tiền mặt": "💵",
};

const STATUS_OPTIONS: OrderStatus[] = ["Đang xử lý", "Hoàn thành", "Đã hủy", "Hoàn tiền", "Chờ thanh toán"];
const PAYMENT_METHODS = ["VNPay", "MoMo", "Banking", "Card", "Tiền mặt"] as const;

type Filters = {
  payments: string[];
  minAmount: string;
  maxAmount: string;
};
const DEFAULT_FILTERS: Filters = { payments: [], minAmount: "", maxAmount: "" };

/* ─── Modal wrapper ──────────────────────────────────────────── */
function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

/* ─── Status color map ───────────────────────────────────────── */
const STATUS_COLORS: Record<string, { color: string; bg: string; glow: string }> = {
  "Hoàn thành":     { color: "#10b981", bg: "rgba(16,185,129,0.12)",  glow: "rgba(16,185,129,0.25)" },
  "Đang xử lý":     { color: "#3b82f6", bg: "rgba(59,130,246,0.12)",  glow: "rgba(59,130,246,0.25)" },
  "Đã hủy":         { color: "#ef4444", bg: "rgba(239,68,68,0.12)",   glow: "rgba(239,68,68,0.25)" },
  "Hoàn tiền":      { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  glow: "rgba(245,158,11,0.25)" },
  "Chờ thanh toán": { color: "#8b5cf6", bg: "rgba(139,92,246,0.12)",  glow: "rgba(139,92,246,0.25)" },
};

/* ─── Section label ──────────────────────────────────────────── */
function SectionLabel({ icon, children }: { icon: React.ReactNode; children: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
      <div style={{
        width: 22, height: 22, borderRadius: 6, background: "rgba(59,130,246,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa",
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {children}
      </span>
    </div>
  );
}

/* ─── Order Detail Modal ─────────────────────────────────────── */
function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const sc = STATUS_COLORS[order.status] ?? STATUS_COLORS["Đang xử lý"];

  return (
    <Modal onClose={onClose}>
      <div style={{
        width: 540, maxWidth: "92vw", maxHeight: "90vh",
        background: "#080d1c",
        border: "1px solid rgba(30,42,80,0.7)",
        borderRadius: 18,
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        boxShadow: `0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)`,
      }}>

        {/* Colored accent bar */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${sc.color}, transparent)`, flexShrink: 0 }} />

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          padding: "18px 22px 16px",
          borderBottom: "1px solid rgba(30,42,80,0.6)",
          flexShrink: 0,
          background: "rgba(255,255,255,0.015)",
        }}>
          <div>
            <div style={{ fontSize: 11, color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
              Chi tiết đơn hàng
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", fontFamily: "monospace", letterSpacing: "0.02em" }}>
              #{order.id}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "3px 10px", borderRadius: 99,
                background: sc.bg, color: sc.color,
                fontSize: 11, fontWeight: 700,
                boxShadow: `0 0 12px ${sc.glow}`,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.color, display: "inline-block" }} />
                {order.status}
              </span>
              <span style={{ fontSize: 11, color: "#334155" }}>{formatDateTime(order.createdAt)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(30,42,80,0.8)",
              background: "rgba(255,255,255,0.04)", color: "#64748b",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0, marginTop: 2,
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Customer */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<User size={12} />}>Khách hàng</SectionLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 800, fontSize: 18,
                boxShadow: "0 4px 16px rgba(124,58,237,0.35)",
              }}>
                {order.customerName[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>{order.customerName}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 11.5, color: "#64748b" }}>✉ {order.customerEmail}</span>
                  <span style={{ fontSize: 11.5, color: "#64748b" }}>📞 {order.customerPhone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<Package size={12} />}>Sản phẩm</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {order.items.map((item, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < order.items.length - 1 ? "1px solid rgba(30,42,80,0.4)" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#60a5fa", fontSize: 12, fontWeight: 700,
                    }}>
                      {i + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#cbd5e1" }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                        {formatVND(item.price)} × {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>
                    {formatVND(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<CreditCard size={12} />}>Thanh toán</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>Phương thức</span>
                <span style={{ fontSize: 12, color: "#cbd5e1", fontWeight: 500 }}>
                  {PAYMENT_ICONS[order.paymentMethod]} {order.paymentMethod}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>Tạm tính</span>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{formatVND(order.total + order.discount)}</span>
              </div>
              {order.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>Giảm giá</span>
                  <span style={{ fontSize: 12, color: "#34d399", fontWeight: 600 }}>-{formatVND(order.discount)}</span>
                </div>
              )}
              {/* Total highlight */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginTop: 4, padding: "12px 16px", borderRadius: 10,
                background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Tổng cộng</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#34d399", letterSpacing: "-0.5px" }}>
                  {formatVND(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* License keys */}
          {order.items.some((i) => i.licenseKey) && (
            <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(245,158,11,0.2)" }}>
              <SectionLabel icon={<KeyRound size={12} />}>Key / License</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {order.items.filter((i) => i.licenseKey).map((item, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6, fontWeight: 500 }}>{item.name}</div>
                    <div style={{
                      background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)",
                      borderRadius: 8, padding: "10px 12px",
                      fontFamily: "monospace", fontSize: 12, color: "#fbbf24",
                      wordBreak: "break-all", letterSpacing: "0.05em",
                    }}>
                      {item.licenseKey}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 22px", borderTop: "1px solid rgba(30,42,80,0.6)",
          display: "flex", gap: 10, flexShrink: 0,
          background: "rgba(255,255,255,0.015)",
        }}>
          <Button variant="danger" size="sm" icon={<RotateCcw size={12} />} style={{ flex: 1 }}>Hoàn tiền</Button>
          <Button variant="secondary" size="sm" icon={<XCircle size={12} />} style={{ flex: 1 }}>Hủy đơn</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Order Edit Modal ───────────────────────────────────────── */
function OrderEditModal({ order, onSave, onClose }: {
  order: Order;
  onSave: (id: string, status: OrderStatus) => void;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<OrderStatus>(order.status);

  return (
    <Modal onClose={onClose}>
      <div style={{
        width: 400, maxWidth: "90vw",
        background: "#0d1226",
        border: "1px solid rgba(30,42,80,0.8)",
        borderRadius: 16, overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(30,42,80,0.7)" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Chỉnh sửa đơn hàng</div>
            <div style={{ fontSize: 12, fontFamily: "monospace", color: "#3b82f6", marginTop: 2 }}>#{order.id}</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "rgba(255,255,255,0.06)", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={15} />
          </button>
        </div>

        <div style={{ padding: "20px" }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
            Trạng thái đơn hàng
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
            style={{
              width: "100%", padding: "10px 12px", borderRadius: 8,
              background: "#060a15", border: "1px solid rgba(30,42,80,0.8)",
              color: "#e2e8f0", fontSize: 13, cursor: "pointer", outline: "none",
            }}
          >
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ padding: "0 20px 20px", display: "flex", gap: 10 }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant="primary" size="sm" onClick={() => { onSave(order.id, status); onClose(); }} style={{ flex: 1 }}>Lưu thay đổi</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Delete Confirm Modal ───────────────────────────────────── */
function DeleteModal({ order, onConfirm, onClose }: { order: Order; onConfirm: () => void; onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div style={{
        width: 380, maxWidth: "90vw",
        background: "#0d1226",
        border: "1px solid rgba(239,68,68,0.3)",
        borderRadius: 16, overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
      }}>
        <div style={{ padding: "24px 24px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>Xóa đơn hàng?</div>
          <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
            Đơn hàng <span style={{ color: "#60a5fa", fontFamily: "monospace" }}>#{order.id}</span> của{" "}
            <strong style={{ color: "#cbd5e1" }}>{order.customerName}</strong> sẽ bị xóa vĩnh viễn.
          </div>
        </div>
        <div style={{ padding: "0 24px 24px", display: "flex", gap: 10 }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant="danger" size="sm" onClick={() => { onConfirm(); onClose(); }} style={{ flex: 1 }}>Xóa</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Helper ─────────────────────────────────────────────────── */
function Row({ label, value, valueColor = "#cbd5e1" }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
      <span style={{ color: "#475569" }}>{label}</span>
      <span style={{ color: valueColor }}>{value}</span>
    </div>
  );
}

/* ─── Filter Dropdown ────────────────────────────────────────── */
function FilterDropdown({
  filters, onChange, onClear, onClose, top, right,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onClear: () => void;
  onClose: () => void;
  top: number;
  right: number;
}) {
  const fmtAmount = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    const num = Math.min(Number(digits), 1_000_000_000);
    return num.toLocaleString("vi-VN");
  };

  const togglePayment = (method: string) => {
    const next = filters.payments.includes(method)
      ? filters.payments.filter(p => p !== method)
      : [...filters.payments, method];
    onChange({ ...filters, payments: next });
  };

  return (
    <div
      style={{
        position: "fixed", top, right, zIndex: 500,
        background: "#0a0e1a", border: "1px solid rgba(30,42,80,0.9)",
        borderRadius: 12, padding: 16, minWidth: 260,
        boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
      }}
    >
      {/* Payment methods */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
          Phương thức thanh toán
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {PAYMENT_METHODS.map(method => (
            <label key={method} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={filters.payments.includes(method)}
                onChange={() => togglePayment(method)}
                style={{ accentColor: "#3b82f6", width: 14, height: 14, cursor: "pointer" }}
              />
              <span style={{ fontSize: 12, color: "#cbd5e1" }}>
                {PAYMENT_ICONS[method]} {method}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Amount range */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
          Khoảng tổng tiền
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text" inputMode="numeric" pattern="[0-9]*"
            placeholder="Từ (đ)"
            value={filters.minAmount}
            onChange={e => onChange({ ...filters, minAmount: fmtAmount(e.target.value) })}
            style={{
              flex: 1, padding: "7px 10px", borderRadius: 6, fontSize: 12,
              background: "#060a15", border: "1px solid rgba(30,42,80,0.8)",
              color: "#e2e8f0", outline: "none", minWidth: 0,
            }}
          />
          <input
            type="text" inputMode="numeric" pattern="[0-9]*"
            placeholder="Đến (đ)"
            value={filters.maxAmount}
            onChange={e => onChange({ ...filters, maxAmount: fmtAmount(e.target.value) })}
            style={{
              flex: 1, padding: "7px 10px", borderRadius: 6, fontSize: 12,
              background: "#060a15", border: "1px solid rgba(30,42,80,0.8)",
              color: "#e2e8f0", outline: "none", minWidth: 0,
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={onClear}
          style={{
            flex: 1, padding: "7px 0", borderRadius: 6, fontSize: 12,
            border: "1px solid rgba(30,42,80,0.8)", background: "transparent",
            color: "#64748b", cursor: "pointer",
          }}
        >
          Xóa bộ lọc
        </button>
        <button
          onClick={onClose}
          style={{
            flex: 1, padding: "7px 0", borderRadius: 6, fontSize: 12,
            border: "none", background: "linear-gradient(135deg,#2563eb,#7c3aed)",
            color: "#fff", cursor: "pointer", fontWeight: 600,
          }}
        >
          Áp dụng
        </button>
      </div>
    </div>
  );
}

/* ─── Pagination button ──────────────────────────────────────── */
function PagBtn({ children, onClick, disabled = false, active = false }: {
  children: React.ReactNode; onClick: () => void; disabled?: boolean; active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 30, height: 30, borderRadius: 6, fontSize: 12, fontWeight: active ? 700 : 400,
        cursor: disabled ? "default" : "pointer", border: "1px solid",
        borderColor: active ? "#3b82f6" : "rgba(30,42,80,0.8)",
        background: active ? "rgba(59,130,246,0.15)" : "transparent",
        color: disabled ? "#334155" : active ? "#60a5fa" : "#94a3b8",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

/* ─── Stats type ─────────────────────────────────────────────── */
type OrderStats = {
  dangXuLy: number;
  hoanThanh: number;
  daHuy: number;
  hoanTien: number;
  choThanhToan: number;
  tongDoanhThu: number;
};

/* ─── Main Page ──────────────────────────────────────────────── */
export default function OrdersPage() {
  const [orders, setOrders]         = useState<Order[]>([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(true);
  const [apiError, setApiError]     = useState("");
  const [stats, setStats]           = useState<OrderStats | null>(null);

  const [activeTab, setActiveTab] = useState("Tất cả");
  const [search, setSearch]       = useState("");
  const [page, setPage]           = useState(1);
  const [viewing, setViewing]     = useState<Order | null>(null);
  const [editing, setEditing]     = useState<Order | null>(null);
  const [deleting, setDeleting]   = useState<Order | null>(null);
  const [creating, setCreating]   = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterPos, setFilterPos]   = useState({ top: 0, right: 0 });
  const [filters, setFilters]       = useState<Filters>(DEFAULT_FILTERS);
  const filterRef    = useRef<HTMLDivElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)
        && filterBtnRef.current && !filterBtnRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ─── Fetch data ───────────────────────────────────────────── */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setApiError("");
    try {
      const statusParam = activeTab === "Tất cả" ? undefined : activeTab;
      const paymentParam = filters.payments.length === 1 ? filters.payments[0] : undefined;
      const minAmount = filters.minAmount ? Number(filters.minAmount.replace(/\./g, "")) : undefined;
      const maxAmount = filters.maxAmount ? Number(filters.maxAmount.replace(/\./g, "")) : undefined;

      const [result, statsData] = await Promise.all([
        ordersApi.list({
          page,
          limit: PAGE_SIZE,
          search: search || undefined,
          status: statusParam,
          payment_method: paymentParam,
          min_amount: minAmount,
          max_amount: maxAmount,
        }),
        ordersApi.stats(),
      ]);

      setOrders(result.data);
      setTotal(result.meta.total);
      setTotalPages(result.meta.totalPages);
      setStats(statsData);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [page, search, activeTab, filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ─── Event handlers ───────────────────────────────────────── */
  const handleToggleFilter = () => {
    if (!showFilter && filterBtnRef.current) {
      const rect = filterBtnRef.current.getBoundingClientRect();
      setFilterPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    }
    setShowFilter(o => !o);
  };

  const activeFilterCount =
    filters.payments.length +
    (filters.minAmount ? 1 : 0) +
    (filters.maxAmount ? 1 : 0);

  const handleTabChange = (tab: string) => { setActiveTab(tab); setPage(1); };
  const handleSearch    = (s: string)   => { setSearch(s); setPage(1); };

  const handleSaveEdit = useCallback(async (id: string, status: OrderStatus) => {
    try {
      await ordersApi.update(id, { status });
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi cập nhật đơn hàng");
    }
  }, [fetchData]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await ordersApi.delete(id);
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi xóa đơn hàng");
    }
  }, [fetchData]);

  const handleCreate = useCallback(async () => {
    await fetchData();
    setPage(1);
  }, [fetchData]);

  /* ─── Stats display values ─────────────────────────────────── */
  const statTotal    = stats ? stats.dangXuLy + stats.hoanThanh + stats.daHuy + stats.hoanTien + stats.choThanhToan : total;
  const statDone     = stats?.hoanThanh ?? 0;
  const statPending  = stats?.dangXuLy ?? 0;
  const statCanceled = stats?.daHuy ?? 0;

  return (
    <AdminLayout title="Đơn hàng" subtitle="Quản lý đơn hàng">
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div className="page-content">
        <StatsGrid cols={4}>
          <StatCard label="Tổng đơn hàng" value={statTotal} change={12.5} changeLabel="so với tháng trước" icon="cart" color="blue" />
          <StatCard label="Hoàn thành" value={statDone} change={8} changeLabel="so với tháng trước" icon="cart" color="green" />
          <StatCard label="Đang xử lý" value={statPending} change={5.2} changeLabel="so với tháng trước" icon="cart" color="amber" />
          <StatCard label="Đã hủy" value={statCanceled} change={-3} changeLabel="so với tháng trước" icon="cart" color="rose" />
        </StatsGrid>

        {/* Toolbar + Tabs */}
        <div className="glass-card" style={{ padding: 16 }}>
          <div className="toolbar">
            <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
              <Search size={13} className="search-icon" />
              <input
                className="admin-input"
                placeholder="Tìm đơn hàng, khách hàng..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div style={{ position: "relative" }}>
              <button
                ref={filterBtnRef}
                onClick={handleToggleFilter}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 500,
                  cursor: "pointer", border: "1px solid",
                  borderColor: showFilter || activeFilterCount > 0 ? "rgba(59,130,246,0.6)" : "rgba(30,42,80,0.8)",
                  background: showFilter || activeFilterCount > 0 ? "rgba(59,130,246,0.1)" : "transparent",
                  color: activeFilterCount > 0 ? "#60a5fa" : "#94a3b8",
                }}
              >
                <Filter size={13} />
                Lọc
                {activeFilterCount > 0 && (
                  <span style={{
                    background: "#3b82f6", color: "#fff",
                    borderRadius: 99, fontSize: 10, fontWeight: 700,
                    padding: "1px 6px", lineHeight: 1.6,
                  }}>
                    {activeFilterCount}
                  </span>
                )}
              </button>

            </div>

            {/* Dropdown rendered outside glass-card to bypass overflow:hidden */}
            {showFilter && (
              <div ref={filterRef}>
                <FilterDropdown
                  filters={filters}
                  onChange={(f) => { setFilters(f); setPage(1); }}
                  onClear={() => { setFilters(DEFAULT_FILTERS); setPage(1); }}
                  onClose={() => setShowFilter(false)}
                  top={filterPos.top}
                  right={filterPos.right}
                />
              </div>
            )}
            <Button
              variant="secondary" size="sm" icon={<Download size={13} />}
              onClick={() => window.open(ordersApi.exportUrl())}
            >
              Excel
            </Button>
            <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => setCreating(true)}>Tạo đơn</Button>
          </div>

          <div style={{ display: "flex", gap: 0, marginTop: 14, borderBottom: "1px solid rgba(30,42,80,0.6)" }}>
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`tab-btn ${activeTab === tab ? "tab-btn-active" : "tab-btn-inactive"}`}
              >
                {tab}
                <span className={`tab-count ${activeTab === tab ? "tab-count-active" : "tab-count-inactive"}`}>
                  {tab === "Tất cả" ? statTotal
                    : tab === "Hoàn thành" ? statDone
                    : tab === "Đang xử lý" ? statPending
                    : tab === "Đã hủy" ? statCanceled
                    : stats?.hoanTien ?? 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="glass-card" style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã đơn</th><th>Khách hàng</th><th>Sản phẩm</th>
                <th>Tổng tiền</th><th>Thanh toán</th><th>Trạng thái</th>
                <th>Thời gian</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 40, color: "#475569" }}>
                    <span style={{ display: "inline-block", width: 20, height: 20, border: "2px solid #334155", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  </td>
                </tr>
              ) : orders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setViewing(order)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <span style={{ fontFamily: "monospace", color: "#60a5fa", fontWeight: 600, fontSize: 12 }}>
                      #{order.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%",
                        background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontWeight: 700, fontSize: 12, flexShrink: 0,
                      }}>{order.customerName[0]}</div>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 500, color: "#e2e8f0" }}>{order.customerName}</div>
                        <div style={{ fontSize: 10.5, color: "#475569" }}>{order.customerEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12.5, color: "#cbd5e1", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {order.items[0]?.name}
                      {order.items.length > 1 && <span style={{ color: "#475569" }}> +{order.items.length - 1}</span>}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: "#34d399", fontSize: 13 }}>{formatVND(order.total)}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 14 }}>{PAYMENT_ICONS[order.paymentMethod]}</span>
                      <span style={{ fontSize: 11.5, color: "#64748b" }}>{order.paymentMethod}</span>
                    </div>
                  </td>
                  <td><OrderStatusBadge status={order.status} /></td>
                  <td><span style={{ fontSize: 11, color: "#475569" }}>{formatDateTime(order.createdAt)}</span></td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <ActionButtons
                      onView={() => setViewing(order)}
                      onEdit={() => setEditing(order)}
                      onDelete={() => setDeleting(order)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && orders.length === 0 && (
            <div className="empty-state">
              <span style={{ fontSize: 36 }}>📋</span>
              <div style={{ color: "#475569", fontSize: 13 }}>Không tìm thấy đơn hàng</div>
            </div>
          )}

          {apiError && (
            <div style={{ padding: "12px 16px", color: "#ef4444", fontSize: 12, borderTop: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)" }}>
              {apiError}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "#475569" }}>
            {total === 0 ? "0" : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)}`}
            {" "}/ {total} đơn hàng
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            <PagBtn onClick={() => setPage(p => p - 1)} disabled={page === 1}><ChevronLeft size={14} /></PagBtn>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <PagBtn key={p} onClick={() => setPage(p)} active={p === page}>{p}</PagBtn>
            ))}
            <PagBtn onClick={() => setPage(p => p + 1)} disabled={page === totalPages}><ChevronRight size={14} /></PagBtn>
          </div>
        </div>
      </div>

      {/* Modals */}
      {creating && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setCreating(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 400, maxWidth: "90vw",
              background: "#0d1226",
              border: "1px solid rgba(30,42,80,0.8)",
              borderRadius: 16, overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
              padding: 28, textAlign: "center",
            }}
          >
            <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 16 }}>
              Tính năng tạo đơn hàng thủ công sẽ gọi API tạo đơn. Hiện tại đã kết nối API.
            </div>
            <Button variant="secondary" size="sm" onClick={() => { handleCreate(); setCreating(false); }}>Đóng & Tải lại</Button>
          </div>
        </div>
      )}
      {viewing && <OrderDetailModal order={viewing} onClose={() => setViewing(null)} />}
      {editing && <OrderEditModal order={editing} onSave={handleSaveEdit} onClose={() => setEditing(null)} />}
      {deleting && <DeleteModal order={deleting} onConfirm={() => handleDelete(deleting.id)} onClose={() => setDeleting(null)} />}
    </AdminLayout>
  );
}
