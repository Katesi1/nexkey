"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingCart, Package, Tag, Users,
  Building2, Warehouse, KeyRound, Image, Newspaper,
  FileText, Settings, CreditCard, ShieldCheck, Activity,
  HelpCircle, PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { useSidebar, SIDEBAR_W } from "@/store/SidebarContext";
import { useAuth } from "@/store/AuthContext";

type NavItem = { label: string; href: string; icon: React.ReactNode; badge?: number };
type NavSection = { title: string; items: NavItem[] };

const NAV: NavSection[] = [
  { title: "", items: [{ label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={15} /> }] },
  { title: "QUẢN LÝ CHUNG", items: [
    { label: "Đơn hàng",      href: "/orders",     icon: <ShoppingCart size={15} />, badge: 128 },
    { label: "Sản phẩm",      href: "/products",   icon: <Package size={15} /> },
    { label: "Danh mục",      href: "/categories", icon: <Tag size={15} /> },
    { label: "Khách hàng",    href: "/customers",  icon: <Users size={15} /> },
    { label: "Nhà cung cấp",  href: "/suppliers",  icon: <Building2 size={15} /> },
    { label: "Kho hàng",      href: "/warehouse",  icon: <Warehouse size={15} /> },
    { label: "Key / License", href: "/keys",       icon: <KeyRound size={15} /> },
  ]},
  { title: "QUẢN LÝ NỘI DUNG", items: [
    { label: "Banner",  href: "/banners", icon: <Image size={15} /> },
    { label: "Tin tức", href: "/news",    icon: <Newspaper size={15} /> },
    { label: "Trang",   href: "/pages",   icon: <FileText size={15} /> },
    { label: "FAQ",     href: "/faq",     icon: <HelpCircle size={15} /> },
  ]},
  { title: "CÀI ĐẶT", items: [
    { label: "Cài đặt chung",          href: "/settings", icon: <Settings size={15} /> },
    { label: "Phương thức thanh toán", href: "/payments", icon: <CreditCard size={15} /> },
    { label: "Quản lý admin",          href: "/admins",   icon: <ShieldCheck size={15} /> },
    { label: "Nhật ký hoạt động",      href: "/logs",     icon: <Activity size={15} /> },
  ]},
];

export function Sidebar() {
  const pathname  = usePathname();
  const { collapsed, mobileOpen, isMobile, toggle } = useSidebar();
  const { user }  = useAuth();

  const showLabels = !collapsed || isMobile;
  const w = (!isMobile && collapsed) ? SIDEBAR_W.collapsed : SIDEBAR_W.open;
  const transform = isMobile
    ? (mobileOpen ? "translateX(0)" : "translateX(-100%)")
    : "translateX(0)";

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <aside style={{
      position: "fixed", left: 0, top: 0, height: "100vh",
      width: w, zIndex: 50, display: "flex", flexDirection: "column",
      background: "#060a15", borderRight: "1px solid rgba(30,42,80,0.7)",
      transform, transition: "transform 0.22s ease, width 0.22s ease", overflow: "hidden",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: showLabels ? "space-between" : "center", padding: showLabels ? "18px 14px 18px 20px" : "18px 0", borderBottom: "1px solid rgba(30,42,80,0.5)", flexShrink: 0, transition: "padding 0.22s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div style={{ width: 36, height: 36, flexShrink: 0, background: "linear-gradient(135deg,#2563eb,#7c3aed)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(59,130,246,0.5)" }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 16, letterSpacing: "-1px" }}>N</span>
          </div>
          {showLabels && (
            <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
              <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: "0.5px", lineHeight: 1, color: "#fff" }}>NEXKEY</div>
              <div style={{ fontSize: 9, color: "#2d3f6b", marginTop: 2, letterSpacing: "0.1em", fontWeight: 600, textTransform: "uppercase" }}>Admin Panel</div>
            </div>
          )}
        </div>
        {showLabels && (
          <button onClick={toggle} title={isMobile ? "Dong menu" : "Thu gon sidebar"} style={{ width: 28, height: 28, borderRadius: 7, flexShrink: 0, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(30,42,80,0.8)", color: "#475569", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}>
            <PanelLeftClose size={14} />
          </button>
        )}
      </div>

      <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: showLabels ? "8px 10px" : "8px 0", scrollbarWidth: "none", transition: "padding 0.22s ease" }}>
        {NAV.map((section, si) => (
          <div key={si} style={{ marginBottom: 6 }}>
            {showLabels && section.title && <div style={{ padding: "10px 10px 5px", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", color: "#2a3a60", textTransform: "uppercase" }}>{section.title}</div>}
            {showLabels && !section.title && si > 0 && <div style={{ height: 4 }} />}
            {!showLabels && si > 0 && <div style={{ height: 1, background: "rgba(30,42,80,0.4)", margin: "6px 10px" }} />}
            {section.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href} title={!showLabels ? item.label : undefined}
                  style={{ display: "flex", alignItems: "center", justifyContent: showLabels ? "flex-start" : "center", gap: showLabels ? 9 : 0, padding: showLabels ? "8px 10px" : "10px 0", borderRadius: 8, marginBottom: 2, marginLeft: showLabels ? 0 : 8, marginRight: showLabels ? 0 : 8, textDecoration: "none", position: "relative", transition: "all 0.13s", ...(active ? { background: "linear-gradient(90deg,#1d4ed8,#7c3aed)", color: "#fff", boxShadow: "0 0 16px rgba(59,130,246,0.3)" } : { color: "#475569", background: "transparent" }) }}
                  className={active ? "" : "sidebar-nav-item"}>
                  <span style={{ color: active ? "#fff" : "#3d5070", flexShrink: 0, display: "flex" }}>{item.icon}</span>
                  {showLabels && (
                    <>
                      <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, flex: 1, whiteSpace: "nowrap", overflow: "hidden" }}>{item.label}</span>
                      {item.badge !== undefined && <span style={{ background: active ? "rgba(255,255,255,0.2)" : "linear-gradient(135deg,#1d4ed8,#7c3aed)", color: "#fff", borderRadius: 99, fontSize: 9.5, fontWeight: 700, minWidth: 20, height: 18, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{item.badge}</span>}
                    </>
                  )}
                  {!showLabels && item.badge !== undefined && <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%", background: "linear-gradient(135deg,#1d4ed8,#7c3aed)", boxShadow: "0 0 6px rgba(59,130,246,0.7)" }} />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={{ display: "flex", alignItems: "center", justifyContent: showLabels ? "flex-start" : "center", gap: showLabels ? 10 : 0, padding: showLabels ? "12px 16px" : "12px 0", borderTop: "1px solid rgba(30,42,80,0.5)", flexShrink: 0, transition: "padding 0.22s ease" }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0 }} title={!showLabels ? (user?.name ?? "Admin") : undefined}>
          {user?.name?.[0]?.toUpperCase() ?? "A"}
        </div>
        {showLabels && (
          <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name ?? "NexKey Admin"}</div>
            <div style={{ fontSize: 10, color: "#3d5070", marginTop: 1 }}>Phien ban 1.0.0</div>
          </div>
        )}
      </div>

      {!isMobile && collapsed && (
        <button onClick={toggle} title="Mo rong sidebar" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 36, background: "transparent", border: "none", borderTop: "1px solid rgba(30,42,80,0.5)", color: "#334155", cursor: "pointer", transition: "color 0.15s", flexShrink: 0 }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#60a5fa"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#334155"; }}>
          <PanelLeftOpen size={14} />
        </button>
      )}

      <style>{".sidebar-nav-item:hover{background:rgba(17,24,48,0.8)!important;color:#94a3b8!important}.sidebar-nav-item:hover span:first-child{color:#60a5fa!important}"}</style>
    </aside>
  );
}
