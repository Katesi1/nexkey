"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useSidebar, SIDEBAR_W } from "@/store/SidebarContext";

type Props = { children: React.ReactNode; title: string; subtitle?: string };

export function AdminShell({ children, title, subtitle }: Props) {
  const { collapsed, isMobile, mobileOpen, closeMobile } = useSidebar();
  const ml = isMobile ? 0 : (collapsed ? SIDEBAR_W.collapsed : SIDEBAR_W.open);

  return (
    <div style={{ background: "#070b16", minHeight: "100vh" }}>
      <Sidebar />
      {isMobile && mobileOpen && (
        <div className="sidebar-overlay" onClick={closeMobile} />
      )}
      <div style={{ marginLeft: ml, transition: "margin-left 0.22s ease" }}>
        <Topbar title={title} subtitle={subtitle} />
        <main style={{ paddingTop: 60 }}>{children}</main>
      </div>
    </div>
  );
}
