"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard, StatsGrid } from "@/components/ui/StatCard";
import { useNotifications } from "@/store/NotificationContext";
import { timeAgo, formatDateTime } from "@/lib/utils";
import {
  ShoppingCart, Users, Package, KeyRound, CreditCard,
  ShieldCheck, Search, Bell, CheckCheck, ChevronLeft, ChevronRight, Filter,
} from "lucide-react";


/* ─── Icon + color config (matching Topbar notif) ─────────────── */
const TYPE_CFG: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string; emoji: string }> = {
  order:    { icon: <ShoppingCart size={14} />, color: "#3b82f6", bg: "rgba(59,130,246,0.12)",  label: "Đơn hàng",  emoji: "🛒" },
  customer: { icon: <Users size={14} />,        color: "#10b981", bg: "rgba(16,185,129,0.12)",  label: "Khách hàng", emoji: "👤" },
  product:  { icon: <Package size={14} />,      color: "#8b5cf6", bg: "rgba(139,92,246,0.12)",  label: "Sản phẩm",  emoji: "📦" },
  key:      { icon: <KeyRound size={14} />,     color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  label: "Key",        emoji: "🔑" },
  payment:  { icon: <CreditCard size={14} />,   color: "#06b6d4", bg: "rgba(6,182,212,0.12)",   label: "Thanh toán", emoji: "💰" },
  admin:    { icon: <ShieldCheck size={14} />,  color: "#94a3b8", bg: "rgba(148,163,184,0.08)", label: "Hệ thống",  emoji: "⚙️" },
};

const TABS = ["Tất cả", "Đơn hàng", "Khách hàng", "Sản phẩm", "Key", "Thanh toán", "Hệ thống"] as const;
const TAB_TYPE_MAP: Record<string, string> = {
  "Đơn hàng": "order", "Khách hàng": "customer", "Sản phẩm": "product",
  "Key": "key", "Thanh toán": "payment", "Hệ thống": "admin",
};
const PAGE_SIZE = 10;

function PagBtn({ children, onClick, disabled = false, active = false }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; active?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: 30, height: 30, borderRadius: 6, fontSize: 12, fontWeight: active ? 700 : 400, cursor: disabled ? "default" : "pointer", border: "1px solid", borderColor: active ? "#3b82f6" : "rgba(30,42,80,0.8)", background: active ? "rgba(59,130,246,0.15)" : "transparent", color: disabled ? "#334155" : active ? "#60a5fa" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {children}
    </button>
  );
}

export default function LogsPage() {
  const { notifications: logs, unreadCount, markRead, markAllRead } = useNotifications();
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);

  const filtered = logs.filter(l => {
    const typeOk   = activeTab === "Tất cả" || l.type === TAB_TYPE_MAP[activeTab];
    const searchOk = !search || [l.title, l.description].some(s => s.toLowerCase().includes(search.toLowerCase()));
    return typeOk && searchOk;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);


  const countByType = (type: string) => logs.filter(l => l.type === type).length;

  return (
    <AdminLayout title="Nhật ký hệ thống" subtitle="Theo dõi mọi hoạt động trong hệ thống">
      <div className="page-content">

        <StatsGrid cols={4}>
          <StatCard label="Tổng hoạt động" value={logs.length} change={5} changeLabel="so với hôm qua" icon="activity" color="blue" />
          <StatCard label="Chưa đọc" value={unreadCount} changeLabel="thông báo mới" icon="alert" color="rose" />
          <StatCard label="Đơn hàng" value={countByType("order")} changeLabel="sự kiện" icon="cart" color="green" />
          <StatCard label="Hệ thống" value={countByType("admin")} changeLabel="thay đổi" icon="activity" color="purple" />
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
                <button onClick={markAllRead} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#3b82f6", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
                  <CheckCheck size={13} />Đánh dấu tất cả đã đọc
                </button>
              )}
            </div>
          </div>

          {/* Search + filter */}
          <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(30,42,80,0.5)", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }} />
              <input className="admin-input" style={{ paddingLeft: 32, fontSize: 12.5 }} placeholder="Tìm kiếm hoạt động..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#475569", fontSize: 12 }}>
              <Filter size={13} />{filtered.length} kết quả
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, padding: "0 20px", borderBottom: "1px solid rgba(30,42,80,0.5)", overflowX: "auto" }}>
            {TABS.map(tab => {
              const typeKey = TAB_TYPE_MAP[tab];
              const cfg = typeKey ? TYPE_CFG[typeKey] : null;
              const cnt = tab === "Tất cả" ? logs.length : countByType(typeKey);
              return (
                <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }}
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
            {pageItems.length === 0 ? (
              <div style={{ padding: "48px 20px", textAlign: "center", color: "#334155", fontSize: 13 }}>
                Không tìm thấy hoạt động nào
              </div>
            ) : pageItems.map((log, i) => {
              const cfg = TYPE_CFG[log.type] ?? TYPE_CFG.admin;
              return (
                <div
                  key={log.id}
                  onClick={() => markRead(log.id)}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    padding: "12px 20px", cursor: "pointer",
                    background: log.unread ? "rgba(59,130,246,0.04)" : "transparent",
                    borderLeft: log.unread ? "2px solid rgba(59,130,246,0.6)" : "2px solid transparent",
                    borderBottom: i < pageItems.length - 1 ? "1px solid rgba(30,42,80,0.3)" : "none",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={e => { if (!log.unread) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = log.unread ? "rgba(59,130,246,0.04)" : "transparent"; }}
                >
                  {/* Icon — khớp với notification */}
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: cfg.bg, color: cfg.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    {cfg.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: log.unread ? "#e2e8f0" : "#94a3b8", fontWeight: log.unread ? 600 : 400, lineHeight: 1.4, marginBottom: 2 }}>
                      {log.title}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {log.description}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, background: cfg.bg, padding: "1px 7px", borderRadius: 99 }}>{cfg.label}</span>
                      <span style={{ fontSize: 10, color: "#334155" }}>{formatDateTime(log.createdAt)}</span>
                    </div>
                  </div>

                  {/* Right side */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 10.5, color: "#334155", whiteSpace: "nowrap" }}>{timeAgo(log.createdAt)}</span>
                    {log.unread && (
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
              {filtered.length === 0 ? "0" : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)}`} / {filtered.length} hoạt động
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
      </div>
    </AdminLayout>
  );
}
