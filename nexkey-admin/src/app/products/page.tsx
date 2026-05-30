"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard, StatsGrid } from "@/components/ui/StatCard";
import { ProductStatusBadge } from "@/components/ui/Badge";
import { Button, ActionButtons } from "@/components/ui/Button";
import { productsApi, categoriesApi } from "@/lib/api";
import { formatVND } from "@/lib/utils";
import type { Product, Category } from "@/lib/types";
import {
  ProductStatus, ProductType,
  PRODUCT_STATUS_LABEL, PRODUCT_TYPE_LABEL,
} from "@/lib/types";
import {
  Search, Filter, Plus, Download, X,
  Package, DollarSign, BarChart2, Tag,
  ChevronLeft, ChevronRight,
} from "lucide-react";

/* ─── Constants ──────────────────────────────────────────────── */
const TABS = ["Tất cả", "Đang bán", "Hết hàng", "Tạm ngưng"] as const;
const PAGE_SIZE = 10;
const PRODUCT_TYPES: ProductType[] = [
  ProductType.WindowsKey, ProductType.OfficeKey, ProductType.Subscription,
  ProductType.Account, ProductType.Antivirus,
];
const STATUS_OPTIONS: ProductStatus[] = [
  ProductStatus.DangBan, ProductStatus.HetHang, ProductStatus.TamNgung, ProductStatus.Nhap,
];
const TYPE_ICONS: Record<number, string> = {
  [ProductType.WindowsKey]:   "🪟",
  [ProductType.OfficeKey]:    "📊",
  [ProductType.Subscription]: "🔄",
  [ProductType.Account]:      "👤",
  [ProductType.Antivirus]:    "🛡️",
};
const STATUS_COLORS: Record<number, { color: string; bg: string; glow: string }> = {
  [ProductStatus.DangBan]:  { color: "#10b981", bg: "rgba(16,185,129,0.12)", glow: "rgba(16,185,129,0.25)" },
  [ProductStatus.HetHang]:  { color: "#ef4444", bg: "rgba(239,68,68,0.12)",  glow: "rgba(239,68,68,0.25)" },
  [ProductStatus.TamNgung]: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", glow: "rgba(245,158,11,0.25)" },
  [ProductStatus.Nhap]:     { color: "#64748b", bg: "rgba(100,116,139,0.12)", glow: "rgba(100,116,139,0.2)" },
};

const TAB_TO_STATUS: Partial<Record<string, ProductStatus>> = {
  "Đang bán":  ProductStatus.DangBan,
  "Hết hàng":  ProductStatus.HetHang,
  "Tạm ngưng": ProductStatus.TamNgung,
};

type Filters = { types: ProductType[] };
const DEFAULT_FILTERS: Filters = { types: [] };

/* ─── Modal wrapper ──────────────────────────────────────────── */
function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onCloseRef.current(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);
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

/* ─── Product Detail Modal ───────────────────────────────────── */
function ProductDetailModal({ product, onClose, onEdit }: { product: Product; onClose: () => void; onEdit: () => void }) {
  const sc = STATUS_COLORS[product.status] ?? STATUS_COLORS[ProductStatus.TamNgung];
  const stockColor = product.stock === 0 ? "#ef4444" : product.stock < 20 ? "#f59e0b" : "#34d399";

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 520, maxWidth: "92vw", maxHeight: "90vh", background: "#080d1c", border: "1px solid rgba(30,42,80,0.7)", borderRadius: 18, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,${sc.color},transparent)`, flexShrink: 0 }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid rgba(30,42,80,0.6)", flexShrink: 0, background: "rgba(255,255,255,0.015)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(30,42,80,0.8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
              {TYPE_ICONS[product.type] ?? "📦"}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9", lineHeight: 1.3 }}>{product.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                <span style={{ fontFamily: "monospace", fontSize: 11, color: "#475569" }}>{product.sku}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 99, background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 700, boxShadow: `0 0 10px ${sc.glow}` }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.color, display: "inline-block" }} />
                  {PRODUCT_STATUS_LABEL[product.status]}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Pricing */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<DollarSign size={12} />}>Giá bán</SectionLabel>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: "#34d399", letterSpacing: "-0.5px" }}>{formatVND(product.price)}</span>
              {product.comparePrice && (
                <span style={{ fontSize: 14, color: "#475569", textDecoration: "line-through", paddingBottom: 3 }}>{formatVND(product.comparePrice)}</span>
              )}
            </div>
          </div>

          {/* Inventory */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<Package size={12} />}>Tồn kho</SectionLabel>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: "#64748b" }}>Số lượng hiện có</span>
              <span style={{ fontSize: 30, fontWeight: 800, color: stockColor }}>{product.stock}</span>
            </div>
            <div style={{ height: 6, background: "rgba(30,42,80,0.8)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min((product.stock / 200) * 100, 100)}%`, background: stockColor, borderRadius: 99, transition: "width 0.4s" }} />
            </div>
            <div style={{ fontSize: 10, color: "#334155", marginTop: 6 }}>
              {product.stock === 0 ? "Hết hàng" : product.stock < 20 ? "⚠ Sắp hết hàng" : "Còn hàng tốt"}
            </div>
          </div>

          {/* Stats + Info */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<BarChart2 size={12} />}>Thông tin & Thống kê</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Đã bán", value: product.sold.toLocaleString("vi-VN") + " sản phẩm", color: "#e2e8f0" },
                { label: "Danh mục", value: product.categoryName, color: "#cbd5e1" },
                { label: "Loại", value: PRODUCT_TYPE_LABEL[product.type], color: "#a78bfa", badge: true },
                { label: "Doanh thu ước tính", value: formatVND(product.price * product.sold), color: "#34d399" },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>{row.label}</span>
                  {row.badge
                    ? <span style={{ background: "rgba(139,92,246,0.12)", color: "#a78bfa", padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600 }}>{row.value}</span>
                    : <span style={{ fontSize: 13, fontWeight: 600, color: row.color }}>{row.value}</span>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<Tag size={12} />}>Tags</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["Digital", "License", "Kỹ thuật số"].map(tag => (
                <span key={tag} style={{ background: "rgba(59,130,246,0.08)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)", padding: "3px 10px", borderRadius: 99, fontSize: 11 }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 22px", borderTop: "1px solid rgba(30,42,80,0.6)", display: "flex", gap: 10, flexShrink: 0, background: "rgba(255,255,255,0.015)" }}>
          <Button variant="primary" size="sm" style={{ flex: 1 }} onClick={onEdit}>Chỉnh sửa</Button>
          <Button variant="danger" size="sm" style={{ flex: 1 }}>Xóa</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Product Edit Modal ─────────────────────────────────────── */
function ProductEditModal({ product, onSave, onClose }: {
  product: Product;
  onSave: (id: string, data: Partial<Product>) => void;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<ProductStatus>(product.status);
  const [price, setPrice]   = useState(product.price.toLocaleString("vi-VN"));
  const [stock, setStock]   = useState(String(product.stock));

  const fmtPrice = (v: string) => {
    const d = v.replace(/\D/g, "");
    if (!d) return "";
    return Math.min(Number(d), 10_000_000).toLocaleString("vi-VN");
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, background: "#060a15", border: "1px solid rgba(30,42,80,0.9)", color: "#e2e8f0", outline: "none", boxSizing: "border-box" };

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 420, maxWidth: "92vw", background: "#0d1226", border: "1px solid rgba(30,42,80,0.8)", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg,#2563eb,#7c3aed)" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(30,42,80,0.7)" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Chỉnh sửa sản phẩm</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{product.name}</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { label: "Trạng thái", el: <select style={{ ...inputStyle, cursor: "pointer" }} value={status} onChange={e => setStatus(Number(e.target.value) as ProductStatus)}>{STATUS_OPTIONS.map(s => <option key={s} value={s}>{PRODUCT_STATUS_LABEL[s]}</option>)}</select> },
            { label: "Giá bán (đ)", el: <input style={inputStyle} value={price} onChange={e => setPrice(fmtPrice(e.target.value))} placeholder="0" /> },
            { label: "Tồn kho", el: <input style={inputStyle} type="text" inputMode="numeric" value={stock} onChange={e => setStock(e.target.value.replace(/\D/g, ""))} placeholder="0" /> },
          ].map(({ label, el }) => (
            <div key={label}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{label}</label>
              {el}
            </div>
          ))}
        </div>
        <div style={{ padding: "0 20px 20px", display: "flex", gap: 10 }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant="primary" size="sm" style={{ flex: 1 }} onClick={() => {
            onSave(product.id, {
              status,
              price: Number(price.replace(/\./g, "")),
              stock: Number(stock) || 0,
            });
            onClose();
          }}>Lưu thay đổi</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Delete Confirm Modal ───────────────────────────────────── */
function DeleteModal({ product, onConfirm, onClose }: { product: Product; onConfirm: () => void; onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div style={{ width: 360, maxWidth: "90vw", background: "#0d1226", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div style={{ padding: "24px 24px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>Xóa sản phẩm?</div>
          <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
            Sản phẩm <strong style={{ color: "#cbd5e1" }}>{product.name}</strong> sẽ bị xóa vĩnh viễn.
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

/* ─── Create Product Modal ───────────────────────────────────── */
function CreateProductModal({ categories, onCreate, onClose }: {
  categories: Category[];
  onCreate: () => void;
  onClose: () => void;
}) {
  const [name, setName]             = useState("");
  const [sku, setSku]               = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [type, setType]             = useState<ProductType>(ProductType.WindowsKey);
  const [price, setPrice]           = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [stock, setStock]           = useState("0");
  const [status, setStatus]         = useState<ProductStatus>(ProductStatus.DangBan);
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const fmtPrice = (v: string) => {
    const d = v.replace(/\D/g, "");
    if (!d) return "";
    return Math.min(Number(d), 10_000_000).toLocaleString("vi-VN");
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Bắt buộc";
    if (!sku.trim()) e.sku = "Bắt buộc";
    if (!price) e.price = "Bắt buộc";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    try {
      await productsApi.create({
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        categoryId,
        type,
        price: Number(price.replace(/\./g, "")),
        comparePrice: comparePrice ? Number(comparePrice.replace(/\./g, "")) : undefined,
        stock: Number(stock) || 0,
        status,
      });
      onCreate();
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi tạo sản phẩm");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, background: "#060a15", border: "1px solid rgba(30,42,80,0.9)", color: "#e2e8f0", outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 560, maxWidth: "94vw", maxHeight: "90vh", background: "#080d1c", border: "1px solid rgba(30,42,80,0.7)", borderRadius: 18, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg,#2563eb,#7c3aed)", flexShrink: 0 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid rgba(30,42,80,0.6)", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>Thêm sản phẩm mới</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 3 }}>Điền đầy đủ thông tin sản phẩm</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Basic info */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<Package size={12} />}>Thông tin cơ bản</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={labelStyle}>Tên sản phẩm <span style={{ color: "#ef4444" }}>*</span></label>
                <input style={{ ...inputStyle, borderColor: errors.name ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={name} onChange={e => setName(e.target.value)} placeholder="Windows 11 Pro" />
                {errors.name && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.name}</span>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>SKU <span style={{ color: "#ef4444" }}>*</span></label>
                  <input style={{ ...inputStyle, borderColor: errors.sku ? "#ef4444" : "rgba(30,42,80,0.9)", fontFamily: "monospace" }} value={sku} onChange={e => setSku(e.target.value)} placeholder="WIN11PRO" />
                  {errors.sku && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.sku}</span>}
                </div>
                <div>
                  <label style={labelStyle}>Loại sản phẩm</label>
                  <select style={{ ...inputStyle, cursor: "pointer" }} value={type} onChange={e => setType(Number(e.target.value) as ProductType)}>
                    {PRODUCT_TYPES.map(t => <option key={t} value={t}>{TYPE_ICONS[t]} {PRODUCT_TYPE_LABEL[t]}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Danh mục</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<DollarSign size={12} />}>Giá & Tồn kho</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Giá bán (đ) <span style={{ color: "#ef4444" }}>*</span></label>
                <input style={{ ...inputStyle, borderColor: errors.price ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={price} onChange={e => setPrice(fmtPrice(e.target.value))} placeholder="0" />
                {errors.price && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.price}</span>}
              </div>
              <div>
                <label style={labelStyle}>Giá gốc (đ)</label>
                <input style={inputStyle} value={comparePrice} onChange={e => setComparePrice(fmtPrice(e.target.value))} placeholder="Không bắt buộc" />
              </div>
              <div>
                <label style={labelStyle}>Tồn kho</label>
                <input style={inputStyle} type="text" inputMode="numeric" value={stock} onChange={e => setStock(e.target.value.replace(/\D/g, ""))} placeholder="0" />
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={labelStyle}>Trạng thái</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={status} onChange={e => setStatus(Number(e.target.value) as ProductStatus)}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{PRODUCT_STATUS_LABEL[s]}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div style={{ padding: "14px 22px", borderTop: "1px solid rgba(30,42,80,0.6)", display: "flex", gap: 10, flexShrink: 0, background: "rgba(255,255,255,0.015)" }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} icon={<Plus size={13} />} style={{ flex: 2 }} disabled={submitting}>
            {submitting ? "Đang thêm..." : "Thêm sản phẩm"}
          </Button>
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
  const toggle = (type: ProductType) => {
    const next = filters.types.includes(type) ? filters.types.filter(t => t !== type) : [...filters.types, type];
    onChange({ ...filters, types: next });
  };
  return (
    <div style={{ position: "fixed", top, right, zIndex: 500, background: "#0a0e1a", border: "1px solid rgba(30,42,80,0.9)", borderRadius: 12, padding: 16, minWidth: 220, boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Loại sản phẩm</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
        {PRODUCT_TYPES.map(t => (
          <label key={t} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={filters.types.includes(t)} onChange={() => toggle(t)} style={{ accentColor: "#3b82f6", width: 14, height: 14, cursor: "pointer" }} />
            <span style={{ fontSize: 12, color: "#cbd5e1" }}>{TYPE_ICONS[t]} {PRODUCT_TYPE_LABEL[t]}</span>
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
export default function ProductsPage() {
  const [products, setProducts]     = useState<Product[]>([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(true);
  const [apiError, setApiError]     = useState("");
  const [categories, setCategoriesList] = useState<Category[]>([]);

  const [activeTab, setActiveTab]   = useState("Tất cả");
  const [search, setSearch]         = useState("");
  const [page, setPage]             = useState(1);
  const [viewing, setViewing]       = useState<Product | null>(null);
  const [editing, setEditing]       = useState<Product | null>(null);
  const [deleting, setDeleting]     = useState<Product | null>(null);
  const [creating, setCreating]     = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterPos, setFilterPos]   = useState({ top: 0, right: 0 });
  const [filters, setFilters]       = useState<Filters>(DEFAULT_FILTERS);
  const filterRef    = useRef<HTMLDivElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);

  /* ─── Load categories once ─────────────────────────────────── */
  useEffect(() => {
    categoriesApi.list()
      .then(setCategoriesList)
      .catch(() => { /* non-critical, silently ignore */ });
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node) && filterBtnRef.current && !filterBtnRef.current.contains(e.target as Node)) setShowFilter(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* ─── Fetch data ───────────────────────────────────────────── */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setApiError("");
    try {
      const statusParam = TAB_TO_STATUS[activeTab];
      const typeParam   = filters.types.length === 1 ? filters.types[0] : undefined;

      const result = await productsApi.list({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        status: statusParam,
        type: typeParam,
      });

      setProducts(result.data);
      setTotal(result.meta.total);
      setTotalPages(result.meta.totalPages);
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
      const r = filterBtnRef.current.getBoundingClientRect();
      setFilterPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
    }
    setShowFilter(o => !o);
  };

  const activeFilterCount = filters.types.length;

  const handleTabChange = (tab: string) => { setActiveTab(tab); setPage(1); };
  const handleSearch    = (s: string)   => { setSearch(s); setPage(1); };

  const handleSaveEdit = useCallback(async (id: string, data: Partial<Product>) => {
    try {
      await productsApi.update(id, data as Record<string, unknown>);
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi cập nhật sản phẩm");
    }
  }, [fetchData]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await productsApi.delete(id);
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi xóa sản phẩm");
    }
  }, [fetchData]);

  return (
    <AdminLayout title="Sản phẩm" subtitle="Quản lý sản phẩm">
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div className="page-content">

        <StatsGrid cols={4}>
          <StatCard label="Tổng sản phẩm" value={total} change={6.3} changeLabel="so với tháng trước" icon="package" color="blue" />
          <StatCard label="Đang bán" value={products.filter(p => p.status === ProductStatus.DangBan).length} change={4} changeLabel="so với tháng trước" icon="package" color="green" />
          <StatCard label="Hết hàng" value={products.filter(p => p.status === ProductStatus.HetHang).length} change={-1} changeLabel="so với tháng trước" icon="alert" color="rose" />
          <StatCard label="Tạm ngưng" value={products.filter(p => p.status === ProductStatus.TamNgung).length} change={0} changeLabel="so với tháng trước" icon="package" color="amber" />
        </StatsGrid>

        {/* Toolbar + Tabs */}
        <div className="glass-card" style={{ padding: 16 }}>
          <div className="toolbar">
            <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
              <Search size={13} className="search-icon" />
              <input className="admin-input" placeholder="Tìm tên, SKU, danh mục..." value={search} onChange={e => handleSearch(e.target.value)} />
            </div>
            <div style={{ position: "relative" }}>
              <button ref={filterBtnRef} onClick={handleToggleFilter} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "1px solid", borderColor: showFilter || activeFilterCount > 0 ? "rgba(59,130,246,0.6)" : "rgba(30,42,80,0.8)", background: showFilter || activeFilterCount > 0 ? "rgba(59,130,246,0.1)" : "transparent", color: activeFilterCount > 0 ? "#60a5fa" : "#94a3b8" }}>
                <Filter size={13} /> Lọc
                {activeFilterCount > 0 && <span style={{ background: "#3b82f6", color: "#fff", borderRadius: 99, fontSize: 10, fontWeight: 700, padding: "1px 6px", lineHeight: 1.6 }}>{activeFilterCount}</span>}
              </button>
            </div>
            <Button
              variant="secondary" size="sm" icon={<Download size={13} />}
              onClick={() => window.open(productsApi.exportUrl())}
            >
              Excel
            </Button>
            <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => setCreating(true)}>Thêm sản phẩm</Button>
          </div>

          <div style={{ display: "flex", gap: 0, marginTop: 14, borderBottom: "1px solid rgba(30,42,80,0.6)" }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => handleTabChange(tab)} className={`tab-btn ${activeTab === tab ? "tab-btn-active" : "tab-btn-inactive"}`}>
                {tab}
                <span className={`tab-count ${activeTab === tab ? "tab-count-active" : "tab-count-inactive"}`}>
                  {tab === "Tất cả" ? total : products.filter(p => p.status === TAB_TO_STATUS[tab]).length}
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
                <th>Sản phẩm</th><th>SKU</th><th>Danh mục</th><th>Loại</th>
                <th>Giá bán</th><th>Tồn kho</th><th>Đã bán</th><th>Trạng thái</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: 40, color: "#475569" }}>
                    <span style={{ display: "inline-block", width: 20, height: 20, border: "2px solid #334155", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  </td>
                </tr>
              ) : products.map(product => (
                <tr key={product.id} onClick={() => setViewing(product)} style={{ cursor: "pointer" }}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(30,42,80,0.8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                        {TYPE_ICONS[product.type] ?? "📦"}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0" }}>{product.name}</div>
                        {product.comparePrice && <div style={{ fontSize: 10, color: "#475569", textDecoration: "line-through" }}>{formatVND(product.comparePrice)}</div>}
                      </div>
                    </div>
                  </td>
                  <td><span style={{ fontFamily: "monospace", color: "#64748b", fontSize: 11 }}>{product.sku}</span></td>
                  <td><span style={{ fontSize: 12, color: "#94a3b8" }}>{product.categoryName}</span></td>
                  <td><span style={{ background: "rgba(139,92,246,0.1)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)", padding: "2px 8px", borderRadius: 99, fontSize: 10, fontWeight: 600 }}>{PRODUCT_TYPE_LABEL[product.type]}</span></td>
                  <td><span style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 13 }}>{formatVND(product.price)}</span></td>
                  <td><span style={{ fontWeight: 700, fontSize: 14, color: product.stock === 0 ? "#ef4444" : product.stock < 20 ? "#f59e0b" : "#34d399" }}>{product.stock}</span></td>
                  <td><span style={{ fontSize: 12, color: "#94a3b8" }}>{product.sold.toLocaleString("vi-VN")}</span></td>
                  <td><ProductStatusBadge status={product.status} /></td>
                  <td onClick={e => e.stopPropagation()}>
                    <ActionButtons
                      onView={() => setViewing(product)}
                      onEdit={() => setEditing(product)}
                      onDelete={() => setDeleting(product)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && products.length === 0 && (
            <div className="empty-state">
              <span style={{ fontSize: 36 }}>📦</span>
              <div style={{ color: "#475569", fontSize: 13 }}>Không tìm thấy sản phẩm</div>
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
            {total === 0 ? "0" : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)}`} / {total} sản phẩm
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
        <CreateProductModal
          categories={categories}
          onCreate={() => { fetchData(); setPage(1); }}
          onClose={() => setCreating(false)}
        />
      )}
      {viewing && <ProductDetailModal product={viewing} onClose={() => setViewing(null)} onEdit={() => { setEditing(viewing); setViewing(null); }} />}
      {editing && <ProductEditModal product={editing} onSave={handleSaveEdit} onClose={() => setEditing(null)} />}
      {deleting && <DeleteModal product={deleting} onConfirm={() => handleDelete(deleting.id)} onClose={() => setDeleting(null)} />}
    </AdminLayout>
  );
}
