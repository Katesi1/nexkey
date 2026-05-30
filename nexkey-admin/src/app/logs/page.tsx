"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard, StatsGrid } from "@/components/ui/StatCard";
import { logsApi } from "@/lib/api";
import type { ApiMeta } from "@/lib/api";
import type { Activity } from "@/lib/types";
import { ActivityLogType } from "@/lib/types";
import { timeAgo, formatDateTime } from "@/lib/utils";
import {
  ShoppingCart, Users, Package, KeyRound, CreditCard,
  ShieldCheck, Search, Bell, CheckCheck, ChevronLeft, ChevronRight, Filter, Trash2,
} from "lucide-react";

type LogEntry = Activity & { isRead: boolean; adminName?: string };

/* ─── Icon + color config (matching Topbar notif) ─────────────── */
const TYPE_CFG: Record<number, { icon: React.ReactNode; color: string; bg: string; label: string; emoji: string }> = {
  [ActivityLogType.Order]:    { icon: <ShoppingCart size={14} />, color: "#3b82f6", bg: "rgba(59,130,246,0.12)",  label: "Đơn hàng",   emoji: "🛒" },
  [ActivityLogType.Customer]: { icon: <Users size={14} />,        color: "#10b981", bg: "rgba(16,185,129,0.12)",  label: "Khách hàng", emoji: "👤" },
  [ActivityLogType.Product]:  { icon: <Package size={14} />,      color: "#8b5cf6", bg: "rgba(139,92,246,0.12)",  label: "Sản phẩm",   emoji: "📦" },
  [ActivityLogType.Key]:      { icon: <KeyRound size={14} />,     color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  label: "Key",         emoji: "🔑" },
  [ActivityLogType.Payment]:  { icon: <CreditCard size={14} />,   color: "#06b6d4", bg: "rgba(6,182,212,0.12)",   label: "Thanh toán",  emoji: "💰" },
  [ActivityLogType.Admin]:    { icon: <ShieldCheck size={14} />,  color: "#94a3b8", bg: "rgba(148,163,184,0.08)", label: "Hệ thống",   emoji: "⚙️" },
};

/* String keys used for API filter params (logsApi.list accepts type?: string) */
const TAB_TYPE_MAP: Record<string, string> = {
  "Đơn hàng": "order", "Khách hàng": "customer", "Sản phẩm": "product",
  "Key": "key", "Thanh toán": "payment", "Hệ thống": "admin",
};
/* Numeric type for local filtering against Activity.type */
const TAB_NUMERIC_MAP: Record<string, number> = {
  "Đơn hàng": ActivityLogType.Order, "Khách hàng": ActivityLogType.Customer,
  "Sản phẩm": ActivityLogType.Product, "Key": ActivityLogType.Key,
  "Thanh toán": ActivityLogType.Payment, "Hệ thống": ActivityLogType.Admin,
};

const TABS = ["Tất cả", "Đơn hàng", "Khách hàng", "Sản phẩm", "Key", "Thanh toán", "Hệ thống"] as const;
const PAGE_SIZE = 10;

function PagBtn({ children, onClick, disabled = false, active = false }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; active?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: 30, height: 30, borderRadius: 6, fontSize: 12, fontWeight: active ? 700 : 400, cursor: disabled ? "default" : "pointer", border: "1px solid", borderColor: active ? "#3b82f6" : "rgba(30,42,80,0.8)", background: active ? "rgba(59,130,246,0.15)" : "transparent", color: disabled ? "#334155" : active ? "#60a5fa" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {children}
    </button>
  );
}

export default function LogsPage() {
  const [logs, setLogs]         = useState<LogEntry[]>([]);
  const [meta, setMeta]         = useState<ApiMeta>({ total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 });
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);
  const [typeCounts, setTypeCounts] = useState<Record<string, number>>({});
  const [unreadCount, setUnreadCount] = useState(0);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchLogs = useCallback((p: number, tab: string, q: string) => {
    const typeKey = TAB_TYPE_MAP[tab];
    setLoading(true);
    logsApi.list({
      page: p,
      limit: PAGE_SIZE,
      search: q || undefined,
      type: typeKey || undefined,
    })
      .then(({ data, meta: m }) => {
        setLogs(data);
        setMeta(m);
        setUnreadCount(data.filter(l => !l.isRead).length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fetch type-counts separately (unfiltered, for tab badges)
  const fetchCounts = useCallback(() => {
    const types = ["order", "customer", "product", "key", "payment", "admin"];
    Promise.all(types.map(t => logsApi.list({ type: t, limit: 1 }).then(r => ({ type: t, total: r.meta.total }))))
      .then(results => {
        const counts: Record<string, number> = {};
        results.forEach(r => { counts[r.type] = r.total; });
        setTypeCounts(counts);
      })
      .catch(() => {});
  }, []);

  useEffect(() => { fetchLogs(1, "Tất cả", ""); fetchCounts(); }, [fetchLogs, fetchCounts]);

  // Re-fetch when tab or page changes
  useEffect(() => { fetchLogs(page, activeTab, search); }, [page, activeTab, fetchLogs]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounce search
  const handleSearch = (q: string) => {
    setSearch(q);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      fetchLogs(1, activeTab, q);
    }, 400);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
    fetchLogs(1, tab, search);
  };

  const handleMarkRead = useCallback((id: string) => {
    logsApi.markRead(id).catch(() => {});
    setLogs(prev => prev.map(l => l.id === id ? { ...l, isRead: true } : l));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const handleMarkAllRead = useCallback(() => {
    logsApi.markAllRead().catch(() => {});
    setLogs(prev => prev.map(l => ({ ...l, isRead: true })));
    setUnreadCount(0);
  }, []);

  const handleDeleteOld = useCallback(() => {
    logsApi.deleteOld(30)
      .then(() => { fetchLogs(1, activeTab, search); fetchCounts(); setPage(1); })
      .catch(() => {});
  }, [activeTab, search, fetchLogs, fetchCounts]);

  const totalPages = meta.totalPages;

  return (
    <AdminLayout title="Nhật ký hệ thống" subtitle="Theo dõi mọi hoạt động trong hệ thống">
      <div className="page-content">

        <StatsGrid cols={4}>
          <StatCard label="Tổng hoạt động" value={meta.total} change={5} changeLabel="so với hôm qua" icon="activity" color="blue" />
          <StatCard label="Chưa đọc" value={unreadCount} changeLabel="thông báo mới" icon="alert" color="rose" />
          <StatCard label="Đơn hàng" value={typeCounts["order"] ?? 0} changeLabel="sự kiện" icon="cart" color="green" />
          <StatCard label="Hệ thống" value={typeCounts["admin"] ?? 0} changeLabel="thay đổi" icon="activity" color="purple" />
        </StatsGrid>

        {/* Main log card — đồng bộ style với notification panel */}
        <div className="glass-card" style={{ overflow: "hidden" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid rgba(30,42,80,0.7)", background: "rgba(6,10,21,0.6)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Bell size={16} style={{ color: "#64748b" }} />
              <span style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 14 }}>Nhật ký hoạt động</span>
              {unreadCount > 0 && (
                <span style={{ background: "#ef4444", color: "#fff", borderRadius: 99, fontSize: 10, fontWeight: 700, padding: "1px 7px", boxShadow: "0 0 8px rgba(239,68,68,0.5)" }}>
                  {unreadCount} mới
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#3b82f6", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
                  <CheckCheck size={13} />Đánh dấu tất cả đã đọc
                </button>
              )}
              <button onClick={handleDeleteOld} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748b", background: "none", border: "1px solid rgba(30,42,80,0.8)", borderRadius: 7, padding: "4px 10px", cursor: "pointer" }}>
                <Trash2 size={12} />Xóa log cũ (30 ngày)
              </button>
            </div>
          </div>

          {/* Search + filter */}
          <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(30,42,80,0.5)", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }} />
              <input className="admin-input" style={{ paddingLeft: 32, fontSize: 12.5 }} placeholder="Tìm kiếm hoạt động..." value={search} onChange={e => handleSearch(e.target.value)} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#475569", fontSize: 12 }}>
              <Filter size={13} />{meta.total} kết quả
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, padding: "0 20px", borderBottom: "1px solid rgba(30,42,80,0.5)", overflowX: "auto" }}>
            {TABS.map(tab => {
              const typeKey = TAB_TYPE_MAP[tab];
              const numericKey = TAB_NUMERIC_MAP[tab];
              const cfg = numericKey !== undefined ? TYPE_CFG[numericKey] : null;
              const cnt = tab === "Tất cả" ? meta.total : (typeCounts[typeKey] ?? 0);
              return (
                <button key={tab} onClick={() => handleTabChange(tab)}
                  className={`tab-btn ${activeTab === tab ? "tab-btn-active" : "tab-btn-inactive"}`}
                  style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5 }}>
                  {cfg && <span style={{ color: activeTab === tab ? cfg.color : "#475569", fontSize: 13 }}>{cfg.emoji}</span>}
                  {tab}
                  <span className={`tab-count ${activeTab === tab ? "tab-count-active" : "tab-count-inactive"}`}>{cnt}</span>
                </button>
              );
            })}
          </div>

          {/* Log entries — đồng bộ style với notification dropdown */}
          <div>
            {loading ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <span style={{ display: "inline-block", width: 24, height: 24, border: "2px solid #334155", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              </div>
            ) : logs.length === 0 ? (
              <div style={{ padding: "48px 20px", textAlign: "center", color: "#334155", fontSize: 13 }}>
                Không tìm thấy hoạt động nào
              </div>
            ) : logs.map((log, i) => {
              const cfg = TYPE_CFG[log.type] ?? TYPE_CFG[ActivityLogType.Admin];
              const isUnread = !log.isRead;
              return (
                <div
                  key={log.id}
                  onClick={() => isUnread && handleMarkRead(log.id)}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    padding: "12px 20px", cursor: isUnread ? "pointer" : "default",
                    background: isUnread ? "rgba(59,130,246,0.04)" : "transparent",
                    borderLeft: isUnread ? "2px solid rgba(59,130,246,0.6)" : "2px solid transparent",
                    borderBottom: i < logs.length - 1 ? "1px solid rgba(30,42,80,0.3)" : "none",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={e => { if (!isUnread) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = isUnread ? "rgba(59,130,246,0.04)" : "transparent"; }}
                >
                  {/* Icon — khớp với notification */}
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: cfg.bg, color: cfg.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    {cfg.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: isUnread ? "#e2e8f0" : "#94a3b8", fontWeight: isUnread ? 600 : 400, lineHeight: 1.4, marginBottom: 2 }}>
                      {log.title}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {log.description}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, background: cfg.bg, padding: "1px 7px", borderRadius: 99 }}>{cfg.label}</span>
                      <span style={{ fontSize: 10, color: "#334155" }}>{formatDateTime(log.createdAt)}</span>
                      {log.adminName && <span style={{ fontSize: 10, color: "#475569" }}>bởi {log.adminName}</span>}
                    </div>
                  </div>

                  {/* Right side */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 10.5, color: "#334155", whiteSpace: "nowrap" }}>{timeAgo(log.createdAt)}</span>
                    {isUnread && (
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", boxShadow: "0 0 6px rgba(59,130,246,0.6)", display: "block" }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination footer */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: "1px solid rgba(30,42,80,0.5)", background: "rgba(6,10,21,0.4)" }}>
            <span style={{ fontSize: 11, color: "#475569" }}>
              {meta.total === 0 ? "0" : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, meta.total)}`} / {meta.total} hoạt động
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              <PagBtn onClick={() => setPage(p => p - 1)} disabled={page === 1}><ChevronLeft size={14} /></PagBtn>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                <PagBtn key={p} onClick={() => setPage(p)} active={p === page}>{p}</PagBtn>
              ))}
              <PagBtn onClick={() => setPage(p => p + 1)} disabled={page === totalPages}><ChevronRight size={14} /></PagBtn>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
