"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard, StatsGrid } from "@/components/ui/StatCard";
import { SupplierStatusBadge } from "@/components/ui/Badge";
import { Button, ActionButtons } from "@/components/ui/Button";
import { suppliers as initialSuppliers } from "@/lib/mock-data";
import { formatVND } from "@/lib/utils";
import type { Supplier, SupplierStatus } from "@/lib/types";
import {
  Search, Filter, Plus, X, Building2,
  Phone, Mail, Package, AlertCircle,
  ChevronLeft, ChevronRight, Hash, FileText,
} from "lucide-react";

/* ─── Constants ──────────────────────────────────────────────── */
const TABS = ["Tất cả", "Đang hợp tác", "Chờ duyệt", "Tạm ngưng"] as const;
const PAGE_SIZE = 5;
const STATUS_OPTIONS: SupplierStatus[] = ["Đang hợp tác", "Chờ duyệt", "Tạm ngưng"];

const AVATAR_COLORS = [
  "linear-gradient(135deg,#2563eb,#7c3aed)",
  "linear-gradient(135deg,#059669,#0891b2)",
  "linear-gradient(135deg,#d97706,#dc2626)",
  "linear-gradient(135deg,#7c3aed,#db2777)",
  "linear-gradient(135deg,#0891b2,#2563eb)",
  "linear-gradient(135deg,#dc2626,#d97706)",
  "linear-gradient(135deg,#db2777,#7c3aed)",
];

const STATUS_COLORS: Record<SupplierStatus, { color: string; bg: string; glow: string }> = {
  "Đang hợp tác": { color: "#10b981", bg: "rgba(16,185,129,0.12)", glow: "rgba(16,185,129,0.25)" },
  "Chờ duyệt":    { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", glow: "rgba(245,158,11,0.25)" },
  "Tạm ngưng":    { color: "#ef4444", bg: "rgba(239,68,68,0.12)",  glow: "rgba(239,68,68,0.25)" },
};

type Filters = { statuses: SupplierStatus[]; hasDebt: boolean };
const DEFAULT_FILTERS: Filters = { statuses: [], hasDebt: false };

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

/* ─── Supplier Detail Modal ──────────────────────────────────── */
function SupplierDetailModal({ supplier, idx, onClose, onEdit, onToggleStatus }: {
  supplier: Supplier; idx: number; onClose: () => void;
  onEdit: () => void; onToggleStatus: () => void;
}) {
  const sc = STATUS_COLORS[supplier.status];
  const isSuspended = supplier.status === "Tạm ngưng";

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 500, maxWidth: "92vw", maxHeight: "90vh", background: "#080d1c", border: "1px solid rgba(30,42,80,0.7)", borderRadius: 18, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,${sc.color},transparent)`, flexShrink: 0 }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "20px 22px 16px", borderBottom: "1px solid rgba(30,42,80,0.6)", flexShrink: 0, background: "rgba(255,255,255,0.015)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: AVATAR_COLORS[idx % AVATAR_COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 18, flexShrink: 0, boxShadow: `0 4px 20px ${sc.glow}` }}>
              {supplier.companyName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9", lineHeight: 1.3 }}>{supplier.companyName}</div>
              <div style={{ fontSize: 11, fontFamily: "monospace", color: "#475569", marginTop: 4 }}>MST: {supplier.taxCode}</div>
              <div style={{ marginTop: 8 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 99, background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 700, boxShadow: `0 0 10px ${sc.glow}` }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.color, display: "inline-block" }} />
                  {supplier.status}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><X size={15} /></button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Debt alert */}
          {supplier.debt > 0 && (
            <div style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", gap: 12 }}>
              <AlertCircle size={18} style={{ color: "#f87171", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#f87171", marginBottom: 2 }}>Công nợ chưa thanh toán</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#ef4444" }}>{formatVND(supplier.debt)}</div>
              </div>
            </div>
          )}

          {/* Contact */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<Mail size={12} />}>Thông tin liên hệ</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <Building2 size={12} />, label: "Người liên hệ", value: supplier.contactPerson, bold: true },
                { icon: <Mail size={12} />,      label: "Email",         value: supplier.email },
                { icon: <Phone size={12} />,     label: "Điện thoại",    value: supplier.phone },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#475569" }}>
                    {row.icon}
                    <span style={{ fontSize: 12 }}>{row.label}</span>
                  </div>
                  <span style={{ fontSize: 12, color: row.bold ? "#e2e8f0" : "#94a3b8", fontWeight: row.bold ? 600 : 400 }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "rgba(59,130,246,0.06)", borderRadius: 12, padding: 16, border: "1px solid rgba(59,130,246,0.15)", textAlign: "center" }}>
              <SectionLabel icon={<Package size={12} />}>Sản phẩm</SectionLabel>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#60a5fa" }}>{supplier.suppliedProducts}</div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>đang cung cấp</div>
            </div>
            <div style={{ background: supplier.debt > 0 ? "rgba(239,68,68,0.06)" : "rgba(16,185,129,0.06)", borderRadius: 12, padding: 16, border: supplier.debt > 0 ? "1px solid rgba(239,68,68,0.15)" : "1px solid rgba(16,185,129,0.15)", textAlign: "center" }}>
              <SectionLabel icon={<FileText size={12} />}>Công nợ</SectionLabel>
              <div style={{ fontSize: supplier.debt > 0 ? 18 : 24, fontWeight: 800, color: supplier.debt > 0 ? "#ef4444" : "#34d399" }}>
                {supplier.debt > 0 ? formatVND(supplier.debt) : "0đ"}
              </div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{supplier.debt > 0 ? "chưa thanh toán" : "không có nợ"}</div>
            </div>
          </div>

          {/* Tax info */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "14px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<Hash size={12} />}>Thông tin thuế</SectionLabel>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#64748b" }}>Mã số thuế</span>
              <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 600, color: "#60a5fa" }}>{supplier.taxCode}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 22px", borderTop: "1px solid rgba(30,42,80,0.6)", display: "flex", gap: 10, flexShrink: 0, background: "rgba(255,255,255,0.015)" }}>
          <Button variant="secondary" size="sm" style={{ flex: 1 }} onClick={onEdit}>Chỉnh sửa</Button>
          <Button variant={isSuspended ? "primary" : "danger"} size="sm" style={{ flex: 1 }} onClick={onToggleStatus}>
            {isSuspended ? "Kích hoạt lại" : "Tạm ngưng"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Supplier Edit Modal ────────────────────────────────────── */
function SupplierEditModal({ supplier, onSave, onClose }: {
  supplier: Supplier;
  onSave: (id: string, data: Partial<Supplier>) => void;
  onClose: () => void;
}) {
  const [companyName, setCompanyName]       = useState(supplier.companyName);
  const [taxCode, setTaxCode]               = useState(supplier.taxCode);
  const [contactPerson, setContactPerson]   = useState(supplier.contactPerson);
  const [email, setEmail]                   = useState(supplier.email);
  const [phone, setPhone]                   = useState(supplier.phone);
  const [status, setStatus]                 = useState<SupplierStatus>(supplier.status);

  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, background: "#060a15", border: "1px solid rgba(30,42,80,0.9)", color: "#e2e8f0", outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 480, maxWidth: "92vw", background: "#0d1226", border: "1px solid rgba(30,42,80,0.8)", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg,#2563eb,#7c3aed)" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(30,42,80,0.7)" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Chỉnh sửa nhà cung cấp</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{supplier.companyName}</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={labelStyle}>Tên công ty</label>
            <input style={inputStyle} value={companyName} onChange={e => setCompanyName(e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Mã số thuế</label>
              <input style={{ ...inputStyle, fontFamily: "monospace" }} value={taxCode} onChange={e => setTaxCode(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Người liên hệ</label>
              <input style={inputStyle} value={contactPerson} onChange={e => setContactPerson(e.target.value)} />
            </div>
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
            <select style={{ ...inputStyle, cursor: "pointer" }} value={status} onChange={e => setStatus(e.target.value as SupplierStatus)}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ padding: "0 20px 20px", display: "flex", gap: 10 }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant="primary" size="sm" style={{ flex: 1 }} onClick={() => { onSave(supplier.id, { companyName, taxCode, contactPerson, email, phone, status }); onClose(); }}>Lưu thay đổi</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Create Supplier Modal ──────────────────────────────────── */
function CreateSupplierModal({ onCreate, onClose }: { onCreate: (s: Supplier) => void; onClose: () => void }) {
  const [companyName, setCompanyName]     = useState("");
  const [taxCode, setTaxCode]             = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail]                 = useState("");
  const [phone, setPhone]                 = useState("");
  const [status, setStatus]               = useState<SupplierStatus>("Chờ duyệt");
  const [errors, setErrors]               = useState<Record<string, string>>({});

  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, background: "#060a15", border: "1px solid rgba(30,42,80,0.9)", color: "#e2e8f0", outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!companyName.trim()) e.companyName = "Bắt buộc";
    if (!taxCode.trim()) e.taxCode = "Bắt buộc";
    if (!contactPerson.trim()) e.contactPerson = "Bắt buộc";
    if (!email.trim()) e.email = "Bắt buộc";
    if (!phone.trim()) e.phone = "Bắt buộc";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onCreate({ id: `s-${Date.now()}`, companyName: companyName.trim(), taxCode: taxCode.trim(), contactPerson: contactPerson.trim(), email: email.trim(), phone: phone.trim(), suppliedProducts: 0, debt: 0, status, createdAt: new Date().toISOString() });
    onClose();
  };

  const field = (key: string, label: string, value: string, setValue: (v: string) => void, props?: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label style={labelStyle}>{label} <span style={{ color: "#ef4444" }}>*</span></label>
      <input style={{ ...inputStyle, borderColor: errors[key] ? "#ef4444" : "rgba(30,42,80,0.9)", ...(props?.style) }} value={value} onChange={e => setValue(e.target.value)} {...props} />
      {errors[key] && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors[key]}</span>}
    </div>
  );

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 520, maxWidth: "94vw", maxHeight: "90vh", background: "#080d1c", border: "1px solid rgba(30,42,80,0.7)", borderRadius: 18, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg,#2563eb,#7c3aed)", flexShrink: 0 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid rgba(30,42,80,0.6)", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>Thêm nhà cung cấp mới</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 3 }}>Điền đầy đủ thông tin bên dưới</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Company info */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<Building2 size={12} />}>Thông tin công ty</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {field("companyName", "Tên công ty", companyName, setCompanyName, { placeholder: "Microsoft Việt Nam" })}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {field("taxCode", "Mã số thuế", taxCode, setTaxCode, { placeholder: "0101234567", style: { fontFamily: "monospace" } })}
                <div>
                  <label style={labelStyle}>Trạng thái</label>
                  <select style={{ ...inputStyle, cursor: "pointer" }} value={status} onChange={e => setStatus(e.target.value as SupplierStatus)}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<Mail size={12} />}>Thông tin liên hệ</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {field("contactPerson", "Người liên hệ", contactPerson, setContactPerson, { placeholder: "Nguyễn Văn A" })}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {field("email", "Email", email, setEmail, { placeholder: "contact@company.com" })}
                {field("phone", "Điện thoại", phone, setPhone, { placeholder: "024 1234 5678" })}
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "14px 22px", borderTop: "1px solid rgba(30,42,80,0.6)", display: "flex", gap: 10, flexShrink: 0, background: "rgba(255,255,255,0.015)" }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} icon={<Plus size={13} />} style={{ flex: 2 }}>Thêm nhà cung cấp</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Delete Confirm Modal ───────────────────────────────────── */
function DeleteModal({ supplier, onConfirm, onClose }: { supplier: Supplier; onConfirm: () => void; onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div style={{ width: 360, maxWidth: "90vw", background: "#0d1226", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div style={{ padding: "24px 24px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🏢</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>Xóa nhà cung cấp?</div>
          <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
            <strong style={{ color: "#cbd5e1" }}>{supplier.companyName}</strong> sẽ bị xóa vĩnh viễn khỏi hệ thống.
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
  const toggle = (s: SupplierStatus) => {
    const next = filters.statuses.includes(s) ? filters.statuses.filter(x => x !== s) : [...filters.statuses, s];
    onChange({ ...filters, statuses: next });
  };
  return (
    <div style={{ position: "fixed", top, right, zIndex: 500, background: "#0a0e1a", border: "1px solid rgba(30,42,80,0.9)", borderRadius: 12, padding: 16, minWidth: 220, boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Trạng thái</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
        {STATUS_OPTIONS.map(s => (
          <label key={s} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={filters.statuses.includes(s)} onChange={() => toggle(s)} style={{ accentColor: "#3b82f6", width: 14, height: 14, cursor: "pointer" }} />
            <span style={{ fontSize: 12, color: "#cbd5e1" }}>{s}</span>
          </label>
        ))}
      </div>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Công nợ</div>
      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 14 }}>
        <input type="checkbox" checked={filters.hasDebt} onChange={() => onChange({ ...filters, hasDebt: !filters.hasDebt })} style={{ accentColor: "#ef4444", width: 14, height: 14, cursor: "pointer" }} />
        <span style={{ fontSize: 12, color: "#f87171" }}>Chỉ hiện có công nợ</span>
      </label>
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
export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([...initialSuppliers]);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [search, setSearch]       = useState("");
  const [page, setPage]           = useState(1);
  const [viewing, setViewing]     = useState<{ s: Supplier; idx: number } | null>(null);
  const [editing, setEditing]     = useState<Supplier | null>(null);
  const [deleting, setDeleting]   = useState<Supplier | null>(null);
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

  const activeFilterCount = filters.statuses.length + (filters.hasDebt ? 1 : 0);

  const filtered = suppliers.filter(s => {
    const tabOk    = activeTab === "Tất cả" || s.status === activeTab;
    const searchOk = !search || [s.companyName, s.taxCode, s.contactPerson].some(str => str.toLowerCase().includes(search.toLowerCase()));
    const statusOk = filters.statuses.length === 0 || filters.statuses.includes(s.status);
    const debtOk   = !filters.hasDebt || s.debt > 0;
    return tabOk && searchOk && statusOk && debtOk;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const count      = (s: string) => s === "Tất cả" ? suppliers.length : suppliers.filter(sup => sup.status === s).length;
  const totalDebt  = suppliers.reduce((acc, s) => acc + s.debt, 0);

  const handleSaveEdit = useCallback((id: string, data: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
    setViewing(null);
  }, []);

  const handleToggleStatus = useCallback((supplier: Supplier) => {
    const newStatus: SupplierStatus = supplier.status === "Tạm ngưng" ? "Đang hợp tác" : "Tạm ngưng";
    setSuppliers(prev => prev.map(s => s.id === supplier.id ? { ...s, status: newStatus } : s));
    setViewing(prev => prev ? { ...prev, s: { ...prev.s, status: newStatus } } : null);
  }, []);

  return (
    <AdminLayout title="Nhà cung cấp" subtitle="Quản lý nhà cung cấp">
      <div className="page-content">

        <StatsGrid cols={4}>
          <StatCard label="Tổng NCC" value={suppliers.length} change={5} changeLabel="so với tháng trước" icon="building" color="blue" />
          <StatCard label="Đang hợp tác" value={count("Đang hợp tác")} change={1} changeLabel="so với tháng trước" icon="building" color="green" />
          <StatCard label="Chờ duyệt" value={count("Chờ duyệt")} changeLabel="so với tháng trước" icon="building" color="amber" />
          <StatCard label="Tổng công nợ" value={totalDebt} isCurrency change={-8} changeLabel="so với tháng trước" icon="money" color="rose" />
        </StatsGrid>

        {/* Toolbar + Tabs */}
        <div className="glass-card" style={{ padding: 16 }}>
          <div className="toolbar">
            <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
              <Search size={13} className="search-icon" />
              <input className="admin-input" placeholder="Tìm công ty, MST, người liên hệ..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <div style={{ position: "relative" }}>
              <button ref={filterBtnRef} onClick={handleToggleFilter} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "1px solid", borderColor: showFilter || activeFilterCount > 0 ? "rgba(59,130,246,0.6)" : "rgba(30,42,80,0.8)", background: showFilter || activeFilterCount > 0 ? "rgba(59,130,246,0.1)" : "transparent", color: activeFilterCount > 0 ? "#60a5fa" : "#94a3b8" }}>
                <Filter size={13} /> Lọc
                {activeFilterCount > 0 && <span style={{ background: "#3b82f6", color: "#fff", borderRadius: 99, fontSize: 10, fontWeight: 700, padding: "1px 6px", lineHeight: 1.6 }}>{activeFilterCount}</span>}
              </button>
            </div>
            <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => setCreating(true)}>Thêm NCC</Button>
          </div>

          <div style={{ display: "flex", gap: 0, marginTop: 14, borderBottom: "1px solid rgba(30,42,80,0.6)" }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} className={`tab-btn ${activeTab === tab ? "tab-btn-active" : "tab-btn-inactive"}`}>
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
                <th>Công ty</th><th>Mã số thuế</th><th>Người liên hệ</th>
                <th>Email</th><th>Điện thoại</th><th>SP cung cấp</th>
                <th>Công nợ</th><th>Trạng thái</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map(supplier => {
                const idx = initialSuppliers.findIndex(s => s.id === supplier.id);
                return (
                  <tr key={supplier.id} onClick={() => setViewing({ s: supplier, idx })} style={{ cursor: "pointer" }}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: AVATAR_COLORS[idx % AVATAR_COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 12, flexShrink: 0 }}>
                          {supplier.companyName.slice(0, 2).toUpperCase()}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{supplier.companyName}</div>
                      </div>
                    </td>
                    <td><span style={{ fontFamily: "monospace", color: "#64748b", fontSize: 11 }}>{supplier.taxCode}</span></td>
                    <td><span style={{ fontSize: 12, color: "#94a3b8" }}>{supplier.contactPerson}</span></td>
                    <td><span style={{ fontSize: 11, color: "#64748b" }}>{supplier.email}</span></td>
                    <td><span style={{ fontSize: 12, color: "#94a3b8" }}>{supplier.phone}</span></td>
                    <td><span style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 13 }}>{supplier.suppliedProducts}</span></td>
                    <td>
                      <span style={{ fontWeight: 600, fontSize: 12, color: supplier.debt > 0 ? "#f87171" : "#34d399" }}>
                        {supplier.debt > 0 ? formatVND(supplier.debt) : "Không có"}
                      </span>
                    </td>
                    <td><SupplierStatusBadge status={supplier.status} /></td>
                    <td onClick={e => e.stopPropagation()}>
                      <ActionButtons
                        onView={() => setViewing({ s: supplier, idx })}
                        onEdit={() => setEditing(supplier)}
                        onDelete={() => setDeleting(supplier)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state">
              <span style={{ fontSize: 36 }}>🏢</span>
              <div style={{ color: "#475569", fontSize: 13 }}>Không tìm thấy nhà cung cấp</div>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "#475569" }}>
            {filtered.length === 0 ? "0" : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)}`} / {filtered.length} nhà cung cấp
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
      {creating && <CreateSupplierModal onCreate={s => { setSuppliers(prev => [s, ...prev]); setPage(1); }} onClose={() => setCreating(false)} />}
      {viewing && (
        <SupplierDetailModal
          supplier={viewing.s} idx={viewing.idx}
          onClose={() => setViewing(null)}
          onEdit={() => { setEditing(viewing.s); setViewing(null); }}
          onToggleStatus={() => handleToggleStatus(viewing.s)}
        />
      )}
      {editing && <SupplierEditModal supplier={editing} onSave={handleSaveEdit} onClose={() => setEditing(null)} />}
      {deleting && <DeleteModal supplier={deleting} onConfirm={() => handleDelete(deleting.id)} onClose={() => setDeleting(null)} />}
    </AdminLayout>
  );
}
