"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard, StatsGrid } from "@/components/ui/StatCard";
import { KeyStatusBadge } from "@/components/ui/Badge";
import { Button, ActionButtons } from "@/components/ui/Button";
import { keysApi, productsApi } from "@/lib/api";
import type { ApiMeta } from "@/lib/api";
import { formatDate, maskKey } from "@/lib/utils";
import type { LicenseKey, KeyStatus, Product } from "@/lib/types";
import {
  Search, Filter, Download, Plus, Copy, Zap, X,
  KeyRound, User, Package, Calendar, Eye, EyeOff,
  ChevronLeft, ChevronRight, RefreshCw, Lock, Unlock,
} from "lucide-react";

/* ─── Constants ──────────────────────────────────────────────── */
const KEY_TABS = ["Tất cả", "Hoạt động", "Sắp hết hạn", "Đã hết hạn", "Bị khóa", "Chưa kích hoạt"] as const;
const PAGE_SIZE = 5;
const ALL_STATUSES: KeyStatus[] = ["Hoạt động", "Sắp hết hạn", "Đã hết hạn", "Bị khóa", "Chưa kích hoạt"];

const STATUS_COLORS: Record<KeyStatus, { color: string; bg: string; glow: string }> = {
  "Hoạt động":       { color: "#10b981", bg: "rgba(16,185,129,0.12)",  glow: "rgba(16,185,129,0.25)" },
  "Sắp hết hạn":    { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  glow: "rgba(245,158,11,0.25)" },
  "Đã hết hạn":     { color: "#ef4444", bg: "rgba(239,68,68,0.12)",   glow: "rgba(239,68,68,0.25)" },
  "Bị khóa":        { color: "#8b5cf6", bg: "rgba(139,92,246,0.12)",  glow: "rgba(139,92,246,0.25)" },
  "Chưa kích hoạt": { color: "#64748b", bg: "rgba(100,116,139,0.12)", glow: "rgba(100,116,139,0.2)" },
};

type Filters = { statuses: KeyStatus[] };
const DEFAULT_FILTERS: Filters = { statuses: [] };

const genKey = (prefix = "NEXK") => {
  const rand = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${rand()}-${rand()}-${rand()}`;
};

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
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
      <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(59,130,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa" }}>{icon}</div>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>{children}</span>
    </div>
  );
}

/* ─── Copy Button ────────────────────────────────────────────── */
function CopyBtn({ text, size = "md" }: { text: string; size?: "sm" | "md" }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handle} style={{ display: "flex", alignItems: "center", gap: 5, padding: size === "sm" ? "3px 8px" : "6px 12px", borderRadius: 6, fontSize: size === "sm" ? 11 : 12, fontWeight: 500, border: "1px solid rgba(30,42,80,0.8)", background: copied ? "rgba(16,185,129,0.1)" : "transparent", color: copied ? "#34d399" : "#94a3b8", cursor: "pointer", transition: "all 0.15s", flexShrink: 0 }}>
      {copied ? <><span>✓</span> Đã copy</> : <><Copy size={size === "sm" ? 11 : 13} /> Copy</>}
    </button>
  );
}

/* ─── Key Detail Modal ───────────────────────────────────────── */
function KeyDetailModal({ licKey, onClose, onEdit, onToggleLock }: {
  licKey: LicenseKey; onClose: () => void;
  onEdit: () => void; onToggleLock: () => void;
}) {
  const [showFull, setShowFull] = useState(false);
  const sc = STATUS_COLORS[licKey.status];
  const isLocked = licKey.status === "Bị khóa";

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 500, maxWidth: "92vw", maxHeight: "90vh", background: "#080d1c", border: "1px solid rgba(30,42,80,0.7)", borderRadius: 18, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,${sc.color},transparent)`, flexShrink: 0 }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid rgba(30,42,80,0.6)", flexShrink: 0, background: "rgba(255,255,255,0.015)" }}>
          <div>
            <div style={{ fontSize: 11, color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Chi tiết License Key</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <KeyRound size={16} style={{ color: sc.color }} />
              <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{licKey.id}</span>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 99, background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 700, boxShadow: `0 0 10px ${sc.glow}` }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.color, display: "inline-block" }} />
              {licKey.status}
            </span>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><X size={15} /></button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Key value */}
          <div style={{ background: `rgba(${licKey.status === "Bị khóa" ? "139,92,246" : "59,130,246"},0.06)`, border: `1px solid rgba(${licKey.status === "Bị khóa" ? "139,92,246" : "59,130,246"},0.2)`, borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <SectionLabel icon={<KeyRound size={12} />}>License Key</SectionLabel>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setShowFull(v => !v)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 6, fontSize: 11, border: "1px solid rgba(30,42,80,0.8)", background: "transparent", color: "#64748b", cursor: "pointer" }}>
                  {showFull ? <EyeOff size={11} /> : <Eye size={11} />}
                  {showFull ? "Ẩn" : "Hiện"}
                </button>
                <CopyBtn text={licKey.key} size="sm" />
              </div>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 700, color: sc.color, letterSpacing: "0.08em", padding: "12px 14px", background: "rgba(0,0,0,0.3)", borderRadius: 8, wordBreak: "break-all", border: `1px solid ${sc.color}20` }}>
              {showFull ? licKey.key : maskKey(licKey.key)}
            </div>
          </div>

          {/* Product */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<Package size={12} />}>Sản phẩm</SectionLabel>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{licKey.productName}</div>
            <div style={{ fontSize: 11, fontFamily: "monospace", color: "#475569", marginTop: 3 }}>ID: {licKey.productId}</div>
          </div>

          {/* Customer */}
          {licKey.customerName && (
            <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
              <SectionLabel icon={<User size={12} />}>Khách hàng</SectionLabel>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                  {licKey.customerName[0]}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{licKey.customerName}</div>
                  {licKey.customerId && <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>#{licKey.customerId}</div>}
                </div>
              </div>
            </div>
          )}

          {/* Dates + Order */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<Calendar size={12} />}>Thời hạn & Đơn hàng</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Kích hoạt", value: licKey.activatedAt ? formatDate(licKey.activatedAt) : "Chưa kích hoạt", color: licKey.activatedAt ? "#94a3b8" : "#334155" },
                { label: "Hết hạn", value: licKey.expiresAt ? formatDate(licKey.expiresAt) : "Vĩnh viễn", color: licKey.status === "Sắp hết hạn" ? "#f59e0b" : licKey.status === "Đã hết hạn" ? "#ef4444" : "#94a3b8" },
                ...(licKey.orderId ? [{ label: "Mã đơn hàng", value: `#${licKey.orderId}`, color: "#60a5fa" }] : []),
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>{row.label}</span>
                  <span style={{ fontSize: 12, color: row.color, fontWeight: 500, fontFamily: row.label === "Mã đơn hàng" ? "monospace" : undefined }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 22px", borderTop: "1px solid rgba(30,42,80,0.6)", display: "flex", gap: 10, flexShrink: 0, background: "rgba(255,255,255,0.015)" }}>
          <Button variant="secondary" size="sm" icon={<RefreshCw size={12} />} style={{ flex: 1 }} onClick={onEdit}>Gia hạn / Sửa</Button>
          <Button variant={isLocked ? "primary" : "danger"} size="sm" icon={isLocked ? <Unlock size={12} /> : <Lock size={12} />} style={{ flex: 1 }} onClick={onToggleLock}>
            {isLocked ? "Mở khóa" : "Khóa key"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Key Edit Modal ─────────────────────────────────────────── */
function KeyEditModal({ licKey, onSave, onClose }: {
  licKey: LicenseKey;
  onSave: (id: string, data: Partial<LicenseKey>) => void;
  onClose: () => void;
}) {
  const [status, setStatus]   = useState<KeyStatus>(licKey.status);
  const [expires, setExpires] = useState(licKey.expiresAt ? licKey.expiresAt.slice(0, 10) : "");

  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, background: "#060a15", border: "1px solid rgba(30,42,80,0.9)", color: "#e2e8f0", outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 400, maxWidth: "92vw", background: "#0d1226", border: "1px solid rgba(30,42,80,0.8)", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,${STATUS_COLORS[status].color},transparent)` }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(30,42,80,0.7)" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Chỉnh sửa key</div>
            <div style={{ fontSize: 11, fontFamily: "monospace", color: "#475569", marginTop: 2 }}>{maskKey(licKey.key)}</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Trạng thái</label>
            <select style={{ ...inputStyle, cursor: "pointer" }} value={status} onChange={e => setStatus(e.target.value as KeyStatus)}>
              {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Ngày hết hạn</label>
            <input type="date" style={{ ...inputStyle, colorScheme: "dark" }} value={expires} onChange={e => setExpires(e.target.value)} />
            <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>Để trống = vĩnh viễn</div>
          </div>
        </div>
        <div style={{ padding: "0 20px 20px", display: "flex", gap: 10 }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant="primary" size="sm" style={{ flex: 1 }} onClick={() => {
            onSave(licKey.id, { status, expiresAt: expires ? new Date(expires).toISOString() : undefined });
            onClose();
          }}>Lưu thay đổi</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Create Key Modal ───────────────────────────────────────── */
function CreateKeyModal({ onCreate, onClose, products }: { onCreate: (body: Record<string, unknown>) => void; onClose: () => void; products: Product[] }) {
  const [keyVal, setKeyVal]       = useState(genKey());
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [status, setStatus]       = useState<KeyStatus>("Chưa kích hoạt");
  const [expires, setExpires]     = useState("");
  const [errors, setErrors]       = useState<Record<string, string>>({});

  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, background: "#060a15", border: "1px solid rgba(30,42,80,0.9)", color: "#e2e8f0", outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!keyVal.trim()) e.key = "Bắt buộc";
    if (!productId) e.product = "Bắt buộc";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onCreate({ key: keyVal.trim().toUpperCase(), productId, status, expiresAt: expires ? new Date(expires).toISOString() : undefined });
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 460, maxWidth: "92vw", background: "#080d1c", border: "1px solid rgba(30,42,80,0.7)", borderRadius: 18, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg,#3b82f6,#7c3aed)", flexShrink: 0 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid rgba(30,42,80,0.6)", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>Thêm key mới</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 3 }}>Tạo license key mới vào hệ thống</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
        </div>
        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>License Key <span style={{ color: "#ef4444" }}>*</span></label>
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...inputStyle, fontFamily: "monospace", flex: 1, borderColor: errors.key ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={keyVal} onChange={e => setKeyVal(e.target.value)} placeholder="NEXK-XXXX-XXXX-XXXX" />
              <button onClick={() => setKeyVal(genKey())} style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid rgba(30,42,80,0.9)", background: "rgba(59,130,246,0.1)", color: "#60a5fa", cursor: "pointer", flexShrink: 0 }} title="Tạo ngẫu nhiên">
                <RefreshCw size={14} />
              </button>
            </div>
            {errors.key && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.key}</span>}
          </div>
          <div>
            <label style={labelStyle}>Sản phẩm <span style={{ color: "#ef4444" }}>*</span></label>
            <select style={{ ...inputStyle, cursor: "pointer", borderColor: errors.product ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={productId} onChange={e => setProductId(e.target.value)}>
              <option value="">-- Chọn sản phẩm --</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {errors.product && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.product}</span>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Trạng thái</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={status} onChange={e => setStatus(e.target.value as KeyStatus)}>
                {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Ngày hết hạn</label>
              <input type="date" style={{ ...inputStyle, colorScheme: "dark" }} value={expires} onChange={e => setExpires(e.target.value)} />
            </div>
          </div>
        </div>
        <div style={{ padding: "0 22px 20px", display: "flex", gap: 10 }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} icon={<Plus size={13} />} style={{ flex: 2 }}>Thêm key</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Bulk Generate Modal ────────────────────────────────────── */
function BulkGenerateModal({ onCreate, onClose, products }: { onCreate: (body: Record<string, unknown>) => void; onClose: () => void; products: Product[] }) {
  const [prefix, setPrefix]       = useState("NEXK");
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [quantity, setQuantity]   = useState("5");
  const [status, setStatus]       = useState<KeyStatus>("Chưa kích hoạt");
  const [expires, setExpires]     = useState("");
  const [errors, setErrors]       = useState<Record<string, string>>({});

  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, background: "#060a15", border: "1px solid rgba(30,42,80,0.9)", color: "#e2e8f0", outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };
  const qty = Math.min(50, Math.max(1, Number(quantity) || 1));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!productId) e.product = "Bắt buộc";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onCreate({ productId, quantity: qty, prefix: prefix.trim().toUpperCase() || "NEXK", status, expiresAt: expires ? new Date(expires).toISOString() : undefined });
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 460, maxWidth: "92vw", background: "#080d1c", border: "1px solid rgba(30,42,80,0.7)", borderRadius: 18, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg,#f59e0b,#ef4444)", flexShrink: 0 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid rgba(30,42,80,0.6)", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>Tạo key hàng loạt</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 3 }}>Tối đa 50 key mỗi lần</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
        </div>
        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Sản phẩm <span style={{ color: "#ef4444" }}>*</span></label>
            <select style={{ ...inputStyle, cursor: "pointer", borderColor: errors.product ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={productId} onChange={e => setProductId(e.target.value)}>
              <option value="">-- Chọn sản phẩm --</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {errors.product && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.product}</span>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Prefix key</label>
              <input style={{ ...inputStyle, fontFamily: "monospace" }} value={prefix} onChange={e => setPrefix(e.target.value)} placeholder="NEXK" maxLength={8} />
            </div>
            <div>
              <label style={labelStyle}>Số lượng (tối đa 50)</label>
              <input type="text" inputMode="numeric" style={inputStyle} value={quantity} onChange={e => setQuantity(e.target.value.replace(/\D/g, ""))} />
            </div>
            <div>
              <label style={labelStyle}>Trạng thái</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={status} onChange={e => setStatus(e.target.value as KeyStatus)}>
                {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Ngày hết hạn</label>
              <input type="date" style={{ ...inputStyle, colorScheme: "dark" }} value={expires} onChange={e => setExpires(e.target.value)} />
            </div>
          </div>
          {/* Preview */}
          <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>Sẽ tạo</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#f59e0b" }}>{qty} keys</span>
          </div>
        </div>
        <div style={{ padding: "0 22px 20px", display: "flex", gap: 10 }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} icon={<Zap size={13} />} style={{ flex: 2 }}>Tạo {qty} keys</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Delete Confirm Modal ───────────────────────────────────── */
function DeleteModal({ licKey, onConfirm, onClose }: { licKey: LicenseKey; onConfirm: () => void; onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div style={{ width: 360, maxWidth: "90vw", background: "#0d1226", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div style={{ padding: "24px 24px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>Xóa license key?</div>
          <div style={{ fontFamily: "monospace", fontSize: 12, color: "#60a5fa", background: "rgba(59,130,246,0.08)", padding: "6px 12px", borderRadius: 6, marginBottom: 8 }}>{maskKey(licKey.key)}</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>Key này sẽ bị xóa vĩnh viễn.</div>
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
  const toggle = (s: KeyStatus) => {
    const next = filters.statuses.includes(s) ? filters.statuses.filter(x => x !== s) : [...filters.statuses, s];
    onChange({ ...filters, statuses: next });
  };
  return (
    <div style={{ position: "fixed", top, right, zIndex: 500, background: "#0a0e1a", border: "1px solid rgba(30,42,80,0.9)", borderRadius: 12, padding: 16, minWidth: 210, boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Trạng thái key</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
        {ALL_STATUSES.map(s => (
          <label key={s} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={filters.statuses.includes(s)} onChange={() => toggle(s)} style={{ accentColor: STATUS_COLORS[s].color, width: 14, height: 14, cursor: "pointer" }} />
            <span style={{ fontSize: 12, color: STATUS_COLORS[s].color }}>{s}</span>
          </label>
        ))}
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
export default function KeysPage() {
  const [keys, setKeys]           = useState<LicenseKey[]>([]);
  const [meta, setMeta]           = useState<ApiMeta>({ total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 });
  const [loading, setLoading]     = useState(false);
  const [apiError, setApiError]   = useState<string | null>(null);
  const [products, setProducts]   = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [search, setSearch]       = useState("");
  const [page, setPage]           = useState(1);
  const [viewing, setViewing]     = useState<LicenseKey | null>(null);
  const [editing, setEditing]     = useState<LicenseKey | null>(null);
  const [deleting, setDeleting]   = useState<LicenseKey | null>(null);
  const [creating, setCreating]   = useState(false);
  const [bulking, setBulking]     = useState(false);
  const [copiedId, setCopiedId]   = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filterPos, setFilterPos]   = useState({ top: 0, right: 0 });
  const [filters, setFilters]       = useState<Filters>(DEFAULT_FILTERS);
  const filterRef    = useRef<HTMLDivElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const statusParam = activeTab !== "Tất cả" ? activeTab : undefined;
      const result = await keysApi.list({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        status: statusParam,
      });
      setKeys(result.data);
      setMeta(result.meta);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }, [page, search, activeTab]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    productsApi.list({ limit: 100 }).then(r => setProducts(r.data)).catch(() => {});
  }, []);

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

  const activeFilterCount = filters.statuses.length;

  const totalPages = meta.totalPages;
  const pageItems  = keys;

  const handleSaveEdit = useCallback(async (id: string, data: Partial<LicenseKey>) => {
    try {
      await keysApi.update(id, data as Record<string, unknown>);
      await fetchData();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }, [fetchData]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await keysApi.delete(id);
      setViewing(null);
      await fetchData();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }, [fetchData]);

  const handleToggleLock = useCallback(async (k: LicenseKey) => {
    const locked = k.status !== "Bị khóa";
    try {
      await keysApi.lock(k.id, locked);
      setViewing(null);
      await fetchData();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }, [fetchData]);

  const handleCopyInline = (key: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(key).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AdminLayout title="Key / License" subtitle="Quản lý key và license kỹ thuật số">
      <div className="page-content">

        <StatsGrid cols={5}>
          <StatCard label="Tổng key" value={meta.total} change={8} changeLabel="so với tháng trước" icon="key" color="blue" />
          <StatCard label="Hoạt động" value={keys.filter(k => k.status === "Hoạt động").length} change={5} changeLabel="so với tháng trước" icon="key" color="green" />
          <StatCard label="Sắp hết hạn" value={keys.filter(k => k.status === "Sắp hết hạn").length} changeLabel="so với tháng trước" icon="alert" color="amber" />
          <StatCard label="Đã hết hạn" value={keys.filter(k => k.status === "Đã hết hạn").length} change={-2} changeLabel="so với tháng trước" icon="key" color="rose" />
          <StatCard label="Bị khóa" value={keys.filter(k => k.status === "Bị khóa").length} changeLabel="so với tháng trước" icon="key" color="purple" />
        </StatsGrid>
        {apiError && (
          <div style={{ textAlign: "center", padding: 16, color: "#ef4444", fontSize: 12 }}>{apiError}</div>
        )}

        {/* Toolbar + Tabs */}
        <div className="glass-card" style={{ padding: 16 }}>
          <div className="toolbar">
            <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
              <Search size={13} className="search-icon" />
              <input className="admin-input" placeholder="Tìm key, sản phẩm, khách hàng..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <div style={{ position: "relative" }}>
              <button ref={filterBtnRef} onClick={handleToggleFilter} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "1px solid", borderColor: showFilter || activeFilterCount > 0 ? "rgba(59,130,246,0.6)" : "rgba(30,42,80,0.8)", background: showFilter || activeFilterCount > 0 ? "rgba(59,130,246,0.1)" : "transparent", color: activeFilterCount > 0 ? "#60a5fa" : "#94a3b8" }}>
                <Filter size={13} /> Lọc
                {activeFilterCount > 0 && <span style={{ background: "#3b82f6", color: "#fff", borderRadius: 99, fontSize: 10, fontWeight: 700, padding: "1px 6px", lineHeight: 1.6 }}>{activeFilterCount}</span>}
              </button>
            </div>
            <Button variant="secondary" size="sm" icon={<Download size={13} />}>Excel</Button>
            <Button variant="secondary" size="sm" icon={<Zap size={13} />} onClick={() => setBulking(true)}>Tạo hàng loạt</Button>
            <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => setCreating(true)}>Thêm key</Button>
          </div>

          <div style={{ display: "flex", gap: 0, marginTop: 14, borderBottom: "1px solid rgba(30,42,80,0.6)", flexWrap: "wrap" }}>
            {KEY_TABS.map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} className={`tab-btn ${activeTab === tab ? "tab-btn-active" : "tab-btn-inactive"}`}>
                {tab}
                <span className={`tab-count ${activeTab === tab ? "tab-count-active" : "tab-count-inactive"}`}>
                  {tab === "Tất cả" ? meta.total : keys.filter(k => k.status === tab).length}
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
                <th>License Key</th><th>Sản phẩm</th><th>Khách hàng</th>
                <th>Mã đơn</th><th>Kích hoạt</th><th>Hết hạn</th>
                <th>Trạng thái</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: 40, color: "#475569" }}>
                  <span style={{ display: "inline-block", width: 20, height: 20, border: "2px solid #334155", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                </td></tr>
              ) : pageItems.map(k => (
                <tr key={k.id} onClick={() => setViewing(k)} style={{ cursor: "pointer" }}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontFamily: "monospace", fontSize: 12, color: STATUS_COLORS[k.status].color, fontWeight: 600 }}>{maskKey(k.key)}</span>
                      <button onClick={e => handleCopyInline(k.key, k.id, e)} style={{ width: 24, height: 24, borderRadius: 5, border: "none", background: "transparent", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                        {copiedId === k.id ? <span style={{ color: "#34d399", fontSize: 10 }}>✓</span> : <Copy size={11} />}
                      </button>
                    </div>
                  </td>
                  <td><span style={{ fontSize: 12, color: "#94a3b8" }}>{k.productName}</span></td>
                  <td>
                    {k.customerName
                      ? <div><div style={{ fontSize: 12, color: "#cbd5e1" }}>{k.customerName}</div><div style={{ fontSize: 10, color: "#475569" }}>#{k.customerId}</div></div>
                      : <span style={{ fontSize: 11, color: "#334155" }}>—</span>}
                  </td>
                  <td>
                    {k.orderId ? <span style={{ fontFamily: "monospace", color: "#60a5fa", fontSize: 11 }}>#{k.orderId}</span> : <span style={{ fontSize: 11, color: "#334155" }}>—</span>}
                  </td>
                  <td><span style={{ fontSize: 11, color: "#475569" }}>{k.activatedAt ? formatDate(k.activatedAt) : "—"}</span></td>
                  <td>
                    <span style={{ fontSize: 11, color: k.status === "Sắp hết hạn" ? "#f59e0b" : k.status === "Đã hết hạn" ? "#ef4444" : "#475569" }}>
                      {k.expiresAt ? formatDate(k.expiresAt) : "—"}
                    </span>
                  </td>
                  <td><KeyStatusBadge status={k.status} /></td>
                  <td onClick={e => e.stopPropagation()}>
                    <ActionButtons
                      onView={() => setViewing(k)}
                      onEdit={() => setEditing(k)}
                      onDelete={() => setDeleting(k)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && keys.length === 0 && (
            <div className="empty-state">
              <KeyRound size={36} style={{ color: "#1e3a5f" }} />
              <div style={{ color: "#475569", fontSize: 13 }}>Không tìm thấy key nào</div>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "#475569" }}>
            {meta.total === 0 ? "0" : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, meta.total)}`} / {meta.total} keys
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
      {creating && (
        <CreateKeyModal
          products={products}
          onCreate={async body => {
            try {
              await keysApi.create(body);
              setPage(1);
              await fetchData();
            } catch (err) {
              setApiError(err instanceof Error ? err.message : "Có lỗi xảy ra");
            }
          }}
          onClose={() => setCreating(false)}
        />
      )}
      {bulking && (
        <BulkGenerateModal
          products={products}
          onCreate={async body => {
            try {
              await keysApi.createBulk(body);
              setPage(1);
              await fetchData();
            } catch (err) {
              setApiError(err instanceof Error ? err.message : "Có lỗi xảy ra");
            }
          }}
          onClose={() => setBulking(false)}
        />
      )}
      {viewing && (
        <KeyDetailModal
          licKey={viewing} onClose={() => setViewing(null)}
          onEdit={() => { setEditing(viewing); setViewing(null); }}
          onToggleLock={() => handleToggleLock(viewing)}
        />
      )}
      {editing && <KeyEditModal licKey={editing} onSave={handleSaveEdit} onClose={() => setEditing(null)} />}
      {deleting && <DeleteModal licKey={deleting} onConfirm={() => handleDelete(deleting.id)} onClose={() => setDeleting(null)} />}
    </AdminLayout>
  );
}
