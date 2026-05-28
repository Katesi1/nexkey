"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard, StatsGrid } from "@/components/ui/StatCard";
import { CustomerStatusBadge } from "@/components/ui/Badge";
import { Button, ActionButtons } from "@/components/ui/Button";
import { customers as initialCustomers } from "@/lib/mock-data";
import { formatVND, formatDate } from "@/lib/utils";
import type { Customer, CustomerStatus } from "@/lib/types";
import {
  Search, Filter, Download, UserPlus, X,
  User, ShoppingBag, DollarSign, Crown,
  ChevronLeft, ChevronRight, Phone, Mail, Calendar,
} from "lucide-react";

/* ─── Constants ──────────────────────────────────────────────── */
const TABS = ["Tất cả", "Hoạt động", "VIP", "Bị khóa"] as const;
const PAGE_SIZE = 10;
const STATUS_OPTIONS: CustomerStatus[] = ["Hoạt động", "VIP", "Bị khóa"];

const AVATAR_COLORS = [
  "linear-gradient(135deg,#2563eb,#7c3aed)",
  "linear-gradient(135deg,#059669,#0891b2)",
  "linear-gradient(135deg,#d97706,#dc2626)",
  "linear-gradient(135deg,#7c3aed,#db2777)",
  "linear-gradient(135deg,#0891b2,#2563eb)",
];

const STATUS_COLORS: Record<CustomerStatus, { color: string; bg: string; glow: string }> = {
  "Hoạt động": { color: "#10b981", bg: "rgba(16,185,129,0.12)",  glow: "rgba(16,185,129,0.25)" },
  "VIP":        { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  glow: "rgba(245,158,11,0.3)" },
  "Bị khóa":   { color: "#ef4444", bg: "rgba(239,68,68,0.12)",   glow: "rgba(239,68,68,0.25)" },
};

type Filters = { statuses: CustomerStatus[]; minSpend: string; maxSpend: string };
const DEFAULT_FILTERS: Filters = { statuses: [], minSpend: "", maxSpend: "" };

/* ─── Modal wrapper ──────────────────────────────────────────── */
function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

/* ─── Section label ──────────────────────────────────────────── */
function SectionLabel({ icon, children }: { icon: React.ReactNode; children: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
      <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(59,130,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa" }}>{icon}</div>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>{children}</span>
    </div>
  );
}

/* ─── Customer Detail Modal ──────────────────────────────────── */
function CustomerDetailModal({ customer, idx, onClose, onEdit, onToggleLock }: {
  customer: Customer; idx: number; onClose: () => void;
  onEdit: () => void; onToggleLock: () => void;
}) {
  const sc = STATUS_COLORS[customer.status];
  const isLocked = customer.status === "Bị khóa";

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 480, maxWidth: "92vw", maxHeight: "90vh", background: "#080d1c", border: "1px solid rgba(30,42,80,0.7)", borderRadius: 18, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,${sc.color},transparent)`, flexShrink: 0 }} />

        {/* Header — avatar + name */}
        <div style={{ padding: "24px 22px 18px", borderBottom: "1px solid rgba(30,42,80,0.6)", flexShrink: 0, background: "rgba(255,255,255,0.015)", textAlign: "center", position: "relative" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: AVATAR_COLORS[idx % AVATAR_COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 28, margin: "0 auto 12px", boxShadow: `0 0 24px ${sc.glow}` }}>
            {customer.fullName[0]}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9" }}>{customer.fullName}</span>
            {customer.status === "VIP" && <Crown size={16} style={{ color: "#f59e0b" }} />}
          </div>
          <span style={{ fontFamily: "monospace", fontSize: 11, color: "#334155" }}>#{customer.id}</span>
          <div style={{ marginTop: 10 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 12px", borderRadius: 99, background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 700, boxShadow: `0 0 10px ${sc.glow}` }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.color, display: "inline-block" }} />
              {customer.status}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Contact */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<User size={12} />}>Thông tin liên hệ</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <Mail size={12} />, label: "Email", value: customer.email },
                { icon: <Phone size={12} />, label: "Điện thoại", value: customer.phone },
                { icon: <Calendar size={12} />, label: "Tham gia", value: formatDate(customer.joinedAt) },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#475569" }}>
                    {row.icon}
                    <span style={{ fontSize: 12 }}>{row.label}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "#94a3b8", textAlign: "right" }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "rgba(59,130,246,0.06)", borderRadius: 12, padding: "16px", border: "1px solid rgba(59,130,246,0.15)", textAlign: "center" }}>
              <SectionLabel icon={<ShoppingBag size={12} />}>Đơn hàng</SectionLabel>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#60a5fa" }}>{customer.totalOrders}</div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>đơn hàng</div>
            </div>
            <div style={{ background: "rgba(16,185,129,0.06)", borderRadius: 12, padding: "16px", border: "1px solid rgba(16,185,129,0.15)", textAlign: "center" }}>
              <SectionLabel icon={<DollarSign size={12} />}>Chi tiêu</SectionLabel>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#34d399", lineHeight: 1.2 }}>{formatVND(customer.totalSpending)}</div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>tổng chi tiêu</div>
            </div>
          </div>

          {/* Avg spending */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "14px 18px", border: "1px solid rgba(30,42,80,0.5)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>Chi tiêu trung bình / đơn</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>
              {customer.totalOrders > 0 ? formatVND(Math.round(customer.totalSpending / customer.totalOrders)) : "—"}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 22px", borderTop: "1px solid rgba(30,42,80,0.6)", display: "flex", gap: 10, flexShrink: 0, background: "rgba(255,255,255,0.015)" }}>
          <Button variant="secondary" size="sm" style={{ flex: 1 }} onClick={onEdit}>Chỉnh sửa</Button>
          <Button variant={isLocked ? "primary" : "danger"} size="sm" style={{ flex: 1 }} onClick={onToggleLock}>
            {isLocked ? "Mở khóa TK" : "Khóa TK"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Customer Edit Modal ────────────────────────────────────── */
function CustomerEditModal({ customer, onSave, onClose }: {
  customer: Customer;
  onSave: (id: string, data: Partial<Customer>) => void;
  onClose: () => void;
}) {
  const [fullName, setFullName] = useState(customer.fullName);
  const [email, setEmail]       = useState(customer.email);
  const [phone, setPhone]       = useState(customer.phone);
  const [status, setStatus]     = useState<CustomerStatus>(customer.status);

  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, background: "#060a15", border: "1px solid rgba(30,42,80,0.9)", color: "#e2e8f0", outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 420, maxWidth: "92vw", background: "#0d1226", border: "1px solid rgba(30,42,80,0.8)", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg,#2563eb,#7c3aed)" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(30,42,80,0.7)" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Chỉnh sửa khách hàng</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{customer.fullName}</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Họ tên</label>
            <input style={inputStyle} value={fullName} onChange={e => setFullName(e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Điện thoại</label>
              <input style={inputStyle} value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Trạng thái</label>
            <select style={{ ...inputStyle, cursor: "pointer" }} value={status} onChange={e => setStatus(e.target.value as CustomerStatus)}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ padding: "0 20px 20px", display: "flex", gap: 10 }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant="primary" size="sm" style={{ flex: 1 }} onClick={() => { onSave(customer.id, { fullName, email, phone, status }); onClose(); }}>Lưu thay đổi</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Create Customer Modal ──────────────────────────────────── */
function CreateCustomerModal({ onCreate, onClose }: { onCreate: (c: Customer) => void; onClose: () => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [status, setStatus]     = useState<CustomerStatus>("Hoạt động");
  const [errors, setErrors]     = useState<Record<string, string>>({});

  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, background: "#060a15", border: "1px solid rgba(30,42,80,0.9)", color: "#e2e8f0", outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Bắt buộc";
    if (!email.trim()) e.email = "Bắt buộc";
    if (!phone.trim()) e.phone = "Bắt buộc";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onCreate({ id: `c-${Date.now()}`, fullName: fullName.trim(), email: email.trim(), phone: phone.trim(), totalOrders: 0, totalSpending: 0, status, joinedAt: new Date().toISOString() });
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 460, maxWidth: "92vw", background: "#080d1c", border: "1px solid rgba(30,42,80,0.7)", borderRadius: 18, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg,#2563eb,#7c3aed)", flexShrink: 0 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid rgba(30,42,80,0.6)", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>Thêm khách hàng mới</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 3 }}>Điền thông tin bên dưới</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
        </div>
        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Họ tên <span style={{ color: "#ef4444" }}>*</span></label>
            <input style={{ ...inputStyle, borderColor: errors.fullName ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nguyễn Văn An" />
            {errors.fullName && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.fullName}</span>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Email <span style={{ color: "#ef4444" }}>*</span></label>
              <input style={{ ...inputStyle, borderColor: errors.email ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={email} onChange={e => setEmail(e.target.value)} placeholder="email@gmail.com" />
              {errors.email && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.email}</span>}
            </div>
            <div>
              <label style={labelStyle}>Điện thoại <span style={{ color: "#ef4444" }}>*</span></label>
              <input style={{ ...inputStyle, borderColor: errors.phone ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={phone} onChange={e => setPhone(e.target.value)} placeholder="0912 345 678" />
              {errors.phone && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.phone}</span>}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Trạng thái</label>
            <select style={{ ...inputStyle, cursor: "pointer" }} value={status} onChange={e => setStatus(e.target.value as CustomerStatus)}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ padding: "0 22px 20px", display: "flex", gap: 10 }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} icon={<UserPlus size={13} />} style={{ flex: 2 }}>Thêm khách hàng</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Delete Confirm Modal ───────────────────────────────────── */
function DeleteModal({ customer, onConfirm, onClose }: { customer: Customer; onConfirm: () => void; onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div style={{ width: 360, maxWidth: "90vw", background: "#0d1226", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div style={{ padding: "24px 24px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>👤</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>Xóa khách hàng?</div>
          <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
            Tài khoản <strong style={{ color: "#cbd5e1" }}>{customer.fullName}</strong> và toàn bộ dữ liệu sẽ bị xóa vĩnh viễn.
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

/* ─── Filter Dropdown ────────────────────────────────────────── */
function FilterDropdown({ filters, onChange, onClear, onClose, top, right }: {
  filters: Filters; onChange: (f: Filters) => void;
  onClear: () => void; onClose: () => void; top: number; right: number;
}) {
  const toggleStatus = (s: CustomerStatus) => {
    const next = filters.statuses.includes(s) ? filters.statuses.filter(x => x !== s) : [...filters.statuses, s];
    onChange({ ...filters, statuses: next });
  };
  const fmtSpend = (v: string) => {
    const d = v.replace(/\D/g, "");
    return d ? Math.min(Number(d), 1_000_000_000).toLocaleString("vi-VN") : "";
  };
  return (
    <div style={{ position: "fixed", top, right, zIndex: 500, background: "#0a0e1a", border: "1px solid rgba(30,42,80,0.9)", borderRadius: 12, padding: 16, minWidth: 240, boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Trạng thái</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
        {STATUS_OPTIONS.map(s => (
          <label key={s} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={filters.statuses.includes(s)} onChange={() => toggleStatus(s)} style={{ accentColor: "#3b82f6", width: 14, height: 14, cursor: "pointer" }} />
            <span style={{ fontSize: 12, color: "#cbd5e1" }}>{s}</span>
          </label>
        ))}
      </div>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Tổng chi tiêu</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <input type="text" inputMode="numeric" placeholder="Từ (đ)" value={filters.minSpend} onChange={e => onChange({ ...filters, minSpend: fmtSpend(e.target.value) })} style={{ flex: 1, padding: "7px 10px", borderRadius: 6, fontSize: 12, background: "#060a15", border: "1px solid rgba(30,42,80,0.8)", color: "#e2e8f0", outline: "none", minWidth: 0 }} />
        <input type="text" inputMode="numeric" placeholder="Đến (đ)" value={filters.maxSpend} onChange={e => onChange({ ...filters, maxSpend: fmtSpend(e.target.value) })} style={{ flex: 1, padding: "7px 10px", borderRadius: 6, fontSize: 12, background: "#060a15", border: "1px solid rgba(30,42,80,0.8)", color: "#e2e8f0", outline: "none", minWidth: 0 }} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onClear} style={{ flex: 1, padding: "7px 0", borderRadius: 6, fontSize: 12, border: "1px solid rgba(30,42,80,0.8)", background: "transparent", color: "#64748b", cursor: "pointer" }}>Xóa bộ lọc</button>
        <button onClick={onClose} style={{ flex: 1, padding: "7px 0", borderRadius: 6, fontSize: 12, border: "none", background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff", cursor: "pointer", fontWeight: 600 }}>Áp dụng</button>
      </div>
    </div>
  );
}

/* ─── Pagination Button ──────────────────────────────────────── */
function PagBtn({ children, onClick, disabled = false, active = false }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; active?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: 30, height: 30, borderRadius: 6, fontSize: 12, fontWeight: active ? 700 : 400, cursor: disabled ? "default" : "pointer", border: "1px solid", borderColor: active ? "#3b82f6" : "rgba(30,42,80,0.8)", background: active ? "rgba(59,130,246,0.15)" : "transparent", color: disabled ? "#334155" : active ? "#60a5fa" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
      {children}
    </button>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function CustomersPage() {
  const [customers, setCustomers] = useState([...initialCustomers]);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [search, setSearch]       = useState("");
  const [page, setPage]           = useState(1);
  const [viewing, setViewing]     = useState<{ c: Customer; idx: number } | null>(null);
  const [editing, setEditing]     = useState<Customer | null>(null);
  const [deleting, setDeleting]   = useState<Customer | null>(null);
  const [creating, setCreating]   = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterPos, setFilterPos]   = useState({ top: 0, right: 0 });
  const [filters, setFilters]       = useState<Filters>(DEFAULT_FILTERS);
  const filterRef    = useRef<HTMLDivElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node) && filterBtnRef.current && !filterBtnRef.current.contains(e.target as Node)) setShowFilter(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleToggleFilter = () => {
    if (!showFilter && filterBtnRef.current) {
      const r = filterBtnRef.current.getBoundingClientRect();
      setFilterPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
    }
    setShowFilter(o => !o);
  };

  const activeFilterCount = filters.statuses.length + (filters.minSpend ? 1 : 0) + (filters.maxSpend ? 1 : 0);

  const filtered = customers.filter(c => {
    const tabOk    = activeTab === "Tất cả" || c.status === activeTab;
    const searchOk = !search || [c.fullName, c.email, c.phone].some(s => s.toLowerCase().includes(search.toLowerCase()));
    const statusOk = filters.statuses.length === 0 || filters.statuses.includes(c.status);
    const minOk    = !filters.minSpend || c.totalSpending >= Number(filters.minSpend.replace(/\./g, ""));
    const maxOk    = !filters.maxSpend || c.totalSpending <= Number(filters.maxSpend.replace(/\./g, ""));
    return tabOk && searchOk && statusOk && minOk && maxOk;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const count      = (s: string) => s === "Tất cả" ? customers.length : customers.filter(c => c.status === s).length;
  const totalSpending = customers.reduce((s, c) => s + c.totalSpending, 0);

  const handleTabChange = (tab: string) => { setActiveTab(tab); setPage(1); };
  const handleSearch    = (s: string)   => { setSearch(s); setPage(1); };

  const handleSaveEdit = useCallback((id: string, data: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    setViewing(null);
  }, []);

  const handleToggleLock = useCallback((customer: Customer) => {
    const newStatus: CustomerStatus = customer.status === "Bị khóa" ? "Hoạt động" : "Bị khóa";
    setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, status: newStatus } : c));
    setViewing(prev => prev ? { ...prev, c: { ...prev.c, status: newStatus } } : null);
  }, []);

  return (
    <AdminLayout title="Khách hàng" subtitle="Quản lý khách hàng">
      <div className="page-content">

        <StatsGrid cols={4}>
          <StatCard label="Tổng khách hàng" value={customers.length} change={8.5} changeLabel="so với tháng trước" icon="users" color="blue" />
          <StatCard label="Khách hàng mới" value={156} change={12} changeLabel="so với tháng trước" icon="users" color="green" />
          <StatCard label="Khách VIP" value={count("VIP")} change={2} changeLabel="so với tháng trước" icon="star" color="amber" />
          <StatCard label="Tổng chi tiêu" value={totalSpending} isCurrency change={6.2} changeLabel="so với tháng trước" icon="money" color="purple" />
        </StatsGrid>

        {/* Toolbar + Tabs */}
        <div className="glass-card" style={{ padding: 16 }}>
          <div className="toolbar">
            <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
              <Search size={13} className="search-icon" />
              <input className="admin-input" placeholder="Tìm tên, email, số điện thoại..." value={search} onChange={e => handleSearch(e.target.value)} />
            </div>
            <div style={{ position: "relative" }}>
              <button ref={filterBtnRef} onClick={handleToggleFilter} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "1px solid", borderColor: showFilter || activeFilterCount > 0 ? "rgba(59,130,246,0.6)" : "rgba(30,42,80,0.8)", background: showFilter || activeFilterCount > 0 ? "rgba(59,130,246,0.1)" : "transparent", color: activeFilterCount > 0 ? "#60a5fa" : "#94a3b8" }}>
                <Filter size={13} /> Lọc
                {activeFilterCount > 0 && <span style={{ background: "#3b82f6", color: "#fff", borderRadius: 99, fontSize: 10, fontWeight: 700, padding: "1px 6px", lineHeight: 1.6 }}>{activeFilterCount}</span>}
              </button>
            </div>
            <Button variant="secondary" size="sm" icon={<Download size={13} />}>Excel</Button>
            <Button variant="primary" size="sm" icon={<UserPlus size={13} />} onClick={() => setCreating(true)}>Thêm KH</Button>
          </div>

          <div style={{ display: "flex", gap: 0, marginTop: 14, borderBottom: "1px solid rgba(30,42,80,0.6)" }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => handleTabChange(tab)} className={`tab-btn ${activeTab === tab ? "tab-btn-active" : "tab-btn-inactive"}`}>
                {tab}
                <span className={`tab-count ${activeTab === tab ? "tab-count-active" : "tab-count-inactive"}`}>{count(tab)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="glass-card" style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Khách hàng</th><th>Email</th><th>Điện thoại</th>
                <th>Đơn hàng</th><th>Tổng chi tiêu</th><th>Ngày tham gia</th>
                <th>Trạng thái</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((customer, i) => {
                const realIdx = initialCustomers.findIndex(c => c.id === customer.id);
                return (
                  <tr key={customer.id} onClick={() => setViewing({ c: customer, idx: realIdx })} style={{ cursor: "pointer" }}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: AVATAR_COLORS[realIdx % AVATAR_COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                          {customer.fullName[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 500, color: "#e2e8f0", display: "flex", alignItems: "center", gap: 5 }}>
                            {customer.fullName}
                            {customer.status === "VIP" && <Crown size={11} style={{ color: "#f59e0b" }} />}
                          </div>
                          <div style={{ fontSize: 10, color: "#334155" }}>#{customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 12, color: "#64748b" }}>{customer.email}</span></td>
                    <td><span style={{ fontSize: 12, color: "#64748b" }}>{customer.phone}</span></td>
                    <td><span style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 13 }}>{customer.totalOrders}</span></td>
                    <td><span style={{ fontWeight: 700, color: "#34d399", fontSize: 13 }}>{formatVND(customer.totalSpending)}</span></td>
                    <td><span style={{ fontSize: 11, color: "#475569" }}>{formatDate(customer.joinedAt)}</span></td>
                    <td><CustomerStatusBadge status={customer.status} /></td>
                    <td onClick={e => e.stopPropagation()}>
                      <ActionButtons
                        onView={() => setViewing({ c: customer, idx: realIdx })}
                        onEdit={() => setEditing(customer)}
                        onDelete={() => setDeleting(customer)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state">
              <span style={{ fontSize: 36 }}>👤</span>
              <div style={{ color: "#475569", fontSize: 13 }}>Không tìm thấy khách hàng</div>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "#475569" }}>
            {filtered.length === 0 ? "0" : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)}`} / {filtered.length} khách hàng
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

      {/* Filter dropdown */}
      {showFilter && (
        <div ref={filterRef}>
          <FilterDropdown filters={filters} onChange={f => { setFilters(f); setPage(1); }} onClear={() => { setFilters(DEFAULT_FILTERS); setPage(1); }} onClose={() => setShowFilter(false)} top={filterPos.top} right={filterPos.right} />
        </div>
      )}

      {/* Modals */}
      {creating && <CreateCustomerModal onCreate={c => { setCustomers(prev => [c, ...prev]); setPage(1); }} onClose={() => setCreating(false)} />}
      {viewing && (
        <CustomerDetailModal
          customer={viewing.c} idx={viewing.idx}
          onClose={() => setViewing(null)}
          onEdit={() => { setEditing(viewing.c); setViewing(null); }}
          onToggleLock={() => handleToggleLock(viewing.c)}
        />
      )}
      {editing && <CustomerEditModal customer={editing} onSave={handleSaveEdit} onClose={() => setEditing(null)} />}
      {deleting && <DeleteModal customer={deleting} onConfirm={() => handleDelete(deleting.id)} onClose={() => setDeleting(null)} />}
    </AdminLayout>
  );
}
