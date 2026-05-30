"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export const SIDEBAR_W = { open: 256, collapsed: 64 } as const;

type SidebarCtx = { collapsed: boolean; toggle: () => void };

const Ctx = createContext<SidebarCtx>({ collapsed: false, toggle: () => {} });

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("sidebar_collapsed") === "1") setCollapsed(true);
  }, []);

  const toggle = () =>
    setCollapsed(v => {
      localStorage.setItem("sidebar_collapsed", v ? "0" : "1");
      return !v;
    });

  return <Ctx.Provider value={{ collapsed, toggle }}>{children}</Ctx.Provider>;
}

export function useSidebar(): SidebarCtx {
  return useContext(Ctx);
}
