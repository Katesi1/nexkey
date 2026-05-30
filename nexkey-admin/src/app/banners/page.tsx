"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard, StatsGrid } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { bannersApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Banner, BannerPosition, BannerStatus } from "@/lib/types";
import {
  Upload, Plus, Eye, Pencil, Trash2, GripVertical,
  ExternalLink, Image as ImageIcon, X, Link, MapPin,
  Hash, Calendar, ToggleLeft, ToggleRight,
} from "lucide-react";

/* ─── Constants ──────────────────────────────────────────────── */
const POSITIONS: BannerPosition[] = [
  "Trang chủ - Hero",
  "Trang chủ - Banner",
  "Trang sản phẩm",
  "Thanh toán",
];

const POS_COLORS: Record<BannerPosition, { color: string; bg: string; gradient: string }> = {
  "Trang chủ - Hero":    { color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  gradient: "linear-gradient(135deg,rgba(59,130,246,0.15),rgba(124,58,237,0.08))" },
  "Trang chủ - Banner":  { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", gradient: "linear-gradient(135deg,rgba(139,92,246,0.15),rgba(59,130,246,0.08))" },
  "Trang sản phẩm":      { color: "#10b981", bg: "rgba(16,185,129,0.1)", gradient: "linear-gradient(135deg,rgba(16,185,129,0.15),rgba(59,130,246,0.06))" },
  "Thanh toán":          { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", gradient: "linear-gradient(135deg,rgba(245,158,11,0.15),rgba(239,68,68,0.06))" },
};

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

/* ─── Banner Preview Modal ───────────────────────────────────── */
function BannerPreviewModal({ banner, isActive, onClose, onEdit, onToggle }: {
  banner: Banner; isActive: boolean; onClose: () => void;
  onEdit: () => void; onToggle: () => void;
}) {
  const pc = POS_COLORS[banner.position];

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 540, maxWidth: "92vw", background: "#080d1c", border: "1px solid rgba(30,42,80,0.7)", borderRadius: 18, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,${pc.color},transparent)` }} />

        {/* Large preview */}
        <div style={{ height: 200, background: `linear-gradient(135deg,#0d1226,#162040)`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: pc.gradient }} />
          <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(7,11,22,0.8)", border: "1px solid rgba(30,42,80,0.5)", color: "#64748b", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>
            #{banner.sortOrder}
          </div>
          <div style={{ position: "absolute", top: 12, right: 12 }}>
            <Badge variant={isActive ? "success" : "error"} size="sm">{isActive ? "Hiển thị" : "Ẩn"}</Badge>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, zIndex: 1 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: pc.bg, border: `1px solid ${pc.color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ImageIcon size={28} style={{ color: pc.color }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>{banner.title}</div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{banner.image}</div>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: 10, right: 12, width: 8, height: 8, borderRadius: "50%", background: isActive ? "#10b981" : "#ef4444", boxShadow: `0 0 8px ${isActive ? "rgba(16,185,129,0.7)" : "rgba(239,68,68,0.7)"}` }} />
        </div>

        {/* Info */}
        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { icon: <MapPin size={13} />, label: "Vị trí", value: banner.position, color: pc.color, badge: true },
            ...(banner.link ? [{ icon: <Link size={13} />, label: "Liên kết", value: banner.link, color: "#60a5fa", badge: false }] : []),
            { icon: <Hash size={13} />, label: "Thứ tự", value: `#${banner.sortOrder}`, color: "#94a3b8", badge: false },
            { icon: <Calendar size={13} />, label: "Tạo lúc", value: formatDate(banner.createdAt), color: "#475569", badge: false },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b" }}>
                {row.icon}
                <span style={{ fontSize: 12 }}>{row.label}</span>
              </div>
              {row.badge
                ? <span style={{ fontSize: 11, fontWeight: 700, color: row.color, background: `${row.color}18`, padding: "2px 10px", borderRadius: 99 }}>{row.value}</span>
                : <span style={{ fontSize: 12, color: row.color, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260 }}>{row.value}</span>
              }
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 22px", borderTop: "1px solid rgba(30,42,80,0.6)", display: "flex", gap: 10 }}>
          <button onClick={onToggle} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 0", borderRadius: 8, border: "1px solid rgba(30,42,80,0.8)", background: "transparent", color: isActive ? "#f87171" : "#34d399", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            {isActive ? <ToggleLeft size={14} /> : <ToggleRight size={14} />}
            {isActive ? "Ẩn banner" : "Hiển thị"}
          </button>
          <Button variant="primary" size="sm" icon={<Pencil size={12} />} style={{ flex: 1 }} onClick={onEdit}>Chỉnh sửa</Button>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Banner Form Modal (Create + Edit) ──────────────────────── */
function BannerFormModal({ banner, onSave, onClose }: {
  banner?: Banner;
  onSave: (data: Omit<Banner, "id" | "createdAt"> & { id?: string }) => Promise<void>;
  onClose: () => void;
}) {
  const isEdit = !!banner;
  const [title, setTitle]       = useState(banner?.title ?? "");
  const [image, setImage]       = useState(banner?.image ?? "");
  const [link, setLink]         = useState(banner?.link ?? "");
  const [position, setPosition] = useState<BannerPosition>(banner?.position ?? "Trang chủ - Hero");
  const [sortOrder, setSortOrder] = useState(String(banner?.sortOrder ?? 1));
  const [status, setStatus]     = useState<BannerStatus>(banner?.status ?? "Hiển thị");
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pc = POS_COLORS[position];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Bắt buộc";
    if (!image.trim()) e.image = "Bắt buộc";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    await onSave({ id: banner?.id, title: title.trim(), image: image.trim(), link: link.trim() || undefined, position, sortOrder: Number(sortOrder) || 1, status });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await bannersApi.upload(file);
      setImage(url);
    } catch {
      // silently ignore upload errors in form
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, background: "#060a15", border: "1px solid rgba(30,42,80,0.9)", color: "#e2e8f0", outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 500, maxWidth: "92vw", maxHeight: "90vh", background: "#080d1c", border: "1px solid rgba(30,42,80,0.7)", borderRadius: 18, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,${pc.color},transparent)`, flexShrink: 0, transition: "background 0.3s" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid rgba(30,42,80,0.6)", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>{isEdit ? "Chỉnh sửa banner" : "Thêm banner mới"}</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 3 }}>{isEdit ? banner.title : "Tạo banner quảng cáo mới"}</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Live preview strip */}
          <div style={{ height: 80, borderRadius: 10, background: `linear-gradient(135deg,#0d1226,#162040)`, position: "relative", display: "flex", alignItems: "center", gap: 14, padding: "0 16px", overflow: "hidden", border: `1px solid ${pc.color}25` }}>
            <div style={{ position: "absolute", inset: 0, background: pc.gradient }} />
            <div style={{ width: 42, height: 42, borderRadius: 10, background: pc.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
              <ImageIcon size={20} style={{ color: pc.color }} />
            </div>
            <div style={{ zIndex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title || "Tiêu đề banner..."}</div>
              <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{position}</div>
            </div>
            <div style={{ position: "absolute", top: 8, right: 10, fontSize: 10, fontWeight: 700, color: pc.color, background: pc.bg, padding: "1px 8px", borderRadius: 99 }}>{status}</div>
          </div>

          <div>
            <label style={labelStyle}>Tiêu đề banner <span style={{ color: "#ef4444" }}>*</span></label>
            <input style={{ ...inputStyle, borderColor: errors.title ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={title} onChange={e => setTitle(e.target.value)} placeholder="Windows 11 Pro - Giá cực hot!" />
            {errors.title && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.title}</span>}
          </div>

          <div>
            <label style={labelStyle}>Đường dẫn ảnh <span style={{ color: "#ef4444" }}>*</span></label>
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...inputStyle, fontFamily: "monospace", fontSize: 12, borderColor: errors.image ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={image} onChange={e => setImage(e.target.value)} placeholder="/banners/win11.jpg" />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{ padding: "0 12px", borderRadius: 8, border: "1px solid rgba(30,42,80,0.9)", background: "rgba(59,130,246,0.08)", color: uploading ? "#475569" : "#60a5fa", cursor: uploading ? "default" : "pointer", fontSize: 12, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5 }}
              >
                <Upload size={12} />{uploading ? "Đang tải..." : "Upload"}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
            </div>
            {errors.image && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.image}</span>}
          </div>

          <div>
            <label style={labelStyle}>Liên kết khi click</label>
            <input style={{ ...inputStyle, fontFamily: "monospace", fontSize: 12 }} value={link} onChange={e => setLink(e.target.value)} placeholder="/products/windows-11-pro" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: 12 }}>
            <div>
              <label style={labelStyle}>Vị trí hiển thị</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={position} onChange={e => setPosition(e.target.value as BannerPosition)}>
                {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Thứ tự</label>
              <input type="text" inputMode="numeric" style={inputStyle} value={sortOrder} onChange={e => setSortOrder(e.target.value.replace(/\D/g, ""))} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Trạng thái</label>
            <div style={{ display: "flex", gap: 8 }}>
              {(["Hiển thị", "Ẩn"] as BannerStatus[]).map(s => (
                <button key={s} onClick={() => setStatus(s)} style={{ flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 13, fontWeight: status === s ? 700 : 400, border: "1px solid", borderColor: status === s ? (s === "Hiển thị" ? "#10b981" : "#ef4444") : "rgba(30,42,80,0.8)", background: status === s ? (s === "Hiển thị" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.1)") : "transparent", color: status === s ? (s === "Hiển thị" ? "#34d399" : "#f87171") : "#64748b", cursor: "pointer" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: "14px 22px", borderTop: "1px solid rgba(30,42,80,0.6)", display: "flex", gap: 10, flexShrink: 0, background: "rgba(255,255,255,0.015)" }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} icon={isEdit ? <Pencil size={13} /> : <Plus size={13} />} style={{ flex: 2 }}>
            {isEdit ? "Lưu thay đổi" : "Thêm banner"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Delete Confirm Modal ───────────────────────────────────── */
function DeleteModal({ banner, onConfirm, onClose }: { banner: Banner; onConfirm: () => Promise<void>; onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div style={{ width: 360, maxWidth: "90vw", background: "#0d1226", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div style={{ padding: "24px 24px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>Xóa banner?</div>
          <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
            Banner <strong style={{ color: "#cbd5e1" }}>{banner.title}</strong> sẽ bị xóa vĩnh viễn và không còn hiển thị trên website.
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

/* ─── Banner Card ────────────────────────────────────────────── */
function BannerCard({ banner, isActive, onToggle, onView, onEdit, onDelete }: {
  banner: Banner; isActive: boolean;
  onToggle: () => void; onView: () => void;
  onEdit: () => void; onDelete: () => void;
}) {
  const pc = POS_COLORS[banner.position];

  return (
    <div className="glass-card" style={{ overflow: "hidden", transition: "border-color 0.2s", borderColor: isActive ? `${pc.color}30` : "rgba(30,42,80,0.8)" }}>
      {/* Preview */}
      <div onClick={onView} style={{ height: 152, background: "linear-gradient(135deg,#0d1226,#162040)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "pointer" }}>
        <div style={{ position: "absolute", inset: 0, background: pc.gradient }} />
        <div style={{ position: "absolute", top: 10, left: 10, color: "#475569", cursor: "grab", padding: 4, background: "rgba(7,11,22,0.7)", borderRadius: 6, border: "1px solid rgba(30,42,80,0.5)" }}>
          <GripVertical size={13} />
        </div>
        <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(7,11,22,0.85)", border: "1px solid rgba(30,42,80,0.7)", color: "#64748b", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>
          #{banner.sortOrder}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 1 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: pc.bg, border: `1px solid ${pc.color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ImageIcon size={20} style={{ color: pc.color }} />
          </div>
          <span style={{ fontSize: 11, color: "#475569", maxWidth: 200, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{banner.image}</span>
        </div>
        <div style={{ position: "absolute", bottom: 10, right: 10, display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: isActive ? "#10b981" : "#ef4444", boxShadow: `0 0 8px ${isActive ? "rgba(16,185,129,0.7)" : "rgba(239,68,68,0.7)"}` }} />
          <span style={{ fontSize: 9, color: isActive ? "#10b981" : "#ef4444", fontWeight: 700 }}>{isActive ? "LIVE" : "OFF"}</span>
        </div>
        {/* Hover overlay hint */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "all 0.2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(0,0,0,0.35)"; (e.currentTarget as HTMLDivElement).style.opacity = "1"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(0,0,0,0)"; (e.currentTarget as HTMLDivElement).style.opacity = "0"; }}>
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 600, background: "rgba(0,0,0,0.5)", padding: "6px 14px", borderRadius: 99 }}>
            <Eye size={12} style={{ display: "inline", marginRight: 5 }} />Xem chi tiết
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 3 }}>{banner.title}</div>
            {banner.link && (
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <ExternalLink size={9} style={{ color: "#3b82f6", flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{banner.link}</span>
              </div>
            )}
          </div>
          <label className="toggle" style={{ flexShrink: 0 }} onClick={e => e.stopPropagation()}>
            <input type="checkbox" checked={isActive} onChange={onToggle} />
            <span className="toggle-slider" />
          </label>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: pc.color, background: pc.bg, padding: "2px 8px", borderRadius: 99 }}>
            {banner.position}
          </span>
          <span style={{ fontSize: 10, color: "#334155" }}>{formatDate(banner.createdAt)}</span>
        </div>

        <div style={{ display: "flex", gap: 4, paddingTop: 10, borderTop: "1px solid rgba(30,42,80,0.5)" }}>
          <button onClick={onView} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center", gap: 5, fontSize: 11 }}><Eye size={11} /> Xem</button>
          <button onClick={onEdit} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center", gap: 5, fontSize: 11 }}><Pencil size={11} /> Sửa</button>
          <button onClick={onDelete} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center", gap: 5, fontSize: 11, color: "#f87171" }}><Trash2 size={11} /> Xóa</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function BannersPage() {
  const [banners, setBanners]   = useState<Banner[]>([]);
  const [loading, setLoading]   = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [toggles, setToggles]   = useState<Record<string, boolean>>({});
  const [viewing, setViewing]   = useState<Banner | null>(null);
  const [editing, setEditing]   = useState<Banner | null>(null);
  const [deleting, setDeleting] = useState<Banner | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bannersApi.list();
      setBanners(data);
      setToggles(Object.fromEntries(data.map(b => [b.id, b.status === "Hiển thị"])));
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleToggle = useCallback(async (id: string) => {
    try {
      await bannersApi.toggle(id);
      await fetchData();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }, [fetchData]);

  const handleSave = useCallback(async (data: Omit<Banner, "id" | "createdAt"> & { id?: string }) => {
    try {
      if (data.id) {
        const { id, ...rest } = data;
        await bannersApi.update(id, rest as Record<string, unknown>);
      } else {
        await bannersApi.create(data as Record<string, unknown>);
      }
      await fetchData();
      setEditing(null);
      setCreating(false);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }, [fetchData]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await bannersApi.delete(id);
      await fetchData();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }, [fetchData]);

  const activeCount  = Object.values(toggles).filter(Boolean).length;
  const hiddenCount  = Object.values(toggles).filter(v => !v).length;
  const posCount     = new Set(banners.map(b => b.position)).size;

  return (
    <AdminLayout title="Banner" subtitle="Quản lý banner quảng cáo trên website">
      <div className="page-content">

        {apiError && (
          <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>{apiError}</span>
            <button onClick={() => setApiError(null)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", padding: 4 }}><X size={14} /></button>
          </div>
        )}

        <StatsGrid cols={4}>
          <StatCard label="Tổng banner" value={banners.length} change={2} changeLabel="so với tháng trước" icon="activity" color="blue" />
          <StatCard label="Đang hiển thị" value={activeCount} change={1} changeLabel="so với tháng trước" icon="activity" color="green" />
          <StatCard label="Đang ẩn" value={hiddenCount} changeLabel="so với tháng trước" icon="activity" color="amber" />
          <StatCard label="Vị trí đang dùng" value={posCount} changeLabel="so với tháng trước" icon="activity" color="purple" />
        </StatsGrid>

        {/* Toolbar */}
        <div className="glass-card" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Banner quảng cáo</div>
              <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>Quản lý và sắp xếp banner hiển thị trên website</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="secondary" size="sm" icon={<Upload size={13} />} onClick={() => setCreating(true)}>Upload ảnh</Button>
              <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => setCreating(true)}>Thêm banner</Button>
            </div>
          </div>

          {/* Position filter chips */}
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            {POSITIONS.map(pos => {
              const pc = POS_COLORS[pos];
              const cnt = banners.filter(b => b.position === pos).length;
              return (
                <div key={pos} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 99, background: pc.bg, border: `1px solid ${pc.color}25`, fontSize: 11, color: pc.color, fontWeight: 600 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: pc.color, display: "inline-block" }} />
                  {pos} <span style={{ fontWeight: 400, color: "#64748b" }}>({cnt})</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Banner grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#475569" }}>
            <span style={{ display: "inline-block", width: 24, height: 24, border: "2px solid #334155", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {banners.map(banner => (
              <BannerCard
                key={banner.id}
                banner={banner}
                isActive={toggles[banner.id] ?? false}
                onToggle={() => handleToggle(banner.id)}
                onView={() => setViewing(banner)}
                onEdit={() => setEditing(banner)}
                onDelete={() => setDeleting(banner)}
              />
            ))}

            {/* Add new card */}
            <div
              onClick={() => setCreating(true)}
              style={{ minHeight: 260, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, border: "2px dashed rgba(30,42,80,0.8)", borderRadius: 14, background: "rgba(13,18,38,0.3)", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(59,130,246,0.4)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(59,130,246,0.04)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(30,42,80,0.8)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(13,18,38,0.3)"; }}
            >
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Plus size={22} style={{ color: "#3b82f6" }} />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>Thêm banner mới</div>
                <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>Click để tạo banner</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {creating && <BannerFormModal onSave={handleSave} onClose={() => setCreating(false)} />}
      {editing && <BannerFormModal banner={editing} onSave={handleSave} onClose={() => setEditing(null)} />}
      {viewing && (
        <BannerPreviewModal
          banner={viewing}
          isActive={toggles[viewing.id] ?? false}
          onClose={() => setViewing(null)}
          onEdit={() => { setEditing(viewing); setViewing(null); }}
          onToggle={() => handleToggle(viewing.id)}
        />
      )}
      {deleting && <DeleteModal banner={deleting} onConfirm={() => handleDelete(deleting.id)} onClose={() => setDeleting(null)} />}
    </AdminLayout>
  );
}
