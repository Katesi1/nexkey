"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard, StatsGrid } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import {
  Plus, FileText, X, Pencil, Trash2, Eye, Search,
  Globe, Lock, BookOpen, Info, Home, ShieldCheck, HelpCircle,
  ExternalLink, Clock, ToggleLeft, ToggleRight, Hash,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────── */
type PageStatus = "Hiển thị" | "Ẩn";

type StaticPage = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  status: PageStatus;
  updatedAt: string;
  wordCount: number;
  isSystem: boolean;
};

/* ─── Mock data ──────────────────────────────────────────────── */
const INITIAL_PAGES: StaticPage[] = [
  { id: "pg-1", title: "Trang chủ", slug: "/", description: "Trang chủ chính của NexKey - mua key phần mềm bản quyền", content: "Chào mừng đến với NexKey...", status: "Hiển thị", updatedAt: "2024-05-20", wordCount: 320, isSystem: true },
  { id: "pg-2", title: "Về chúng tôi", slug: "/about", description: "Thông tin về NexKey, sứ mệnh và đội ngũ", content: "NexKey là nền tảng...", status: "Hiển thị", updatedAt: "2024-04-15", wordCount: 540, isSystem: false },
  { id: "pg-3", title: "Chính sách bảo mật", slug: "/privacy", description: "Chính sách bảo vệ dữ liệu và quyền riêng tư người dùng", content: "Chúng tôi cam kết...", status: "Hiển thị", updatedAt: "2024-03-10", wordCount: 1240, isSystem: true },
  { id: "pg-4", title: "Điều khoản sử dụng", slug: "/terms", description: "Quy định và điều khoản khi sử dụng dịch vụ NexKey", content: "Bằng cách sử dụng...", status: "Hiển thị", updatedAt: "2024-03-10", wordCount: 980, isSystem: true },
  { id: "pg-5", title: "Hướng dẫn mua hàng", slug: "/guide", description: "Hướng dẫn từng bước mua và kích hoạt key phần mềm", content: "Bước 1: Chọn sản phẩm...", status: "Hiển thị", updatedAt: "2024-05-01", wordCount: 760, isSystem: false },
  { id: "pg-6", title: "Câu hỏi thường gặp", slug: "/faq", description: "Giải đáp các thắc mắc phổ biến về sản phẩm và dịch vụ", content: "Q: Key có bản quyền không?...", status: "Hiển thị", updatedAt: "2024-05-10", wordCount: 420, isSystem: false },
  { id: "pg-7", title: "Liên hệ", slug: "/contact", description: "Thông tin liên hệ hỗ trợ khách hàng", content: "Email: support@nexkey.vn...", status: "Ẩn", updatedAt: "2024-04-01", wordCount: 180, isSystem: false },
];

/* ─── Constants ──────────────────────────────────────────────── */
const PAGE_ICONS: Record<string, React.ReactNode> = {
  "/":        <Home size={18} style={{ color: "#3b82f6" }} />,
  "/about":   <Info size={18} style={{ color: "#8b5cf6" }} />,
  "/privacy": <Lock size={18} style={{ color: "#10b981" }} />,
  "/terms":   <ShieldCheck size={18} style={{ color: "#f59e0b" }} />,
  "/guide":   <BookOpen size={18} style={{ color: "#06b6d4" }} />,
  "/faq":     <HelpCircle size={18} style={{ color: "#ec4899" }} />,
  "/contact": <Globe size={18} style={{ color: "#64748b" }} />,
};
const PAGE_COLORS: Record<string, string> = {
  "/":        "#3b82f6",
  "/about":   "#8b5cf6",
  "/privacy": "#10b981",
  "/terms":   "#f59e0b",
  "/guide":   "#06b6d4",
  "/faq":     "#ec4899",
  "/contact": "#64748b",
};
const getIcon  = (slug: string) => PAGE_ICONS[slug]  ?? <FileText size={18} style={{ color: "#64748b" }} />;
const getColor = (slug: string) => PAGE_COLORS[slug] ?? "#64748b";

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

/* ─── Page Preview Modal ─────────────────────────────────────── */
function PagePreviewModal({ page, onClose, onEdit, onToggle }: {
  page: StaticPage; onClose: () => void; onEdit: () => void; onToggle: () => void;
}) {
  const color   = getColor(page.slug);
  const isVisible = page.status === "Hiển thị";

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 520, maxWidth: "92vw", maxHeight: "90vh", background: "#080d1c", border: "1px solid rgba(30,42,80,0.7)", borderRadius: 18, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,${color},transparent)`, flexShrink: 0 }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 22px", borderBottom: "1px solid rgba(30,42,80,0.6)", flexShrink: 0, background: "rgba(255,255,255,0.015)" }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}15`, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {getIcon(page.slug)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#f1f5f9" }}>{page.title}</div>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: "#3b82f6", marginTop: 3 }}>{page.slug}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: isVisible ? "#10b981" : "#64748b", background: isVisible ? "rgba(16,185,129,0.12)" : "rgba(100,116,139,0.12)", padding: "2px 8px", borderRadius: 99 }}>{page.status}</span>
              {page.isSystem && <span style={{ fontSize: 10, fontWeight: 700, color: "#f59e0b", background: "rgba(245,158,11,0.1)", padding: "2px 8px", borderRadius: 99 }}>Hệ thống</span>}
            </div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><X size={14} /></button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "14px 16px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Mô tả (SEO)</div>
            <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{page.description}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "Slug", value: page.slug, icon: <Hash size={13} />, mono: true, color: "#60a5fa" },
              { label: "Cập nhật", value: page.updatedAt, icon: <Clock size={13} />, color: "#94a3b8" },
              { label: "Số từ", value: `~${page.wordCount.toLocaleString("vi-VN")}`, icon: <FileText size={13} />, color: "#94a3b8" },
            ].map(row => (
              <div key={row.label} style={{ background: "rgba(255,255,255,0.025)", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(30,42,80,0.5)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#475569", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{row.icon}{row.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: row.color, fontFamily: row.mono ? "monospace" : undefined }}>{row.value}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "14px 16px", border: "1px solid rgba(30,42,80,0.5)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Nội dung (preview)</div>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: "#475569", background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: "10px 12px", lineHeight: 1.6 }}>
              {page.content.length > 120 ? page.content.slice(0, 120) + "..." : page.content}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 22px", borderTop: "1px solid rgba(30,42,80,0.6)", display: "flex", gap: 10, flexShrink: 0, background: "rgba(255,255,255,0.015)" }}>
          <button onClick={onToggle} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 0", borderRadius: 8, border: "1px solid rgba(30,42,80,0.8)", background: "transparent", color: isVisible ? "#f87171" : "#34d399", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            {isVisible ? <ToggleLeft size={14} /> : <ToggleRight size={14} />}
            {isVisible ? "Ẩn trang" : "Hiển thị"}
          </button>
          <Button variant="primary" size="sm" icon={<Pencil size={12} />} style={{ flex: 1 }} onClick={onEdit}>Chỉnh sửa</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Page Form Modal ────────────────────────────────────────── */
function PageFormModal({ page, onSave, onClose }: {
  page?: StaticPage;
  onSave: (data: Partial<StaticPage> & { id?: string }) => void;
  onClose: () => void;
}) {
  const isEdit = !!page;
  const [title, setTitle]           = useState(page?.title ?? "");
  const [slug, setSlug]             = useState(page?.slug ?? "/");
  const [description, setDesc]      = useState(page?.description ?? "");
  const [content, setContent]       = useState(page?.content ?? "");
  const [status, setStatus]         = useState<PageStatus>(page?.status ?? "Hiển thị");
  const [errors, setErrors]         = useState<Record<string, string>>({});

  const color = getColor(slug);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Bắt buộc";
    if (!slug.trim() || !slug.startsWith("/")) e.slug = "Slug phải bắt đầu bằng /";
    if (!description.trim()) e.description = "Bắt buộc cho SEO";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({
      id: page?.id,
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      content: content.trim(),
      status,
      updatedAt: new Date().toISOString().slice(0, 10),
      wordCount: content.trim().split(/\s+/).filter(Boolean).length,
      isSystem: page?.isSystem ?? false,
    });
    onClose();
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, background: "#060a15", border: "1px solid rgba(30,42,80,0.9)", color: "#e2e8f0", outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 560, maxWidth: "94vw", maxHeight: "90vh", background: "#080d1c", border: "1px solid rgba(30,42,80,0.7)", borderRadius: 18, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,${color},transparent)`, flexShrink: 0, transition: "background 0.3s" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid rgba(30,42,80,0.6)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>{getIcon(slug)}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9" }}>{isEdit ? "Chỉnh sửa trang" : "Tạo trang mới"}</div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{isEdit ? page.slug : "Trang tĩnh cho website"}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 12 }}>
            <div>
              <label style={labelStyle}>Tiêu đề trang <span style={{ color: "#ef4444" }}>*</span></label>
              <input style={{ ...inputStyle, borderColor: errors.title ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={title} onChange={e => setTitle(e.target.value)} placeholder="Chính sách bảo mật" />
              {errors.title && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.title}</span>}
            </div>
            <div>
              <label style={labelStyle}>Trạng thái</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {(["Hiển thị", "Ẩn"] as PageStatus[]).map(s => (
                  <button key={s} onClick={() => setStatus(s)} style={{ padding: "8px 0", borderRadius: 7, fontSize: 12, fontWeight: status === s ? 700 : 400, border: "1px solid", borderColor: status === s ? (s === "Hiển thị" ? "#10b981" : "#ef4444") : "rgba(30,42,80,0.8)", background: status === s ? (s === "Hiển thị" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.1)") : "transparent", color: status === s ? (s === "Hiển thị" ? "#34d399" : "#f87171") : "#64748b", cursor: "pointer" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Slug (đường dẫn) <span style={{ color: "#ef4444" }}>*</span></label>
            <input style={{ ...inputStyle, fontFamily: "monospace", fontSize: 12, borderColor: errors.slug ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={slug} onChange={e => setSlug(e.target.value)} placeholder="/privacy" />
            {errors.slug && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.slug}</span>}
          </div>

          <div>
            <label style={labelStyle}>Mô tả SEO <span style={{ color: "#ef4444" }}>*</span></label>
            <input style={{ ...inputStyle, borderColor: errors.description ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={description} onChange={e => setDesc(e.target.value)} placeholder="Mô tả ngắn hiển thị trên Google..." />
            {errors.description && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.description}</span>}
            <div style={{ fontSize: 10, color: "#334155", marginTop: 4 }}>Tối ưu 150–160 ký tự. Hiện tại: {description.length} ký tự</div>
          </div>

          <div>
            <label style={labelStyle}>Nội dung trang</label>
            <textarea style={{ ...inputStyle, minHeight: 140, resize: "vertical", lineHeight: 1.6 }} value={content} onChange={e => setContent(e.target.value)} placeholder="Nhập nội dung trang..." />
            <div style={{ fontSize: 10, color: "#334155", marginTop: 4 }}>~{content.trim().split(/\s+/).filter(Boolean).length} từ</div>
          </div>
        </div>

        <div style={{ padding: "14px 22px", borderTop: "1px solid rgba(30,42,80,0.6)", display: "flex", gap: 10, flexShrink: 0, background: "rgba(255,255,255,0.015)" }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} icon={isEdit ? <Pencil size={13} /> : <Plus size={13} />} style={{ flex: 2 }}>
            {isEdit ? "Lưu thay đổi" : "Tạo trang"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Delete Modal ───────────────────────────────────────────── */
function DeleteModal({ page, onConfirm, onClose }: { page: StaticPage; onConfirm: () => void; onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div style={{ width: 360, maxWidth: "90vw", background: "#0d1226", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div style={{ padding: "24px 24px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>Xóa trang?</div>
          <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
            Trang <strong style={{ color: "#cbd5e1" }}>{page.title}</strong>
            <span style={{ fontFamily: "monospace", color: "#60a5fa" }}> ({page.slug})</span> sẽ bị xóa vĩnh viễn.
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

/* ─── Main Page ──────────────────────────────────────────────── */
export default function PagesPage() {
  const [pages, setPages]       = useState<StaticPage[]>(INITIAL_PAGES);
  const [search, setSearch]     = useState("");
  const [viewing, setViewing]   = useState<StaticPage | null>(null);
  const [editing, setEditing]   = useState<StaticPage | null>(null);
  const [deleting, setDeleting] = useState<StaticPage | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = pages.filter(p =>
    !search || [p.title, p.slug, p.description].some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  const visibleCount = pages.filter(p => p.status === "Hiển thị").length;
  const hiddenCount  = pages.filter(p => p.status === "Ẩn").length;
  const totalWords   = pages.reduce((s, p) => s + p.wordCount, 0);

  const handleSave = useCallback((data: Partial<StaticPage> & { id?: string }) => {
    if (data.id) {
      setPages(prev => prev.map(p => p.id === data.id ? { ...p, ...data } : p));
    } else {
      setPages(prev => [...prev, { id: `pg-${Date.now()}`, ...data } as StaticPage]);
    }
  }, []);

  const handleDelete = useCallback((id: string) => {
    setPages(prev => prev.filter(p => p.id !== id));
  }, []);

  const handleToggle = useCallback((id: string) => {
    setPages(prev => prev.map(p => p.id === id ? { ...p, status: p.status === "Hiển thị" ? "Ẩn" : "Hiển thị" } : p));
    setViewing(prev => prev?.id === id ? { ...prev, status: prev.status === "Hiển thị" ? "Ẩn" : "Hiển thị" } : prev);
  }, []);

  return (
    <AdminLayout title="Trang" subtitle="Quản lý trang tĩnh website">
      <div className="page-content">

        <StatsGrid cols={4}>
          <StatCard label="Tổng trang" value={pages.length} change={1} changeLabel="so với tháng trước" icon="activity" color="blue" />
          <StatCard label="Đang hiển thị" value={visibleCount} changeLabel="so với tháng trước" icon="activity" color="green" />
          <StatCard label="Đang ẩn" value={hiddenCount} changeLabel="so với tháng trước" icon="activity" color="amber" />
          <StatCard label="Tổng số từ" value={totalWords} suffix=" từ" changeLabel="so với tháng trước" icon="activity" color="purple" />
        </StatsGrid>

        {/* Toolbar */}
        <div className="glass-card" style={{ padding: 16 }}>
          <div className="toolbar">
            <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
              <Search size={13} className="search-icon" />
              <input className="admin-input" placeholder="Tìm trang, slug, mô tả..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => setCreating(true)}>Tạo trang mới</Button>
          </div>
        </div>

        {/* Pages list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(page => {
            const color = getColor(page.slug);
            const isVisible = page.status === "Hiển thị";
            return (
              <div
                key={page.id}
                className="glass-card"
                style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", cursor: "pointer", borderLeft: `3px solid ${color}`, transition: "all 0.15s" }}
                onClick={() => setViewing(page)}
              >
                {/* Icon */}
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}12`, border: `1px solid ${color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {getIcon(page.slug)}
                </div>

                {/* Title + slug */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{page.title}</span>
                    {page.isSystem && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#f59e0b", background: "rgba(245,158,11,0.1)", padding: "1px 6px", borderRadius: 99, flexShrink: 0 }}>HỆ THỐNG</span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: "#3b82f6", display: "flex", alignItems: "center", gap: 4 }}>
                      <ExternalLink size={9} />{page.slug}
                    </span>
                    <span style={{ fontSize: 11, color: "#334155" }}>{page.description.slice(0, 60)}{page.description.length > 60 ? "..." : ""}</span>
                  </div>
                </div>

                {/* Meta */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: isVisible ? "#10b981" : "#64748b", background: isVisible ? "rgba(16,185,129,0.12)" : "rgba(100,116,139,0.12)", padding: "2px 8px", borderRadius: 99 }}>
                    {page.status}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: "#334155" }}>~{page.wordCount} từ</span>
                    <span style={{ fontSize: 10, color: "#334155" }}>{page.updatedAt}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => setViewing(page)} title="Xem" style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid rgba(30,42,80,0.8)", background: "transparent", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Eye size={13} /></button>
                  <button onClick={() => setEditing(page)} title="Sửa" style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid rgba(30,42,80,0.8)", background: "transparent", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Pencil size={13} /></button>
                  {!page.isSystem && (
                    <button onClick={() => setDeleting(page)} title="Xóa" style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid rgba(239,68,68,0.2)", background: "transparent", color: "#f87171", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Trash2 size={13} /></button>
                  )}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="glass-card" style={{ padding: "50px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
              <div style={{ color: "#475569", fontSize: 13 }}>Không tìm thấy trang nào</div>
            </div>
          )}
        </div>

        <div style={{ fontSize: 12, color: "#334155" }}>
          {filtered.length} / {pages.length} trang · Trang đánh dấu <span style={{ color: "#f59e0b", fontWeight: 600 }}>HỆ THỐNG</span> không thể xóa
        </div>
      </div>

      {/* Modals */}
      {creating && <PageFormModal onSave={handleSave} onClose={() => setCreating(false)} />}
      {editing && <PageFormModal page={editing} onSave={handleSave} onClose={() => setEditing(null)} />}
      {viewing && (
        <PagePreviewModal
          page={viewing} onClose={() => setViewing(null)}
          onEdit={() => { setEditing(viewing); setViewing(null); }}
          onToggle={() => handleToggle(viewing.id)}
        />
      )}
      {deleting && <DeleteModal page={deleting} onConfirm={() => handleDelete(deleting.id)} onClose={() => setDeleting(null)} />}
    </AdminLayout>
  );
}
