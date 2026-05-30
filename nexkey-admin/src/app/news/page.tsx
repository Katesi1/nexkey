"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard, StatsGrid } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import {
  Plus, Search, X, Pencil, Trash2, Eye,
  ChevronLeft, ChevronRight, Clock, User, Tag,
  BarChart2,
} from "lucide-react";
import { articlesApi } from "@/lib/api";
import type { ApiMeta } from "@/lib/api";
import type { Article, ArticleStatus, ArticleCategory } from "@/lib/types";

/* ─── Display label maps ─────────────────────────────────────────── */
const STATUS_LABEL: Record<ArticleStatus, string> = {
  DaXuatBan:  "Đã xuất bản",
  Nhap:       "Nháp",
  DaLenLich:  "Đã lên lịch",
};
const STATUS_FROM_LABEL: Record<string, ArticleStatus> = {
  "Đã xuất bản": "DaXuatBan",
  "Nháp":        "Nhap",
  "Đã lên lịch": "DaLenLich",
};
const PAGE_STATUS_LABEL: Record<ArticleStatus, { color: string; bg: string }> = {
  DaXuatBan:  { color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  Nhap:       { color: "#64748b", bg: "rgba(100,116,139,0.12)" },
  DaLenLich:  { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
};

/* ─── Constants ──────────────────────────────────────────────────── */
const TABS = ["Tất cả", "Đã xuất bản", "Nháp", "Đã lên lịch"] as const;
const CATEGORIES: ArticleCategory[] = ["Hướng dẫn", "Tin tức", "Khuyến mãi", "Cập nhật", "Bảo mật"];
const PAGE_SIZE = 6;
const CAT_COLORS: Record<string, string> = {
  "Hướng dẫn": "#3b82f6",
  "Tin tức":   "#8b5cf6",
  "Khuyến mãi":"#ef4444",
  "Cập nhật":  "#10b981",
  "Bảo mật":   "#f59e0b",
};

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

const fmtDate = (d: string) => new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

/* ─── Modal wrapper ──────────────────────────────────────────────── */
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

/* ─── Article Preview Modal ──────────────────────────────────────── */
function PreviewModal({ article, onClose, onEdit, onPublish }: { article: Article; onClose: () => void; onEdit: () => void; onPublish: () => void }) {
  const sc = PAGE_STATUS_LABEL[article.status];
  const cc = CAT_COLORS[article.category] ?? "#3b82f6";
  const statusLabel = STATUS_LABEL[article.status];

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 560, maxWidth: "92vw", maxHeight: "90vh", background: "#080d1c", border: "1px solid rgba(30,42,80,0.7)", borderRadius: 18, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,${cc},transparent)`, flexShrink: 0 }} />

        {/* Thumbnail area */}
        <div style={{ height: 160, background: `linear-gradient(135deg,rgba(${cc === "#3b82f6" ? "59,130,246" : cc === "#8b5cf6" ? "139,92,246" : cc === "#10b981" ? "16,185,129" : cc === "#f59e0b" ? "245,158,11" : "239,68,68"},0.12),rgba(13,18,38,1))`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
          <div style={{ fontSize: 52 }}>📰</div>
          <div style={{ position: "absolute", top: 12, right: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: sc.color, background: sc.bg, padding: "3px 10px", borderRadius: 99 }}>{statusLabel}</span>
          </div>
          <button onClick={onClose} style={{ position: "absolute", top: 12, left: 12, width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(0,0,0,0.4)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={14} /></button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: cc, background: `${cc}18`, padding: "2px 10px", borderRadius: 99 }}>{article.category}</span>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", lineHeight: 1.4, margin: "10px 0 10px" }}>{article.title}</h2>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
            {[
              { icon: <User size={12} />, text: article.author },
              ...(article.publishedAt ? [{ icon: <Clock size={12} />, text: fmtDate(article.publishedAt) }] : []),
              ...(article.scheduledAt ? [{ icon: <Clock size={12} />, text: `Lên lịch: ${fmtDate(article.scheduledAt)}` }] : []),
              { icon: <BarChart2 size={12} />, text: `${article.views.toLocaleString("vi-VN")} lượt xem` },
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, color: "#475569", fontSize: 12 }}>
                {row.icon}{row.text}
              </div>
            ))}
          </div>

          <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7 }}>{article.excerpt}</p>

          {article.tags.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 16 }}>
              {article.tags.map(t => (
                <span key={t} style={{ fontSize: 11, color: "#60a5fa", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", padding: "2px 8px", borderRadius: 99 }}>#{t}</span>
              ))}
            </div>
          )}

          <div style={{ marginTop: 16, padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(30,42,80,0.5)", fontFamily: "monospace", fontSize: 11, color: "#475569" }}>
            /{article.slug}
          </div>
        </div>

        <div style={{ padding: "14px 22px", borderTop: "1px solid rgba(30,42,80,0.6)", display: "flex", gap: 10, flexShrink: 0, background: "rgba(255,255,255,0.015)" }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Đóng</Button>
          {article.status !== "DaXuatBan" && (
            <Button variant="secondary" size="sm" onClick={onPublish} style={{ flex: 1 }}>Xuất bản</Button>
          )}
          <Button variant="primary" size="sm" icon={<Pencil size={12} />} style={{ flex: 1 }} onClick={onEdit}>Chỉnh sửa</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Article Form Modal ─────────────────────────────────────────── */
function ArticleFormModal({ article, onSave, onClose }: {
  article?: Article;
  onSave: (data: { id?: string; title: string; slug: string; excerpt: string; category: ArticleCategory; status: ArticleStatus; tags: string[]; scheduledAt?: string }) => void;
  onClose: () => void;
}) {
  const isEdit = !!article;
  const [title, setTitle]         = useState(article?.title ?? "");
  const [slug, setSlug]           = useState(article?.slug ?? "");
  const [excerpt, setExcerpt]     = useState(article?.excerpt ?? "");
  const [category, setCategory]   = useState<ArticleCategory>(article?.category ?? CATEGORIES[0]);
  const [status, setStatus]       = useState<ArticleStatus>(article?.status ?? "Nhap");
  const [tags, setTags]           = useState(article?.tags.join(", ") ?? "");
  const [scheduledAt, setScheduledAt] = useState(article?.scheduledAt?.slice(0, 16) ?? "");
  const [errors, setErrors]       = useState<Record<string, string>>({});

  const cc = CAT_COLORS[category] ?? "#3b82f6";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Bắt buộc";
    if (!excerpt.trim()) e.excerpt = "Bắt buộc";
    if (status === "DaLenLich" && !scheduledAt) e.scheduledAt = "Chọn thời gian";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({
      id: article?.id,
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      excerpt: excerpt.trim(),
      category,
      status,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      scheduledAt: status === "DaLenLich" && scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
    });
    onClose();
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, background: "#060a15", border: "1px solid rgba(30,42,80,0.9)", color: "#e2e8f0", outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 560, maxWidth: "94vw", maxHeight: "90vh", background: "#080d1c", border: "1px solid rgba(30,42,80,0.7)", borderRadius: 18, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,${cc},transparent)`, flexShrink: 0, transition: "background 0.3s" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid rgba(30,42,80,0.6)", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>{isEdit ? "Chỉnh sửa bài viết" : "Viết bài mới"}</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 3 }}>{isEdit ? article.title : "Tạo bài viết mới cho blog"}</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Tiêu đề <span style={{ color: "#ef4444" }}>*</span></label>
            <input style={{ ...inputStyle, borderColor: errors.title ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={title} onChange={e => { setTitle(e.target.value); setSlug(slugify(e.target.value)); }} placeholder="Tiêu đề bài viết..." />
            {errors.title && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.title}</span>}
          </div>

          <div>
            <label style={labelStyle}>Slug (đường dẫn)</label>
            <input style={{ ...inputStyle, fontFamily: "monospace", fontSize: 12 }} value={slug} onChange={e => setSlug(e.target.value)} placeholder="tieu-de-bai-viet" />
          </div>

          <div>
            <label style={labelStyle}>Mô tả ngắn <span style={{ color: "#ef4444" }}>*</span></label>
            <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical", borderColor: errors.excerpt ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Tóm tắt nội dung bài viết..." />
            {errors.excerpt && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.excerpt}</span>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Danh mục</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={category} onChange={e => setCategory(e.target.value as ArticleCategory)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Trạng thái</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={status} onChange={e => setStatus(e.target.value as ArticleStatus)}>
                <option value="Nhap">Nháp</option>
                <option value="DaXuatBan">Đã xuất bản</option>
                <option value="DaLenLich">Đã lên lịch</option>
              </select>
            </div>
          </div>

          {status === "DaLenLich" && (
            <div>
              <label style={labelStyle}>Thời gian xuất bản <span style={{ color: "#ef4444" }}>*</span></label>
              <input type="datetime-local" style={{ ...inputStyle, colorScheme: "dark", borderColor: errors.scheduledAt ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} />
              {errors.scheduledAt && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.scheduledAt}</span>}
            </div>
          )}

          <div>
            <label style={labelStyle}>Tags <span style={{ fontSize: 10, fontWeight: 400, textTransform: "none", color: "#334155" }}>(cách nhau bằng dấu phẩy)</span></label>
            <input style={inputStyle} value={tags} onChange={e => setTags(e.target.value)} placeholder="windows, kích hoạt, hướng dẫn" />
          </div>
        </div>

        <div style={{ padding: "14px 22px", borderTop: "1px solid rgba(30,42,80,0.6)", display: "flex", gap: 10, flexShrink: 0, background: "rgba(255,255,255,0.015)" }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} icon={isEdit ? <Pencil size={13} /> : <Plus size={13} />} style={{ flex: 2 }}>
            {isEdit ? "Lưu thay đổi" : "Đăng bài"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Delete Modal ───────────────────────────────────────────── */
function DeleteModal({ article, onConfirm, onClose }: { article: Article; onConfirm: () => void; onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div style={{ width: 360, maxWidth: "90vw", background: "#0d1226", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div style={{ padding: "24px 24px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>Xóa bài viết?</div>
          <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
            Bài viết <strong style={{ color: "#cbd5e1" }}>{article.title}</strong> sẽ bị xóa vĩnh viễn.
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

/* ─── Article Card ───────────────────────────────────────────── */
function ArticleCard({ article, onView, onEdit, onDelete }: {
  article: Article;
  onView: () => void; onEdit: () => void; onDelete: () => void;
}) {
  const sc = PAGE_STATUS_LABEL[article.status];
  const cc = CAT_COLORS[article.category] ?? "#3b82f6";
  const statusLabel = STATUS_LABEL[article.status];

  return (
    <div className="glass-card" style={{ overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer", borderColor: `${cc}20` }} onClick={onView}>
      {/* Header strip */}
      <div style={{ height: 5, background: `linear-gradient(90deg,${cc},transparent)` }} />

      {/* Thumbnail placeholder */}
      <div style={{ height: 120, background: `linear-gradient(135deg,rgba(13,18,38,1),rgba(22,32,64,1))`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at top left,${cc}12,transparent 60%)` }} />
        <div style={{ fontSize: 36, zIndex: 1 }}>
          {article.category === "Hướng dẫn" ? "📖" : article.category === "Khuyến mãi" ? "🎁" : article.category === "Bảo mật" ? "🔒" : article.category === "Cập nhật" ? "🔄" : "📰"}
        </div>
        <div style={{ position: "absolute", bottom: 8, right: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: sc.color, background: sc.bg, padding: "2px 8px", borderRadius: 99 }}>{statusLabel}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: cc, background: `${cc}15`, padding: "1px 8px", borderRadius: 99 }}>{article.category}</span>
          {article.views > 0 && (
            <span style={{ fontSize: 10, color: "#475569", display: "flex", alignItems: "center", gap: 3 }}>
              <BarChart2 size={10} />{article.views.toLocaleString("vi-VN")}
            </span>
          )}
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {article.title}
        </div>

        <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {article.excerpt}
        </div>

        {article.tags.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {article.tags.slice(0, 3).map(t => (
              <span key={t} style={{ fontSize: 10, color: "#334155", background: "rgba(30,42,80,0.8)", padding: "1px 6px", borderRadius: 99 }}>#{t}</span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#334155", fontSize: 10 }}>
            <User size={10} />{article.author}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#334155", fontSize: 10 }}>
            <Clock size={10} />
            {article.publishedAt ? fmtDate(article.publishedAt) : article.scheduledAt ? `Lên lịch ${fmtDate(article.scheduledAt)}` : fmtDate(article.createdAt)}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 4, padding: "10px 12px 12px", borderTop: "1px solid rgba(30,42,80,0.5)" }} onClick={e => e.stopPropagation()}>
        <button onClick={onView} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center", gap: 5, fontSize: 11 }}><Eye size={11} /> Xem</button>
        <button onClick={onEdit} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center", gap: 5, fontSize: 11 }}><Pencil size={11} /> Sửa</button>
        <button onClick={onDelete} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center", gap: 5, fontSize: 11, color: "#f87171" }}><Trash2 size={11} /> Xóa</button>
      </div>
    </div>
  );
}

/* ─── Pagination Button ──────────────────────────────────────────── */
function PagBtn({ children, onClick, disabled = false, active = false }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; active?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: 30, height: 30, borderRadius: 6, fontSize: 12, fontWeight: active ? 700 : 400, cursor: disabled ? "default" : "pointer", border: "1px solid", borderColor: active ? "#3b82f6" : "rgba(30,42,80,0.8)", background: active ? "rgba(59,130,246,0.15)" : "transparent", color: disabled ? "#334155" : active ? "#60a5fa" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
      {children}
    </button>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
export default function NewsPage() {
  const [articles, setArticles]   = useState<Article[]>([]);
  const [loading, setLoading]     = useState(true);
  const [apiError, setApiError]   = useState<string | null>(null);
  const [meta, setMeta]           = useState<ApiMeta>({ total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 });
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [search, setSearch]       = useState("");
  const [page, setPage]           = useState(1);
  const [viewing, setViewing]     = useState<Article | null>(null);
  const [editing, setEditing]     = useState<Article | null>(null);
  const [deleting, setDeleting]   = useState<Article | null>(null);
  const [creating, setCreating]   = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const statusParam = activeTab === "Tất cả" ? undefined : STATUS_FROM_LABEL[activeTab];
      const result = await articlesApi.list({ page, limit: PAGE_SIZE, search: search || undefined, status: statusParam });
      setArticles(result.data);
      setMeta(result.meta);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }, [page, search, activeTab]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const count = (tab: string) => {
    if (tab === "Tất cả") return meta.total;
    return articles.filter(a => STATUS_LABEL[a.status] === tab).length;
  };
  const totalViews = articles.reduce((s, a) => s + a.views, 0);
  const publishedCount = articles.filter(a => a.status === "DaXuatBan").length;
  const draftCount = articles.filter(a => a.status === "Nhap").length;

  const handleSave = useCallback(async (data: { id?: string; title: string; slug: string; excerpt: string; category: ArticleCategory; status: ArticleStatus; tags: string[]; scheduledAt?: string }) => {
    try {
      if (data.id) {
        await articlesApi.update(data.id, data);
      } else {
        await articlesApi.create(data);
      }
      await fetchData();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }, [fetchData]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await articlesApi.delete(id);
      await fetchData();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }, [fetchData]);

  const handlePublish = useCallback(async (id: string) => {
    try {
      await articlesApi.publish(id);
      await fetchData();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }, [fetchData]);

  return (
    <AdminLayout title="Tin tức" subtitle="Quản lý bài viết và blog">
      <div className="page-content">

        <StatsGrid cols={4}>
          <StatCard label="Tổng bài viết" value={meta.total} change={3} changeLabel="so với tháng trước" icon="activity" color="blue" />
          <StatCard label="Đã xuất bản" value={publishedCount} change={2} changeLabel="so với tháng trước" icon="activity" color="green" />
          <StatCard label="Bản nháp" value={draftCount} changeLabel="so với tháng trước" icon="activity" color="amber" />
          <StatCard label="Tổng lượt xem" value={totalViews} change={18} changeLabel="so với tháng trước" icon="activity" color="purple" />
        </StatsGrid>

        {apiError && (
          <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontSize: 13 }}>
            {apiError}
          </div>
        )}

        {/* Toolbar */}
        <div className="glass-card" style={{ padding: 16 }}>
          <div className="toolbar">
            <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
              <Search size={13} className="search-icon" />
              <input className="admin-input" placeholder="Tìm bài viết, danh mục, tag..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => setCreating(true)}>Viết bài mới</Button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, marginTop: 14, borderBottom: "1px solid rgba(30,42,80,0.6)" }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} className={`tab-btn ${activeTab === tab ? "tab-btn-active" : "tab-btn-inactive"}`}>
                {tab}
                <span className={`tab-count ${activeTab === tab ? "tab-count-active" : "tab-count-inactive"}`}>{count(tab)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category chips */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map(cat => {
            const cc = CAT_COLORS[cat] ?? "#3b82f6";
            const cnt = articles.filter(a => a.category === cat).length;
            return (
              <div key={cat} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 99, background: `${cc}10`, border: `1px solid ${cc}25`, fontSize: 12, color: cc, fontWeight: 600, cursor: "pointer" }}
                onClick={() => setSearch(cat)}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: cc, display: "inline-block" }} />
                {cat} <span style={{ fontWeight: 400, color: "#64748b" }}>({cnt})</span>
              </div>
            );
          })}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="glass-card" style={{ padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <span style={{ display: "inline-block", width: 20, height: 20, border: "2px solid #334155", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          </div>
        ) : articles.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 16 }}>
            {articles.map(article => (
              <ArticleCard
                key={article.id}
                article={article}
                onView={() => setViewing(article)}
                onEdit={() => setEditing(article)}
                onDelete={() => setDeleting(article)}
              />
            ))}

            {/* Add new card */}
            <div onClick={() => setCreating(true)} style={{ minHeight: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, border: "2px dashed rgba(30,42,80,0.8)", borderRadius: 14, background: "rgba(13,18,38,0.3)", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(59,130,246,0.4)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(59,130,246,0.04)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(30,42,80,0.8)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(13,18,38,0.3)"; }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Plus size={22} style={{ color: "#3b82f6" }} />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>Viết bài mới</div>
                <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>Click để tạo bài viết</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card" style={{ padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 48 }}>📰</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#475569" }}>Không tìm thấy bài viết</div>
            <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => setCreating(true)}>Viết bài mới</Button>
          </div>
        )}

        {/* Pagination */}
        {meta.total > 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#475569" }}>
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, meta.total)} / {meta.total} bài viết
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              <PagBtn onClick={() => setPage(p => p - 1)} disabled={page === 1}><ChevronLeft size={14} /></PagBtn>
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
                <PagBtn key={p} onClick={() => setPage(p)} active={p === page}>{p}</PagBtn>
              ))}
              <PagBtn onClick={() => setPage(p => p + 1)} disabled={page === meta.totalPages}><ChevronRight size={14} /></PagBtn>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {creating && <ArticleFormModal onSave={handleSave} onClose={() => setCreating(false)} />}
      {editing && <ArticleFormModal article={editing} onSave={handleSave} onClose={() => setEditing(null)} />}
      {viewing && (
        <PreviewModal
          article={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => { setEditing(viewing); setViewing(null); }}
          onPublish={() => { handlePublish(viewing.id); setViewing(null); }}
        />
      )}
      {deleting && <DeleteModal article={deleting} onConfirm={() => handleDelete(deleting.id)} onClose={() => setDeleting(null)} />}
    </AdminLayout>
  );
}
