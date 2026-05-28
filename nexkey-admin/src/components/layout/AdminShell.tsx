"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

type Props = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
};

export function AdminShell({ children, title, subtitle }: Props) {
  return (
    <div style={{ background: "#070b16", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 256 }}>
        <Topbar title={title} subtitle={subtitle} />
        <main style={{ paddingTop: 60 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
