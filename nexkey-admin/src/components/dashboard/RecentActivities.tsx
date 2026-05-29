"use client";

import { useState, useEffect } from "react";
import { logsApi } from "@/lib/api";
import { timeAgo } from "@/lib/utils";
import { ShoppingCart, Users, Package, KeyRound, CreditCard, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import type { Activity } from "@/lib/types";

const activityIcons: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  order:    { icon: <ShoppingCart size={13} />, color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
  customer: { icon: <Users size={13} />,        color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  product:  { icon: <Package size={13} />,      color: "#8b5cf6", bg: "rgba(139,92,246,0.15)" },
  key:      { icon: <KeyRound size={13} />,     color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  payment:  { icon: <CreditCard size={13} />,   color: "#06b6d4", bg: "rgba(6,182,212,0.15)" },
  admin:    { icon: <ShieldCheck size={13} />,  color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
};

const PAGE_SIZE = 4;

export function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    logsApi.list({ limit: 20 }).then(({ data }) => {
      setActivities(data);
    }).catch(() => {});
  }, []);

  const totalPages = Math.max(1, Math.ceil(activities.length / PAGE_SIZE));
  const pageItems = activities.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="glass-card" style={{ padding: "20px 24px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Hoạt động gần đây
        </div>
        <span style={{ fontSize: 11, color: "#3b82f6", cursor: "pointer" }}>Xem tất cả →</span>
      </div>

      <div>
        {pageItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#334155", fontSize: 12 }}>
            Chưa có hoạt động
          </div>
        ) : pageItems.map((activity, i) => {
          const meta = activityIcons[activity.type] ?? activityIcons.admin;
          const isLast = i === pageItems.length - 1;
          return (
            <div key={activity.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: isLast ? "none" : "1px solid rgba(30,42,80,0.5)" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: meta.bg, color: meta.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                {meta.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#cbd5e1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {activity.title}
                </div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {activity.description}
                </div>
              </div>
              <div style={{ fontSize: 10, color: "#334155", flexShrink: 0 }}>
                {timeAgo(activity.createdAt)}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0 14px", borderTop: "1px solid rgba(30,42,80,0.5)" }}>
        <span style={{ fontSize: 11, color: "#475569" }}>Trang {page}/{totalPages}</span>
        <div style={{ display: "flex", gap: 4 }}>
          <PagBtn onClick={() => setPage(p => p - 1)} disabled={page === 1}><ChevronLeft size={13} /></PagBtn>
          <PagBtn onClick={() => setPage(p => p + 1)} disabled={page === totalPages}><ChevronRight size={13} /></PagBtn>
        </div>
      </div>
    </div>
  );
}

function PagBtn({ children, onClick, disabled = false }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: 26, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", cursor: disabled ? "default" : "pointer", border: "1px solid rgba(30,42,80,0.8)", background: "transparent", color: disabled ? "#334155" : "#94a3b8", transition: "all 0.15s" }}>
      {children}
    </button>
  );
}
