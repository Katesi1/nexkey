"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Search, ChevronDown, Settings, LogOut, User, Plus, Command, CheckCheck, Menu } from "lucide-react";
import { useNotifications } from "@/store/NotificationContext";
import { useAuth } from "@/store/AuthContext";
import { useSidebar, SIDEBAR_W } from "@/store/SidebarContext";
import { timeAgo } from "@/lib/utils";
import { ActivityLogType } from "@/lib/types";

const TYPE_EMOJI: Record<number, string> = {
  [ActivityLogType.Order]:    "🛒",
  [ActivityLogType.Customer]: "👤",
  [ActivityLogType.Product]:  "📦",
  [ActivityLogType.Key]:      "🔑",
  [ActivityLogType.Payment]:  "💰",
  [ActivityLogType.Admin]:    "⚙️",
};

type TopbarProps = { title: string; subtitle?: string };

export function Topbar({ title, subtitle }: TopbarProps) {
  const { user, logout } = useAuth();
  const { collapsed, toggle } = useSidebar();
  const sidebarLeft = collapsed ? SIDEBAR_W.collapsed : SIDEBAR_W.open;
  const [showNotif, setShowNotif]     = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  // Chỉ lấy 5 notif mới nhất cho dropdown
  const recentNotifs = notifications.slice(0, 5);

  const closeAll = () => { setShowNotif(false); setShowProfile(false); };

  return (
    <>
      {(showNotif || showProfile) && (
        <div style={{ position: "fixed", inset: 0, zIndex: 39 }} onClick={closeAll} />
      )}

      <header style={{ position: "fixed", top: 0, right: 0, left: sidebarLeft, height: 60, zIndex: 40, transition: "left 0.22s ease", display: "flex", alignItems: "center", gap: 12, padding: "0 20px", background: "rgba(6,10,21,0.92)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: "1px solid rgba(30,42,80,0.7)", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
        <button onClick={toggle} className="topbar-hamburger" style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(17,24,48,0.9)", border: "1px solid rgba(30,42,80,0.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b", flexShrink: 0 }}><Menu size={16} /></button>

        {/* Page title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", letterSpacing: "-0.2px", lineHeight: 1.2 }}>{title}</h1>
            {subtitle && (<><span style={{ color: "#1e2a50" }}>/</span><span style={{ fontSize: 12, color: "#475569" }}>{subtitle}</span></>)}
          </div>
        </div>

        {/* Search */}
        <div className="topbar-search" style={{ position: "relative", width: 260 }}>
          <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }} />
          <input type="text" placeholder="Tìm kiếm..." className="admin-input" style={{ paddingLeft: 30, paddingTop: 7, paddingBottom: 7, fontSize: 12.5 }} />
          <div style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 2, background: "rgba(30,42,80,0.5)", borderRadius: 5, padding: "1px 5px" }}>
            <Command size={9} style={{ color: "#475569" }} />
            <span style={{ fontSize: 9, color: "#475569", fontWeight: 600 }}>K</span>
          </div>
        </div>

        {/* Quick create */}
        <button className="btn btn-primary btn-sm topbar-create" style={{ gap: 5, padding: "6px 12px" }}>
          <Plus size={13} />Tạo mới
        </button>

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
            style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(17,24,48,0.9)", border: "1px solid rgba(30,42,80,0.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", color: "#64748b", transition: "all 0.15s" }}
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span style={{ position: "absolute", top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 99, background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px", boxShadow: "0 0 6px rgba(239,68,68,0.7)", border: "1.5px solid #060a15" }}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="glass-card animate-fade-in" style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 320, zIndex: 50 }}>
              {/* Header */}
              <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(30,42,80,0.7)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 13 }}>Thông báo</span>
                  {unreadCount > 0 && (
                    <span style={{ background: "#ef4444", color: "#fff", borderRadius: 99, fontSize: 9, fontWeight: 700, padding: "1px 6px" }}>{unreadCount}</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#3b82f6", background: "none", border: "none", cursor: "pointer" }}>
                    <CheckCheck size={12} />Đọc hết
                  </button>
                )}
              </div>

              {/* Items */}
              {recentNotifs.map(n => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  style={{ padding: "10px 16px", cursor: "pointer", background: n.unread ? "rgba(59,130,246,0.04)" : "transparent", borderLeft: n.unread ? "2px solid rgba(59,130,246,0.6)" : "2px solid transparent", transition: "background 0.12s" }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{TYPE_EMOJI[n.type] ?? "🔔"}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: n.unread ? "#e2e8f0" : "#94a3b8", lineHeight: 1.4, fontWeight: n.unread ? 500 : 400 }}>{n.title}</div>
                      <div style={{ fontSize: 10.5, color: "#475569", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.description}</div>
                      <div style={{ fontSize: 10, color: "#334155", marginTop: 2 }}>{timeAgo(n.createdAt)}</div>
                    </div>
                    {n.unread && (
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", flexShrink: 0, marginTop: 4, boxShadow: "0 0 6px rgba(59,130,246,0.6)" }} />
                    )}
                  </div>
                </div>
              ))}

              {/* Footer */}
              <Link href="/logs" onClick={closeAll} style={{ display: "block", padding: "10px 16px", borderTop: "1px solid rgba(30,42,80,0.7)", textAlign: "center", fontSize: 11.5, color: "#3b82f6", textDecoration: "none" }}>
                Xem tất cả nhật ký hệ thống →
              </Link>
            </div>
          )}
        </div>

        {/* Admin profile */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px 4px 4px", borderRadius: 9, background: "rgba(17,24,48,0.9)", border: "1px solid rgba(30,42,80,0.9)", cursor: "pointer", transition: "all 0.15s" }}
          >
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12 }}>
              {user?.name?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.1 }}>{user?.name ?? "Admin"}</div>
              <div style={{ fontSize: 10, color: "#475569" }}>{user?.role?.name ?? "Admin"}</div>
            </div>
            <ChevronDown size={11} style={{ color: "#475569" }} />
          </button>

          {showProfile && (
            <div className="glass-card animate-fade-in" style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 200, zIndex: 50, padding: 6 }}>
              <Link href="/profile" onClick={closeAll} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 7, color: "#cbd5e1", fontSize: 13, textDecoration: "none", transition: "background 0.12s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <User size={13} style={{ color: "#64748b" }} />Hồ sơ cá nhân
              </Link>
              <Link href="/settings" onClick={closeAll} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 7, color: "#cbd5e1", fontSize: 13, textDecoration: "none", transition: "background 0.12s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <Settings size={13} style={{ color: "#64748b" }} />Cài đặt
              </Link>
              <div style={{ height: 1, background: "rgba(30,42,80,0.8)", margin: "4px 0" }} />
              <button onClick={() => { closeAll(); logout(); }} className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "flex-start", padding: "8px 10px", color: "#f87171", gap: 8, borderRadius: 7 }}>
                <LogOut size={13} />Đăng xuất
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
