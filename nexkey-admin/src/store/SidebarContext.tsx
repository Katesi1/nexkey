"use client";

import {
  createContext, useContext, useState, useEffect, useCallback, type ReactNode,
} from "react";

export const SIDEBAR_W = { open: 256, collapsed: 64 } as const;

type SidebarCtx = {
  collapsed: boolean;
  mobileOpen: boolean;
  isMobile: boolean;
  sidebarW: number;
  toggle: () => void;
  closeMobile: () => void;
};

const Ctx = createContext<SidebarCtx>({
  collapsed: false, mobileOpen: false, isMobile: false, sidebarW: 256,
  toggle: () => {}, closeMobile: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile]     = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = (matches: boolean) => {
      setIsMobile(matches);
      if (!matches && localStorage.getItem("sidebar_collapsed") === "1") setCollapsed(true);
    };
    update(mq.matches);
    const h = (e: MediaQueryListEvent) => { setIsMobile(e.matches); if (e.matches) setMobileOpen(false); };
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const toggle = useCallback(() => {
    if (isMobile) {
      setMobileOpen(v => !v);
    } else {
      setCollapsed(v => {
        localStorage.setItem("sidebar_collapsed", v ? "0" : "1");
        return !v;
      });
    }
  }, [isMobile]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const sidebarW = isMobile ? SIDEBAR_W.open : (collapsed ? SIDEBAR_W.collapsed : SIDEBAR_W.open);

  return (
    <Ctx.Provider value={{ collapsed: isMobile ? false : collapsed, mobileOpen, isMobile, sidebarW, toggle, closeMobile }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSidebar(): SidebarCtx {
  return useContext(Ctx);
}
