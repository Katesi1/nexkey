"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard, StatsGrid } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import {
  Plus, Search, X, Pencil, Trash2,
  ChevronDown, ChevronUp, HelpCircle,
  Hash, ToggleLeft, ToggleRight,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { faqApi } from "@/lib/api";
import type { ApiMeta } from "@/lib/api";
import type { FaqItem, FaqStatus, FaqCategory } from "@/lib/types";

/* ─── Display label maps ─────────────────────────────────────────── */
const STATUS_LABEL: Record<FaqStatus, string> = {
  HienThi: "Hiển thị",
  An:      "Ẩn",
};

/* ─── Constants ──────────────────────────────────────────────────── */
const CATEGORIES: FaqCategory[] = ["Sản phẩm", "Thanh toán", "Key & Kích hoạt", "Bảo hành", "Khác"];

const CAT_COLORS: Record<string, string> = {
  "Sản phẩm":         "#3b82f6",
  "Thanh toán":       "#10b981",
  "Key & Kích hoạt":  "#f59e0b",
  "Bảo hành":         "#8b5cf6",
  "Khác":             "#64748b",
};

/* ─── Modal wrapper ──────────────────────────────────────────────── */
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

/* ─── FAQ Form Modal ─────────────────────────────────────────────── */
function FAQFormModal({ faq, onSave, onClose }: {
  faq?: FaqItem;
  onSave: (data: { id?: string; question: string; answer: string; category: FaqCategory; status: FaqStatus; sortOrder: number }) => void;
  onClose: () => void;
}) {
  const isEdit = !!faq;
  const [question, setQuestion] = useState(faq?.question ?? "");
  const [answer, setAnswer]     = useState(faq?.answer ?? "");
  const [category, setCategory] = useState<FaqCategory>(faq?.category ?? CATEGORIES[0]);
  const [status, setStatus]     = useState<FaqStatus>(faq?.status ?? "HienThi");
  const [sortOrder, setSortOrder] = useState(String(faq?.sortOrder ?? 1));
  const [errors, setErrors]     = useState<Record<string, string>>({});

  const color = CAT_COLORS[category] ?? "#3b82f6";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!question.trim()) e.question = "Bắt buộc";
    if (!answer.trim()) e.answer = "Bắt buộc";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ id: faq?.id, question: question.trim(), answer: answer.trim(), category, status, sortOrder: Number(sortOrder) || 1 });
    onClose();
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, background: "#060a15", border: "1px solid rgba(30,42,80,0.9)", color: "#e2e8f0", outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 540, maxWidth: "94vw", maxHeight: "90vh", background: "#080d1c", border: "1px solid rgba(30,42,80,0.7)", borderRadius: 18, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,${color},transparent)`, flexShrink: 0 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid rgba(30,42,80,0.6)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <HelpCircle size={18} style={{ color }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9" }}>{isEdit ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}</div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{category}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Câu hỏi <span style={{ color: "#ef4444" }}>*</span></label>
            <input style={{ ...inputStyle, borderColor: errors.question ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={question} onChange={e => setQuestion(e.target.value)} placeholder="Tôi cần làm gì để kích hoạt key?" />
            {errors.question && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.question}</span>}
          </div>

          <div>
            <label style={labelStyle}>Câu trả lời <span style={{ color: "#ef4444" }}>*</span></label>
            <textarea style={{ ...inputStyle, minHeight: 140, resize: "vertical", lineHeight: 1.7, borderColor: errors.answer ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Nhập câu trả lời chi tiết...&#10;Bạn có thể dùng xuống dòng để tạo danh sách." />
            {errors.answer && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.answer}</span>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: 12 }}>
            <div>
              <label style={labelStyle}>Danh mục</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={category} onChange={e => setCategory(e.target.value as FaqCategory)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
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
              {(["HienThi", "An"] as FaqStatus[]).map(s => (
                <button key={s} onClick={() => setStatus(s)} style={{ flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 13, fontWeight: status === s ? 700 : 400, border: "1px solid", borderColor: status === s ? (s === "HienThi" ? "#10b981" : "#ef4444") : "rgba(30,42,80,0.8)", background: status === s ? (s === "HienThi" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.1)") : "transparent", color: status === s ? (s === "HienThi" ? "#34d399" : "#f87171") : "#64748b", cursor: "pointer" }}>
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: "14px 22px", borderTop: "1px solid rgba(30,42,80,0.6)", display: "flex", gap: 10, flexShrink: 0, background: "rgba(255,255,255,0.015)" }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} icon={isEdit ? <Pencil size={13} /> : <Plus size={13} />} style={{ flex: 2 }}>
            {isEdit ? "Lưu thay đổi" : "Thêm câu hỏi"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Delete Modal ───────────────────────────────────────────────── */
function DeleteModal({ faq, onConfirm, onClose }: { faq: FaqItem; onConfirm: () => void; onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div style={{ width: 360, maxWidth: "90vw", background: "#0d1226", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div style={{ padding: "24px 24px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>Xóa câu hỏi?</div>
          <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
            <strong style={{ color: "#cbd5e1" }}>"{faq.question.slice(0, 60)}{faq.question.length > 60 ? "..." : ""}"</strong> sẽ bị xóa vĩnh viễn.
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

/* ─── FAQ Item Row ───────────────────────────────────────────────── */
function FAQRow({ faq, onEdit, onDelete, onToggle }: {
  faq: FaqItem;
  onEdit: () => void; onDelete: () => void; onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const color = CAT_COLORS[faq.category] ?? "#64748b";
  const isVisible = faq.status === "HienThi";

  return (
    <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(30,42,80,0.5)", overflow: "hidden", borderLeft: `3px solid ${color}40`, transition: "border-color 0.2s" }}>
      {/* Question row */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", cursor: "pointer" }} onClick={() => setExpanded(v => !v)}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <HelpCircle size={14} style={{ color }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: expanded ? "#f1f5f9" : "#cbd5e1", transition: "color 0.15s" }}>
            {faq.question}
          </div>
          {!expanded && (
            <div style={{ fontSize: 11, color: "#334155", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {faq.answer.split("\n")[0]}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color, background: `${color}15`, padding: "2px 8px", borderRadius: 99 }}>{faq.category}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: isVisible ? "#10b981" : "#64748b", background: isVisible ? "rgba(16,185,129,0.1)" : "rgba(100,116,139,0.1)", padding: "2px 8px", borderRadius: 99 }}>{STATUS_LABEL[faq.status]}</span>
          <div style={{ color: "#475569" }}>{expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</div>
        </div>
      </div>

      {/* Answer */}
      {expanded && (
        <div style={{ borderTop: "1px solid rgba(30,42,80,0.5)" }}>
          <div style={{ padding: "14px 18px 14px 60px", background: "rgba(0,0,0,0.15)" }}>
            <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.8, whiteSpace: "pre-line" }}>{faq.answer}</div>
          </div>

          {/* Action bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", borderTop: "1px solid rgba(30,42,80,0.4)", background: "rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Hash size={11} style={{ color: "#334155" }} />
              <span style={{ fontSize: 11, color: "#334155" }}>Thứ tự: {faq.sortOrder}</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={onToggle} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 7, border: "1px solid rgba(30,42,80,0.8)", background: "transparent", color: isVisible ? "#f87171" : "#34d399", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
                {isVisible ? <ToggleLeft size={13} /> : <ToggleRight size={13} />}
                {isVisible ? "Ẩn" : "Hiện"}
              </button>
              <button onClick={onEdit} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 7, border: "1px solid rgba(30,42,80,0.8)", background: "transparent", color: "#94a3b8", fontSize: 11, cursor: "pointer" }}>
                <Pencil size={12} /> Sửa
              </button>
              <button onClick={onDelete} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 7, border: "1px solid rgba(239,68,68,0.2)", background: "transparent", color: "#f87171", fontSize: 11, cursor: "pointer" }}>
                <Trash2 size={12} /> Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const PAGE_SIZE = 5;

function PagBtn({ children, onClick, disabled = false, active = false }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; active?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: 30, height: 30, borderRadius: 6, fontSize: 12, fontWeight: active ? 700 : 400, cursor: disabled ? "default" : "pointer", border: "1px solid", borderColor: active ? "#3b82f6" : "rgba(30,42,80,0.8)", background: active ? "rgba(59,130,246,0.15)" : "transparent", color: disabled ? "#334155" : active ? "#60a5fa" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
      {children}
    </button>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
export default function FAQPage() {
  const [faqs, setFaqs]           = useState<FaqItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [apiError, setApiError]   = useState<string | null>(null);
  const [meta, setMeta]           = useState<ApiMeta>({ total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 });
  const [search, setSearch]       = useState("");
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [page, setPage]           = useState(1);
  const [editing, setEditing]     = useState<FaqItem | null>(null);
  const [deleting, setDeleting]   = useState<FaqItem | null>(null);
  const [creating, setCreating]   = useState(false);

  const TABS = ["Tất cả", ...CATEGORIES];

  const fetchData = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const categoryParam = activeTab === "Tất cả" ? undefined : activeTab;
      const result = await faqApi.list({ page, limit: PAGE_SIZE, search: search || undefined, category: categoryParam });
      setFaqs(result.data);
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
    return faqs.filter(f => f.category === tab).length;
  };
  const visibleCnt = faqs.filter(f => f.status === "HienThi").length;
  const catCount = new Set(faqs.map(f => f.category)).size;

  const handleSave = useCallback(async (data: { id?: string; question: string; answer: string; category: FaqCategory; status: FaqStatus; sortOrder: number }) => {
    try {
      if (data.id) {
        await faqApi.update(data.id, data);
      } else {
        await faqApi.create(data);
      }
      await fetchData();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }, [fetchData]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await faqApi.delete(id);
      await fetchData();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }, [fetchData]);

  const handleToggle = useCallback(async (id: string) => {
    try {
      await faqApi.toggle(id);
      await fetchData();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }, [fetchData]);

  return (
    <AdminLayout title="FAQ" subtitle="Câu hỏi thường gặp">
      <div className="page-content">

        <StatsGrid cols={4}>
          <StatCard label="Tổng câu hỏi" value={meta.total} change={2} changeLabel="so với tháng trước" icon="activity" color="blue" />
          <StatCard label="Đang hiển thị" value={visibleCnt} changeLabel="so với tháng trước" icon="activity" color="green" />
          <StatCard label="Danh mục" value={catCount} changeLabel="so với tháng trước" icon="activity" color="purple" />
          <StatCard label="Đang ẩn" value={faqs.length - visibleCnt} changeLabel="so với tháng trước" icon="activity" color="amber" />
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
              <input className="admin-input" placeholder="Tìm câu hỏi, câu trả lời, danh mục..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => setCreating(true)}>Thêm câu hỏi</Button>
          </div>

          {/* Category tabs */}
          <div style={{ display: "flex", gap: 0, marginTop: 14, borderBottom: "1px solid rgba(30,42,80,0.6)", overflowX: "auto" }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} className={`tab-btn ${activeTab === tab ? "tab-btn-active" : "tab-btn-inactive"}`} style={{ whiteSpace: "nowrap" }}>
                {tab}
                <span className={`tab-count ${activeTab === tab ? "tab-count-active" : "tab-count-inactive"}`}>{count(tab)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category chips summary */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map(cat => {
            const cc  = CAT_COLORS[cat] ?? "#64748b";
            const cnt = faqs.filter(f => f.category === cat).length;
            return (
              <div key={cat} onClick={() => { setActiveTab(cat); setPage(1); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 99, background: `${cc}10`, border: `1px solid ${cc}25`, fontSize: 12, color: cc, fontWeight: 600, cursor: "pointer" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: cc, display: "inline-block" }} />
                {cat} <span style={{ fontWeight: 400, color: "#64748b" }}>({cnt})</span>
              </div>
            );
          })}
        </div>

        {/* FAQ list */}
        {loading ? (
          <div className="glass-card" style={{ padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <span style={{ display: "inline-block", width: 20, height: 20, border: "2px solid #334155", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          </div>
        ) : faqs.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {faqs.map(faq => (
              <FAQRow
                key={faq.id}
                faq={faq}
                onEdit={() => setEditing(faq)}
                onDelete={() => setDeleting(faq)}
                onToggle={() => handleToggle(faq.id)}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <HelpCircle size={48} style={{ color: "#1e3a5f" }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: "#475569" }}>Không tìm thấy câu hỏi</div>
            <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => setCreating(true)}>Thêm câu hỏi</Button>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "#475569" }}>
            {meta.total === 0 ? "0" : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, meta.total)}`} / {meta.total} câu hỏi · Click để xem câu trả lời
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            <PagBtn onClick={() => setPage(p => p - 1)} disabled={page === 1}><ChevronLeft size={14} /></PagBtn>
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
              <PagBtn key={p} onClick={() => setPage(p)} active={p === page}>{p}</PagBtn>
            ))}
            <PagBtn onClick={() => setPage(p => p + 1)} disabled={page === meta.totalPages}><ChevronRight size={14} /></PagBtn>
          </div>
        </div>
      </div>

      {/* Modals */}
      {creating && <FAQFormModal onSave={handleSave} onClose={() => setCreating(false)} />}
      {editing && <FAQFormModal faq={editing} onSave={handleSave} onClose={() => setEditing(null)} />}
      {deleting && <DeleteModal faq={deleting} onConfirm={() => handleDelete(deleting.id)} onClose={() => setDeleting(null)} />}
    </AdminLayout>
  );
}
