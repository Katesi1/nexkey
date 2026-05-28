"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard, StatsGrid } from "@/components/ui/StatCard";
import { StockStatusBadge } from "@/components/ui/Badge";
import { Button, ActionButtons } from "@/components/ui/Button";
import { warehouseItems as initialItems } from "@/lib/mock-data";
import { formatVND } from "@/lib/utils";
import type { WarehouseItem, StockStatus } from "@/lib/types";
import {
  Search, Filter, Download, Plus, X,
  Package, DollarSign, Warehouse, TrendingDown,
  TrendingUp, ChevronLeft, ChevronRight, ArrowDown, ArrowUp,
} from "lucide-react";

/* ─── Constants ──────────────────────────────────────────────── */
const WAREHOUSES  = ["Tất cả", "Kho chính", "Kho chi nhánh", "Kho đối tác"] as const;
const WAREHOUSE_LIST = ["Kho chính", "Kho chi nhánh", "Kho đối tác"];
const PAGE_SIZE   = 5;
const STOCK_STATUSES: StockStatus[] = ["Còn hàng", "Sắp hết", "Hết hàng", "Đang nhập"];

type Filters = { statuses: StockStatus[] };
const DEFAULT_FILTERS: Filters = { statuses: [] };

const stockColor = (qty: number) =>
  qty === 0 ? "#ef4444" : qty < 20 ? "#f59e0b" : "#34d399";

const autoStatus = (qty: number): StockStatus =>
  qty === 0 ? "Hết hàng" : qty < 20 ? "Sắp hết" : "Còn hàng";

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

/* ─── Warehouse Detail Modal ─────────────────────────────────── */
function WarehouseDetailModal({ item, onClose, onImport, onExport }: {
  item: WarehouseItem; onClose: () => void;
  onImport: () => void; onExport: () => void;
}) {
  const color = stockColor(item.quantity);
  const pct   = Math.min((item.quantity / 200) * 100, 100);

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 480, maxWidth: "92vw", maxHeight: "90vh", background: "#080d1c", border: "1px solid rgba(30,42,80,0.7)", borderRadius: 18, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,${color},transparent)`, flexShrink: 0 }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid rgba(30,42,80,0.6)", flexShrink: 0, background: "rgba(255,255,255,0.015)" }}>
          <div>
            <div style={{ fontSize: 11, color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Chi tiết kho hàng</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9", lineHeight: 1.3 }}>{item.productName}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
              <span style={{ fontFamily: "monospace", fontSize: 11, color: "#3b82f6" }}>{item.sku}</span>
              <StockStatusBadge status={item.status} />
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><X size={15} /></button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Quantity big card */}
          <div style={{ background: `rgba(${item.quantity === 0 ? "239,68,68" : item.quantity < 20 ? "245,158,11" : "16,185,129"},0.07)`, border: `1px solid rgba(${item.quantity === 0 ? "239,68,68" : item.quantity < 20 ? "245,158,11" : "16,185,129"},0.2)`, borderRadius: 14, padding: "20px 22px" }}>
            <SectionLabel icon={<Warehouse size={12} />}>Tồn kho</SectionLabel>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 52, fontWeight: 900, color, lineHeight: 1 }}>{item.quantity}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{item.unit} · {item.warehouse}</div>
              </div>
              <div style={{ width: 60, height: 60, borderRadius: 14, background: `${color}18`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Package size={24} style={{ color }} />
              </div>
            </div>
            <div style={{ height: 8, background: "rgba(30,42,80,0.8)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width 0.4s", boxShadow: `0 0 8px ${color}60` }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 10, color: "#334155" }}>0</span>
              <span style={{ fontSize: 10, color: "#334155" }}>200</span>
            </div>
          </div>

          {/* Value */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<DollarSign size={12} />}>Giá trị</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>Giá nhập / đơn vị</span>
                <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>{formatVND(item.costPrice)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid rgba(30,42,80,0.5)" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Tổng giá trị tồn</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: "#60a5fa" }}>{formatVND(item.inventoryValue)}</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "14px 18px", border: "1px solid rgba(30,42,80,0.5)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Warehouse size={14} style={{ color: "#60a5fa" }} />
              <span style={{ fontSize: 12, color: "#64748b" }}>Vị trí kho</span>
            </div>
            <span style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)", padding: "3px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{item.warehouse}</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 22px", borderTop: "1px solid rgba(30,42,80,0.6)", display: "flex", gap: 10, flexShrink: 0, background: "rgba(255,255,255,0.015)" }}>
          <Button variant="primary" size="sm" icon={<ArrowDown size={12} />} style={{ flex: 1 }} onClick={onImport}>Nhập thêm</Button>
          <Button variant="secondary" size="sm" icon={<ArrowUp size={12} />} style={{ flex: 1 }} onClick={onExport}>Xuất kho</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Adjust Qty Modal (import or export) ────────────────────── */
function AdjustQtyModal({ item, mode, onSave, onClose }: {
  item: WarehouseItem;
  mode: "import" | "export";
  onSave: (id: string, delta: number, costPrice?: number) => void;
  onClose: () => void;
}) {
  const [qty, setQty]       = useState("1");
  const [cost, setCost]     = useState(item.costPrice.toLocaleString("vi-VN"));
  const isImport = mode === "import";
  const delta    = Number(qty) || 0;
  const newQty   = Math.max(0, isImport ? item.quantity + delta : item.quantity - delta);

  const fmtCost = (v: string) => {
    const d = v.replace(/\D/g, "");
    return d ? Number(d).toLocaleString("vi-VN") : "";
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, background: "#060a15", border: "1px solid rgba(30,42,80,0.9)", color: "#e2e8f0", outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 400, maxWidth: "92vw", background: "#0d1226", border: `1px solid ${isImport ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div style={{ height: 3, background: isImport ? "linear-gradient(90deg,#10b981,transparent)" : "linear-gradient(90deg,#f59e0b,transparent)" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(30,42,80,0.7)" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{isImport ? "Nhập kho" : "Xuất kho"}</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{item.productName}</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Current qty */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(30,42,80,0.5)" }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>Tồn kho hiện tại</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: stockColor(item.quantity) }}>{item.quantity} {item.unit}</span>
          </div>
          <div>
            <label style={labelStyle}>Số lượng {isImport ? "nhập" : "xuất"}</label>
            <input type="text" inputMode="numeric" style={inputStyle} value={qty} onChange={e => setQty(e.target.value.replace(/\D/g, "") || "0")} />
          </div>
          {isImport && (
            <div>
              <label style={labelStyle}>Giá nhập / đơn vị (đ)</label>
              <input type="text" inputMode="numeric" style={inputStyle} value={cost} onChange={e => setCost(fmtCost(e.target.value))} />
            </div>
          )}
          {/* Preview */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 10, background: `rgba(${isImport ? "16,185,129" : "245,158,11"},0.06)`, border: `1px solid rgba(${isImport ? "16,185,129" : "245,158,11"},0.2)` }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>Tồn kho sau khi {isImport ? "nhập" : "xuất"}</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: stockColor(newQty) }}>{newQty} {item.unit}</span>
          </div>
        </div>
        <div style={{ padding: "0 20px 20px", display: "flex", gap: 10 }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant={isImport ? "primary" : "secondary"} size="sm" style={{ flex: 1 }} onClick={() => {
            onSave(item.id, isImport ? delta : -delta, isImport ? Number(cost.replace(/\./g, "")) : undefined);
            onClose();
          }}>
            Xác nhận {isImport ? "nhập" : "xuất"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Import New Stock Modal ─────────────────────────────────── */
function ImportNewModal({ onCreate, onClose }: { onCreate: (item: WarehouseItem) => void; onClose: () => void }) {
  const [productName, setProductName] = useState("");
  const [sku, setSku]                 = useState("");
  const [warehouse, setWarehouse]     = useState("Kho chính");
  const [quantity, setQuantity]       = useState("0");
  const [costPrice, setCostPrice]     = useState("");
  const [errors, setErrors]           = useState<Record<string, string>>({});

  const fmtCost = (v: string) => {
    const d = v.replace(/\D/g, "");
    return d ? Number(d).toLocaleString("vi-VN") : "";
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!productName.trim()) e.productName = "Bắt buộc";
    if (!sku.trim()) e.sku = "Bắt buộc";
    if (!costPrice) e.costPrice = "Bắt buộc";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const qty  = Number(quantity) || 0;
    const cost = Number(costPrice.replace(/\./g, "")) || 0;
    onCreate({
      id: `w-${Date.now()}`,
      productId: `p-new-${Date.now()}`,
      productName: productName.trim(),
      sku: sku.trim().toUpperCase(),
      warehouse,
      quantity: qty,
      unit: "Key",
      costPrice: cost,
      inventoryValue: cost * qty,
      status: autoStatus(qty),
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, background: "#060a15", border: "1px solid rgba(30,42,80,0.9)", color: "#e2e8f0", outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 500, maxWidth: "94vw", maxHeight: "90vh", background: "#080d1c", border: "1px solid rgba(30,42,80,0.7)", borderRadius: 18, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg,#10b981,#3b82f6)", flexShrink: 0 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid rgba(30,42,80,0.6)", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>Nhập kho mới</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 3 }}>Thêm sản phẩm mới vào kho hàng</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>

          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<Package size={12} />}>Thông tin sản phẩm</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={labelStyle}>Tên sản phẩm <span style={{ color: "#ef4444" }}>*</span></label>
                <input style={{ ...inputStyle, borderColor: errors.productName ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={productName} onChange={e => setProductName(e.target.value)} placeholder="Windows 11 Pro" />
                {errors.productName && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.productName}</span>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>SKU <span style={{ color: "#ef4444" }}>*</span></label>
                  <input style={{ ...inputStyle, fontFamily: "monospace", borderColor: errors.sku ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={sku} onChange={e => setSku(e.target.value)} placeholder="WIN11PRO" />
                  {errors.sku && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.sku}</span>}
                </div>
                <div>
                  <label style={labelStyle}>Kho chứa</label>
                  <select style={{ ...inputStyle, cursor: "pointer" }} value={warehouse} onChange={e => setWarehouse(e.target.value)}>
                    {WAREHOUSE_LIST.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<DollarSign size={12} />}>Số lượng & Giá</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Số lượng nhập</label>
                <input type="text" inputMode="numeric" style={inputStyle} value={quantity} onChange={e => setQuantity(e.target.value.replace(/\D/g, "") || "0")} />
              </div>
              <div>
                <label style={labelStyle}>Giá nhập / đơn vị (đ) <span style={{ color: "#ef4444" }}>*</span></label>
                <input type="text" inputMode="numeric" style={{ ...inputStyle, borderColor: errors.costPrice ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={costPrice} onChange={e => setCostPrice(fmtCost(e.target.value))} placeholder="0" />
                {errors.costPrice && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.costPrice}</span>}
              </div>
            </div>
            {costPrice && quantity && (
              <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>Tổng giá trị nhập</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#60a5fa" }}>
                  {formatVND(Number(costPrice.replace(/\./g, "")) * (Number(quantity) || 0))}
                </span>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: "14px 22px", borderTop: "1px solid rgba(30,42,80,0.6)", display: "flex", gap: 10, flexShrink: 0, background: "rgba(255,255,255,0.015)" }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} icon={<ArrowDown size={13} />} style={{ flex: 2 }}>Nhập kho</Button>
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
  const toggle = (s: StockStatus) => {
    const next = filters.statuses.includes(s) ? filters.statuses.filter(x => x !== s) : [...filters.statuses, s];
    onChange({ ...filters, statuses: next });
  };
  return (
    <div style={{ position: "fixed", top, right, zIndex: 500, background: "#0a0e1a", border: "1px solid rgba(30,42,80,0.9)", borderRadius: 12, padding: 16, minWidth: 200, boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Trạng thái tồn kho</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
        {STOCK_STATUSES.map(s => (
          <label key={s} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={filters.statuses.includes(s)} onChange={() => toggle(s)} style={{ accentColor: "#3b82f6", width: 14, height: 14, cursor: "pointer" }} />
            <span style={{ fontSize: 12, color: "#cbd5e1" }}>{s}</span>
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
export default function WarehousePage() {
  const [items, setItems]         = useState([...initialItems]);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [search, setSearch]       = useState("");
  const [page, setPage]           = useState(1);
  const [viewing, setViewing]     = useState<WarehouseItem | null>(null);
  const [adjusting, setAdjusting] = useState<{ item: WarehouseItem; mode: "import" | "export" } | null>(null);
  const [importing, setImporting] = useState(false);
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

  const activeFilterCount = filters.statuses.length;

  const filtered = items.filter(item => {
    const tabOk    = activeTab === "Tất cả" || item.warehouse === activeTab;
    const searchOk = !search || [item.productName, item.sku].some(s => s.toLowerCase().includes(search.toLowerCase()));
    const statusOk = filters.statuses.length === 0 || filters.statuses.includes(item.status);
    return tabOk && searchOk && statusOk;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const count      = (w: string) => w === "Tất cả" ? items.length : items.filter(i => i.warehouse === w).length;
  const totalValue = items.reduce((s, i) => s + i.inventoryValue, 0);
  const totalQty   = items.reduce((s, i) => s + i.quantity, 0);
  const lowStock   = items.filter(i => i.status === "Sắp hết").length;
  const outOfStock = items.filter(i => i.status === "Hết hàng").length;

  const handleAdjust = useCallback((id: string, delta: number, costPrice?: number) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const newQty = Math.max(0, item.quantity + delta);
      const newCost = costPrice ?? item.costPrice;
      return { ...item, quantity: newQty, costPrice: newCost, inventoryValue: newCost * newQty, status: autoStatus(newQty), updatedAt: new Date().toISOString() };
    }));
    setViewing(prev => {
      if (!prev || prev.id !== id) return prev;
      const newQty = Math.max(0, prev.quantity + delta);
      const newCost = costPrice ?? prev.costPrice;
      return { ...prev, quantity: newQty, costPrice: newCost, inventoryValue: newCost * newQty, status: autoStatus(newQty) };
    });
  }, []);

  return (
    <AdminLayout title="Kho hàng" subtitle="Quản lý tồn kho">
      <div className="page-content">

        <StatsGrid cols={5}>
          <StatCard label="Giá trị tồn kho" value={totalValue} isCurrency change={3.2} changeLabel="so với tháng trước" icon="money" color="blue" />
          <StatCard label="Tổng tồn kho" value={totalQty} suffix=" key" change={5} changeLabel="so với tháng trước" icon="warehouse" color="green" />
          <StatCard label="Sắp hết hàng" value={lowStock} change={-1} changeLabel="so với tháng trước" icon="alert" color="amber" />
          <StatCard label="Hết hàng" value={outOfStock} change={2} changeLabel="so với tháng trước" icon="alert" color="rose" />
          <StatCard label="Đang nhập" value={items.filter(i => i.status === "Đang nhập").length} changeLabel="so với tháng trước" icon="warehouse" color="cyan" />
        </StatsGrid>

        {/* Toolbar + Tabs */}
        <div className="glass-card" style={{ padding: 16 }}>
          <div className="toolbar">
            <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
              <Search size={13} className="search-icon" />
              <input className="admin-input" placeholder="Tìm sản phẩm, SKU..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <div style={{ position: "relative" }}>
              <button ref={filterBtnRef} onClick={handleToggleFilter} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "1px solid", borderColor: showFilter || activeFilterCount > 0 ? "rgba(59,130,246,0.6)" : "rgba(30,42,80,0.8)", background: showFilter || activeFilterCount > 0 ? "rgba(59,130,246,0.1)" : "transparent", color: activeFilterCount > 0 ? "#60a5fa" : "#94a3b8" }}>
                <Filter size={13} /> Lọc
                {activeFilterCount > 0 && <span style={{ background: "#3b82f6", color: "#fff", borderRadius: 99, fontSize: 10, fontWeight: 700, padding: "1px 6px", lineHeight: 1.6 }}>{activeFilterCount}</span>}
              </button>
            </div>
            <Button variant="secondary" size="sm" icon={<Download size={13} />}>Excel</Button>
            <Button variant="primary" size="sm" icon={<ArrowDown size={13} />} onClick={() => setImporting(true)}>Nhập kho</Button>
          </div>

          <div style={{ display: "flex", gap: 0, marginTop: 14, borderBottom: "1px solid rgba(30,42,80,0.6)" }}>
            {WAREHOUSES.map(wh => (
              <button key={wh} onClick={() => { setActiveTab(wh); setPage(1); }} className={`tab-btn ${activeTab === wh ? "tab-btn-active" : "tab-btn-inactive"}`}>
                {wh}
                <span className={`tab-count ${activeTab === wh ? "tab-count-active" : "tab-count-inactive"}`}>{count(wh)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="glass-card" style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sản phẩm</th><th>SKU</th><th>Kho</th><th>Số lượng</th>
                <th>Đơn vị</th><th>Giá nhập</th><th>Giá trị tồn</th><th>Trạng thái</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map(item => (
                <tr key={item.id} onClick={() => setViewing(item)} style={{ cursor: "pointer" }}>
                  <td><div style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0" }}>{item.productName}</div></td>
                  <td><span style={{ fontFamily: "monospace", color: "#64748b", fontSize: 11 }}>{item.sku}</span></td>
                  <td>
                    <span style={{ padding: "2px 8px", borderRadius: 99, fontSize: 10, fontWeight: 600, background: "rgba(59,130,246,0.08)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }}>
                      {item.warehouse}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 46, height: 4, background: "rgba(30,42,80,0.8)", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.min((item.quantity / 200) * 100, 100)}%`, background: stockColor(item.quantity), borderRadius: 99 }} />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 14, color: stockColor(item.quantity) }}>{item.quantity}</span>
                    </div>
                  </td>
                  <td><span style={{ fontSize: 12, color: "#64748b" }}>{item.unit}</span></td>
                  <td><span style={{ fontSize: 12, color: "#94a3b8" }}>{formatVND(item.costPrice)}</span></td>
                  <td><span style={{ fontWeight: 700, color: "#60a5fa", fontSize: 13 }}>{formatVND(item.inventoryValue)}</span></td>
                  <td><StockStatusBadge status={item.status} /></td>
                  <td onClick={e => e.stopPropagation()}>
                    <ActionButtons
                      onView={() => setViewing(item)}
                      onEdit={() => setAdjusting({ item, mode: "import" })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state">
              <span style={{ fontSize: 36 }}>📦</span>
              <div style={{ color: "#475569", fontSize: 13 }}>Không có dữ liệu kho</div>
            </div>
          )}
        </div>

        {/* Pagination + total */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "#475569" }}>
            {filtered.length === 0 ? "0" : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)}`} / {filtered.length} mục ·{" "}
            Tổng giá trị: <span style={{ color: "#60a5fa", fontWeight: 700 }}>{formatVND(totalValue)}</span>
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
      {importing && <ImportNewModal onCreate={item => { setItems(prev => [item, ...prev]); setPage(1); }} onClose={() => setImporting(false)} />}
      {viewing && (
        <WarehouseDetailModal
          item={viewing} onClose={() => setViewing(null)}
          onImport={() => { setAdjusting({ item: viewing, mode: "import" }); setViewing(null); }}
          onExport={() => { setAdjusting({ item: viewing, mode: "export" }); setViewing(null); }}
        />
      )}
      {adjusting && (
        <AdjustQtyModal
          item={adjusting.item} mode={adjusting.mode}
          onSave={handleAdjust}
          onClose={() => setAdjusting(null)}
        />
      )}
    </AdminLayout>
  );
}
