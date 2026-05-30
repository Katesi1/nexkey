"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard, StatsGrid } from "@/components/ui/StatCard";
import { Button, ActionButtons } from "@/components/ui/Button";
import { categoriesApi } from "@/lib/api";
import { Search, Plus, X, Package, Tag, Hash, ChevronLeft, ChevronRight } from "lucide-react";
import { CategoryStatus, CATEGORY_STATUS_LABEL } from "@/lib/types";
import type { Category } from "@/lib/types";

/* ─── Constants ──────────────────────────────────────────────── */
const COLOR_PRESETS = [
  "#0078d4", "#d83b01", "#4285f4", "#ff0000",
  "#1db954", "#e50914", "#00c4cc", "#8b5cf6",
  "#10b981", "#f59e0b", "#ef4444", "#64748b",
];

const POPULAR_ICONS = ["🪟", "📊", "🔍", "▶️", "🎵", "🎬", "🎨", "📦", "🔑", "🛡️", "☁️", "💼", "🎮", "📱"];

const PAGE_SIZE = 10;

function PagBtn({ children, onClick, disabled = false, active = false }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; active?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: 30, height: 30, borderRadius: 6, fontSize: 12, fontWeight: active ? 700 : 400, cursor: disabled ? "default" : "pointer", border: "1px solid", borderColor: active ? "#3b82f6" : "rgba(30,42,80,0.8)", background: active ? "rgba(59,130,246,0.15)" : "transparent", color: disabled ? "#334155" : active ? "#60a5fa" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
      {children}
    </button>
  );
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

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

/* ─── Category Detail Modal ──────────────────────────────────── */
function CategoryDetailModal({ cat, onClose, onEdit }: { cat: Category; onClose: () => void; onEdit: () => void }) {
  const isVisible = cat.status === CategoryStatus.HienThi;
  return (
    <Modal onClose={onClose}>
      <div style={{ width: 460, maxWidth: "92vw", maxHeight: "90vh", background: "#080d1c", border: "1px solid rgba(30,42,80,0.7)", borderRadius: 18, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,${cat.color},transparent)`, flexShrink: 0 }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid rgba(30,42,80,0.6)", flexShrink: 0, background: "rgba(255,255,255,0.015)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: `${cat.color}20`, boxShadow: `0 0 24px ${cat.color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
              {cat.icon}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9" }}>{cat.name}</div>
              <div style={{ fontSize: 11, fontFamily: "monospace", color: "#475569", marginTop: 4 }}>/{cat.slug}</div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6, padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: isVisible ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)", color: isVisible ? "#10b981" : "#ef4444" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: isVisible ? "#10b981" : "#ef4444", display: "inline-block" }} />
                {CATEGORY_STATUS_LABEL[cat.status]}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><X size={15} /></button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Stats */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<Package size={12} />}>Thống kê</SectionLabel>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: "#64748b" }}>Số sản phẩm</span>
              <span style={{ fontSize: 30, fontWeight: 800, color: cat.color }}>{cat.productCount}</span>
            </div>
            <div style={{ height: 6, background: "rgba(30,42,80,0.8)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min((cat.productCount / 15) * 100, 100)}%`, background: cat.color, borderRadius: 99, transition: "width 0.4s" }} />
            </div>
          </div>

          {/* Info */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<Tag size={12} />}>Thông tin</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "ID", value: cat.id, mono: true, color: "#60a5fa" },
                { label: "Slug", value: `/${cat.slug}`, mono: true, color: "#94a3b8" },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>{row.label}</span>
                  <span style={{ fontSize: 12, color: row.color, fontFamily: row.mono ? "monospace" : undefined }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>Màu sắc</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 99, background: cat.color, boxShadow: `0 0 8px ${cat.color}60` }} />
                  <span style={{ fontFamily: "monospace", color: "#94a3b8", fontSize: 11 }}>{cat.color}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Icon preview */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<Hash size={12} />}>Biểu tượng</SectionLabel>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: 22, background: `${cat.color}20`, border: `2px solid ${cat.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
                {cat.icon}
              </div>
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

/* ─── Category Edit Modal ────────────────────────────────────── */
function CategoryEditModal({ cat, onSave, onClose }: {
  cat: Category;
  onSave: (id: string, data: Partial<Category>) => Promise<void>;
  onClose: () => void;
}) {
  const [name, setName]     = useState(cat.name);
  const [slug, setSlug]     = useState(cat.slug);
  const [icon, setIcon]     = useState(cat.icon);
  const [color, setColor]   = useState(cat.color);
  const [status, setStatus] = useState<CategoryStatus>(cat.status);

  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, background: "#060a15", border: "1px solid rgba(30,42,80,0.9)", color: "#e2e8f0", outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 460, maxWidth: "92vw", background: "#0d1226", border: "1px solid rgba(30,42,80,0.8)", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,${color},transparent)` }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(30,42,80,0.7)" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Chỉnh sửa danh mục</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{cat.name}</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Tên danh mục</label>
              <input style={inputStyle} value={name} onChange={e => { setName(e.target.value); setSlug(slugify(e.target.value)); }} />
            </div>
            <div>
              <label style={labelStyle}>Slug</label>
              <input style={{ ...inputStyle, fontFamily: "monospace" }} value={slug} onChange={e => setSlug(e.target.value)} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Biểu tượng</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              {POPULAR_ICONS.map(ic => (
                <button key={ic} onClick={() => setIcon(ic)} style={{ width: 36, height: 36, borderRadius: 8, fontSize: 18, border: "1px solid", borderColor: icon === ic ? color : "rgba(30,42,80,0.8)", background: icon === ic ? `${color}20` : "transparent", cursor: "pointer" }}>{ic}</button>
              ))}
            </div>
            <input style={{ ...inputStyle, width: 80 }} value={icon} onChange={e => setIcon(e.target.value)} maxLength={2} />
          </div>
          <div>
            <label style={labelStyle}>Màu sắc</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              {COLOR_PRESETS.map(c => (
                <button key={c} onClick={() => setColor(c)} style={{ width: 28, height: 28, borderRadius: 99, background: c, border: color === c ? "2px solid #fff" : "2px solid transparent", cursor: "pointer", boxShadow: color === c ? `0 0 10px ${c}80` : "none" }} />
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: 36, height: 36, borderRadius: 8, border: "none", cursor: "pointer", background: "none" }} />
              <input style={{ ...inputStyle, fontFamily: "monospace", width: 120 }} value={color} onChange={e => setColor(e.target.value)} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Trạng thái</label>
            <select style={{ ...inputStyle, cursor: "pointer" }} value={status} onChange={e => setStatus(Number(e.target.value) as CategoryStatus)}>
              <option value={CategoryStatus.HienThi}>Hiển thị</option>
              <option value={CategoryStatus.An}>Ẩn</option>
            </select>
          </div>
        </div>
        <div style={{ padding: "0 20px 20px", display: "flex", gap: 10 }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant="primary" size="sm" style={{ flex: 1 }} onClick={() => onSave(cat.id, { name, slug, icon, color, status })}>Lưu thay đổi</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Create Category Modal ──────────────────────────────────── */
function CreateCategoryModal({ onCreate, onClose }: { onCreate: (body: Record<string, unknown>) => Promise<void>; onClose: () => void }) {
  const [name, setName]     = useState("");
  const [slug, setSlug]     = useState("");
  const [icon, setIcon]     = useState("📦");
  const [color, setColor]   = useState("#3b82f6");
  const [status, setStatus] = useState<CategoryStatus>(CategoryStatus.HienThi);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, background: "#060a15", border: "1px solid rgba(30,42,80,0.9)", color: "#e2e8f0", outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Bắt buộc";
    if (!slug.trim()) e.slug = "Bắt buộc";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    await onCreate({ name: name.trim(), slug: slug.trim(), icon, color, status });
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 480, maxWidth: "92vw", maxHeight: "90vh", background: "#080d1c", border: "1px solid rgba(30,42,80,0.7)", borderRadius: 18, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,${color},transparent)`, flexShrink: 0 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid rgba(30,42,80,0.6)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{icon}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>Thêm danh mục mới</div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>Điền thông tin bên dưới</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Name + Slug */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<Tag size={12} />}>Thông tin cơ bản</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={labelStyle}>Tên danh mục <span style={{ color: "#ef4444" }}>*</span></label>
                <input style={{ ...inputStyle, borderColor: errors.name ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={name} onChange={e => { setName(e.target.value); setSlug(slugify(e.target.value)); }} placeholder="Windows, Office 365..." />
                {errors.name && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.name}</span>}
              </div>
              <div>
                <label style={labelStyle}>Slug <span style={{ color: "#ef4444" }}>*</span></label>
                <input style={{ ...inputStyle, fontFamily: "monospace", borderColor: errors.slug ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={slug} onChange={e => setSlug(e.target.value)} placeholder="windows" />
                {errors.slug && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.slug}</span>}
              </div>
              <div>
                <label style={labelStyle}>Trạng thái</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={status} onChange={e => setStatus(Number(e.target.value) as CategoryStatus)}>
                  <option value={CategoryStatus.HienThi}>Hiển thị</option>
                  <option value={CategoryStatus.An}>Ẩn</option>
                </select>
              </div>
            </div>
          </div>

          {/* Icon */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<Hash size={12} />}>Biểu tượng</SectionLabel>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              {POPULAR_ICONS.map(ic => (
                <button key={ic} onClick={() => setIcon(ic)} style={{ width: 38, height: 38, borderRadius: 10, fontSize: 20, border: "1px solid", borderColor: icon === ic ? color : "rgba(30,42,80,0.8)", background: icon === ic ? `${color}20` : "transparent", cursor: "pointer", transition: "all 0.15s" }}>{ic}</button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "#475569" }}>Hoặc nhập emoji:</span>
              <input style={{ ...inputStyle, width: 70, textAlign: "center", fontSize: 20 }} value={icon} onChange={e => setIcon(e.target.value)} maxLength={2} />
            </div>
          </div>

          {/* Color */}
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <SectionLabel icon={<Package size={12} />}>Màu sắc</SectionLabel>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
              {COLOR_PRESETS.map(c => (
                <button key={c} onClick={() => setColor(c)} title={c} style={{ width: 32, height: 32, borderRadius: 99, background: c, border: color === c ? "3px solid #fff" : "3px solid transparent", cursor: "pointer", boxShadow: color === c ? `0 0 12px ${c}90` : "none", transition: "all 0.15s" }} />
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: 40, height: 40, borderRadius: 10, border: "none", cursor: "pointer", background: "none" }} />
              <input style={{ ...inputStyle, fontFamily: "monospace", width: 130 }} value={color} onChange={e => setColor(e.target.value)} placeholder="#3b82f6" />
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}20`, border: `2px solid ${color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{icon}</div>
            </div>
          </div>
        </div>

        <div style={{ padding: "14px 22px", borderTop: "1px solid rgba(30,42,80,0.6)", display: "flex", gap: 10, flexShrink: 0, background: "rgba(255,255,255,0.015)" }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} icon={<Plus size={13} />} style={{ flex: 2 }}>Tạo danh mục</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Delete Confirm Modal ───────────────────────────────────── */
function DeleteModal({ cat, onConfirm, onClose }: { cat: Category; onConfirm: () => Promise<void>; onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div style={{ width: 360, maxWidth: "90vw", background: "#0d1226", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div style={{ padding: "24px 24px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{cat.icon}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>Xóa danh mục?</div>
          <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
            Danh mục <strong style={{ color: "#cbd5e1" }}>{cat.name}</strong> và toàn bộ liên kết sản phẩm sẽ bị xóa vĩnh viễn.
          </div>
        </div>
        <div style={{ padding: "0 24px 24px", display: "flex", gap: 10 }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant="danger" size="sm" onClick={async () => { await onConfirm(); onClose(); }} style={{ flex: 1 }}>Xóa</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [apiError, setApiError]     = useState<string | null>(null);
  const [search, setSearch]         = useState("");
  const [viewing, setViewing]       = useState<Category | null>(null);
  const [editing, setEditing]       = useState<Category | null>(null);
  const [deleting, setDeleting]     = useState<Category | null>(null);
  const [creating, setCreating]     = useState(false);
  const [page, setPage]             = useState(1);
  const [toggles, setToggles]       = useState<Record<string, boolean>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoriesApi.list();
      setCategories(data);
      setToggles(Object.fromEntries(data.map(c => [c.id, c.status === CategoryStatus.HienThi])));
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = categories.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSaveEdit = useCallback(async (id: string, data: Partial<Category>) => {
    try {
      await categoriesApi.update(id, data as Record<string, unknown>);
      await fetchData();
      setEditing(null);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }, [fetchData]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await categoriesApi.delete(id);
      await fetchData();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }, [fetchData]);

  const handleToggle = useCallback(async (id: string) => {
    try {
      await categoriesApi.toggle(id);
      await fetchData();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }, [fetchData]);

  const handleCreate = useCallback(async (body: Record<string, unknown>) => {
    try {
      await categoriesApi.create(body);
      await fetchData();
      setCreating(false);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }, [fetchData]);

  const visibleCount = categories.filter(c => c.status === CategoryStatus.HienThi).length;
  const hiddenCount  = categories.filter(c => c.status === CategoryStatus.An).length;

  return (
    <AdminLayout title="Danh mục" subtitle="Quản lý danh mục sản phẩm">
      <div className="page-content">

        {apiError && (
          <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>{apiError}</span>
            <button onClick={() => setApiError(null)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", padding: 4 }}><X size={14} /></button>
          </div>
        )}

        <StatsGrid cols={4}>
          <StatCard label="Tổng danh mục" value={categories.length} change={8.3} changeLabel="so với tháng trước" icon="package" color="blue" />
          <StatCard label="Đang hiển thị" value={visibleCount} change={2} changeLabel="so với tháng trước" icon="package" color="green" />
          <StatCard label="Đang ẩn" value={hiddenCount} changeLabel="so với tháng trước" icon="package" color="amber" />
          <StatCard label="Tổng sản phẩm" value={categories.reduce((s, c) => s + c.productCount, 0)} change={5} changeLabel="so với tháng trước" icon="package" color="purple" />
        </StatsGrid>

        {/* Toolbar */}
        <div className="glass-card" style={{ padding: 16 }}>
          <div className="toolbar">
            <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
              <Search size={13} className="search-icon" />
              <input className="admin-input" placeholder="Tìm danh mục, slug..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => setCreating(true)}>Thêm danh mục</Button>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card" style={{ overflowX: "auto" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 60, color: "#475569" }}>
              <span style={{ display: "inline-block", width: 24, height: 24, border: "2px solid #334155", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            </div>
          ) : (
            <>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Danh mục</th><th>Slug</th><th>Số sản phẩm</th><th>Trạng thái</th><th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map(cat => (
                    <tr key={cat.id} onClick={() => setViewing(cat)} style={{ cursor: "pointer" }}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 42, height: 42, borderRadius: 12, background: `${cat.color}18`, boxShadow: `0 0 14px ${cat.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                            {cat.icon}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{cat.name}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                              <div style={{ width: 10, height: 10, borderRadius: 99, background: cat.color, boxShadow: `0 0 6px ${cat.color}80` }} />
                              <span style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>{cat.color}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td><span style={{ fontFamily: "monospace", color: "#64748b", fontSize: 11 }}>/{cat.slug}</span></td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 64, height: 5, background: "rgba(30,42,80,0.8)", borderRadius: 99, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${Math.min((cat.productCount / 15) * 100, 100)}%`, background: cat.color, borderRadius: 99 }} />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{cat.productCount}</span>
                        </div>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <label className="toggle">
                          <input type="checkbox" checked={toggles[cat.id] ?? false} onChange={() => handleToggle(cat.id)} />
                          <span className="toggle-slider" />
                        </label>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <ActionButtons
                          onView={() => setViewing(cat)}
                          onEdit={() => setEditing(cat)}
                          onDelete={() => setDeleting(cat)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="empty-state">
                  <span style={{ fontSize: 36 }}>🗂️</span>
                  <div style={{ color: "#475569", fontSize: 13 }}>Không tìm thấy danh mục</div>
                </div>
              )}
            </>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "#475569" }}>
            {filtered.length === 0 ? "0" : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)}`} / {filtered.length} danh mục
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
      {creating && <CreateCategoryModal onCreate={handleCreate} onClose={() => setCreating(false)} />}
      {viewing && <CategoryDetailModal cat={viewing} onClose={() => setViewing(null)} onEdit={() => { setEditing(viewing); setViewing(null); }} />}
      {editing && <CategoryEditModal cat={editing} onSave={handleSaveEdit} onClose={() => setEditing(null)} />}
      {deleting && <DeleteModal cat={deleting} onConfirm={() => handleDelete(deleting.id)} onClose={() => setDeleting(null)} />}
    </AdminLayout>
  );
}
