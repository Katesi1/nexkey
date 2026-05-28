import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

type AdminLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
};

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
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
